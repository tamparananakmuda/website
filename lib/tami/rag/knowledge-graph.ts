import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { mistral } from '../mistral/client';
import { CitationRef } from '../cognitive/types';
import { rerankResponseSchema } from '../validation/schemas';
import { parseAndValidate } from '../validation/parse';

export interface ArticleChunk {
  id: string;
  slug: string;
  title: string;
  type: 'article' | 'series' | 'whitepaper';
  seriesName?: string;
  seriesOrder?: number;
  text: string;
  embedding?: number[];
}

const CACHE_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'embeddings-cache.json');
const SEARCH_INDEX_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'search-index.json');

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── BM25 Keyword Search ─────────────────────────────────────

/**
 * Simple BM25 implementation for keyword-based scoring.
 * Combines with vector similarity for hybrid search.
 */
class BM25Index {
  private docFreqs: Map<string, number> = new Map(); // term -> number of docs containing it
  private docLengths: number[] = [];
  private avgDocLength = 0;
  private termFreqs: Map<string, number>[] = []; // per-doc term frequencies
  private docCount = 0;

  private readonly k1 = 1.5;
  private readonly b = 0.75;

  index(chunks: ArticleChunk[]): void {
    this.docFreqs.clear();
    this.docLengths = [];
    this.termFreqs = [];
    this.docCount = chunks.length;

    for (const chunk of chunks) {
      const tokens = this.tokenize(chunk.title + ' ' + chunk.text);
      this.docLengths.push(tokens.length);

      const tf = new Map<string, number>();
      for (const token of tokens) {
        tf.set(token, (tf.get(token) || 0) + 1);
      }
      this.termFreqs.push(tf);

      // Update document frequency
      for (const term of Array.from(tf.keys())) {
        this.docFreqs.set(term, (this.docFreqs.get(term) || 0) + 1);
      }
    }

    this.avgDocLength = this.docLengths.reduce((a, b) => a + b, 0) / Math.max(this.docCount, 1);
  }

  score(query: string, docIndex: number): number {
    const queryTokens = this.tokenize(query);
    const tf = this.termFreqs[docIndex];
    if (!tf) return 0;

    let score = 0;
    const docLen = this.docLengths[docIndex] || this.avgDocLength;

    for (const term of queryTokens) {
      const df = this.docFreqs.get(term) || 0;
      if (df === 0) continue;

      const idf = Math.log(1 + (this.docCount - df + 0.5) / (df + 0.5));
      const termFreq = tf.get(term) || 0;
      const numerator = termFreq * (this.k1 + 1);
      const denominator = termFreq + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
      score += idf * (numerator / denominator);
    }

    return score;
  }

  search(query: string, chunks: ArticleChunk[], limit: number): { chunk: ArticleChunk; score: number; index: number }[] {
    const results: { chunk: ArticleChunk; score: number; index: number }[] = [];
    for (let i = 0; i < chunks.length; i++) {
      const s = this.score(query, i);
      if (s > 0) results.push({ chunk: chunks[i], score: s, index: i });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, limit);
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2);
  }
}

// ─── Query Embedding Cache ────────────────────────────────────

const queryEmbeddingCache = new Map<string, { embedding: number[]; timestamp: number }>();
const QUERY_EMBEDDING_TTL = 30 * 60 * 1000; // 30 minutes
const QUERY_EMBEDDING_MAX = 100;

async function getCachedEmbedding(query: string): Promise<number[]> {
  const now = Date.now();
  const cached = queryEmbeddingCache.get(query);
  if (cached && now - cached.timestamp < QUERY_EMBEDDING_TTL) {
    return cached.embedding;
  }

  const [embedding] = await mistral.embed(query);

  // Evict oldest if at capacity
  if (queryEmbeddingCache.size >= QUERY_EMBEDDING_MAX) {
    const oldestKey = queryEmbeddingCache.keys().next().value;
    if (oldestKey) queryEmbeddingCache.delete(oldestKey);
  }

  queryEmbeddingCache.set(query, { embedding, timestamp: now });
  return embedding;
}

// ─── Knowledge Graph Engine ───────────────────────────────────

export class KnowledgeGraphEngine {
  private chunks: ArticleChunk[] = [];
  private bm25Index: BM25Index = new BM25Index();
  private indexed = false;
  private hasEmbeddings = false;

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    // Try full embeddings cache first (local dev), then lightweight search index
    try {
      if (existsSync(CACHE_PATH)) {
        const raw = readFileSync(CACHE_PATH, 'utf8');
        this.chunks = JSON.parse(raw);
        this.hasEmbeddings = this.chunks.length > 0 && !!this.chunks[0].embedding;
        console.log(`[TAMI RAG] Loaded ${this.chunks.length} chunks from local embeddings cache (embeddings: ${this.hasEmbeddings}).`);
        this.bm25Index.index(this.chunks);
        this.indexed = true;
        return;
      }
      if (existsSync(SEARCH_INDEX_PATH)) {
        const raw = readFileSync(SEARCH_INDEX_PATH, 'utf8');
        this.chunks = JSON.parse(raw);
        this.hasEmbeddings = false;
        console.log(`[TAMI RAG] Loaded ${this.chunks.length} chunks from local search index (no embeddings).`);
        this.bm25Index.index(this.chunks);
        this.indexed = true;
        return;
      }
      console.warn(`[TAMI RAG] No cache file found locally.`);
    } catch (error) {
      console.error('[TAMI RAG] Failed to load local cache:', error);
    }
  }

  private async loadCacheFromCDN(): Promise<boolean> {
    // Fetch lightweight search index (0.7MB) instead of full embeddings (21.4MB)
    const cdnUrl = `${process.env.CDN_BASE_URL || 'https://cdn.tamparananakmuda.com'}/tami/search-index.json`;
    try {
      console.log(`[TAMI RAG] Fetching search index from CDN: ${cdnUrl}`);
      const response = await fetch(cdnUrl, { cache: 'force-cache' });
      if (!response.ok) {
        console.error(`[TAMI RAG] CDN fetch failed: ${response.status}`);
        return false;
      }
      this.chunks = await response.json();
      this.hasEmbeddings = false;
      console.log(`[TAMI RAG] Loaded ${this.chunks.length} chunks from CDN search index.`);
      this.bm25Index.index(this.chunks);
      this.indexed = true;
      return true;
    } catch (error) {
      console.error('[TAMI RAG] Failed to fetch search index from CDN:', error);
      return false;
    }
  }

  /**
   * Reload embeddings cache from disk. Call after ingestion script updates the cache file.
   */
  reload(): void {
    this.chunks = [];
    this.indexed = false;
    this.loadCache();
  }

  get chunkCount(): number {
    return this.chunks.length;
  }

  /**
   * Hybrid search: combines BM25 keyword scoring with vector similarity.
   * Uses reciprocal rank fusion (RRF) to merge results.
   */
  async search(query: string, limit = 5, filter?: { type?: 'article' | 'series' | 'whitepaper' }): Promise<{ chunk: ArticleChunk; score: number }[]> {
    if (this.chunks.length === 0) {
      this.loadCache();
      if (this.chunks.length === 0) {
        // Local file not available (Vercel serverless) — fetch from CDN
        const loaded = await this.loadCacheFromCDN();
        if (!loaded || this.chunks.length === 0) return [];
      }
    }

    // Apply metadata filter if provided
    const searchPool = filter ? this.chunks.filter(c => c.type === filter.type) : this.chunks;
    if (searchPool.length === 0) return [];

    // Re-index BM25 if pool changed due to filter
    if (filter && this.indexed) {
      this.bm25Index.index(searchPool);
    }

    // BM25-only search (fast, no API calls needed)
    // Used when embeddings aren't available (Vercel serverless with lightweight index)
    if (!this.hasEmbeddings) {
      console.log('[TAMI RAG] Using BM25-only search (no embeddings available).');
      const bm25Results = this.bm25Index.search(query, searchPool, limit * 3);
      const seen = new Map<string, number>();
      const diverse = bm25Results.filter(r => {
        const count = (seen.get(r.chunk.slug) || 0) + 1;
        seen.set(r.chunk.slug, count);
        return count <= 2;
      });
      return diverse.slice(0, limit).map(r => ({ chunk: r.chunk, score: r.score }));
    }

    // Full hybrid search (local dev with embeddings)
    const candidateLimit = Math.max(limit * 3, 15);

    try {
      // 1. Expand query with synonyms/context for better semantic matching
      const expandedQuery = await this.expandQuery(query);

      // 2. Get query embedding (cached)
      const queryVector = await getCachedEmbedding(expandedQuery);

      // 3. Vector similarity search
      const vectorResults = searchPool.map((chunk, idx) => ({
        chunk,
        score: cosineSimilarity(queryVector, chunk.embedding!),
        index: idx,
      })).sort((a, b) => b.score - a.score);

      // 4. BM25 keyword search
      const bm25Results = this.bm25Index.search(query, searchPool, candidateLimit);

      // 5. Reciprocal Rank Fusion (RRF) - merge vector + BM25
      const RRF_K = 60; // standard RRF constant
      const rrfScores = new Map<string, { chunk: ArticleChunk; score: number }>();

      // Add vector results with RRF
      vectorResults.slice(0, candidateLimit).forEach((r, rank) => {
        const rrfScore = 1 / (RRF_K + rank + 1);
        const existing = rrfScores.get(r.chunk.id);
        rrfScores.set(r.chunk.id, {
          chunk: r.chunk,
          score: (existing?.score || 0) + rrfScore,
        });
      });

      // Add BM25 results with RRF
      bm25Results.forEach((r, rank) => {
        const rrfScore = 1 / (RRF_K + rank + 1);
        const existing = rrfScores.get(r.chunk.id);
        rrfScores.set(r.chunk.id, {
          chunk: r.chunk,
          score: (existing?.score || 0) + rrfScore,
        });
      });

      // 6. Sort by fused score, apply diversity guarantee
      const fused = Array.from(rrfScores.values()).sort((a, b) => b.score - a.score);
      const seen = new Map<string, number>();
      const diverse = fused.filter(r => {
        const count = (seen.get(r.chunk.slug) || 0) + 1;
        seen.set(r.chunk.slug, count);
        return count <= 2;
      });
      const candidates = diverse.slice(0, candidateLimit);

      // 7. LLM-based reranking for precision
      const reranked = await this.rerank(query, candidates);
      return reranked.slice(0, limit);
    } catch (error) {
      console.error('[TAMI RAG] Hybrid search failed, falling back to BM25-only:', error);

      // Fallback: BM25-only search
      const bm25Results = this.bm25Index.search(query, searchPool, limit * 2);
      const seen = new Map<string, number>();
      const diverse = bm25Results.filter(r => {
        const count = (seen.get(r.chunk.slug) || 0) + 1;
        seen.set(r.chunk.slug, count);
        return count <= 2;
      });
      return diverse.slice(0, limit).map(r => ({ chunk: r.chunk, score: r.score }));
    }
  }

  /**
   * Query expansion: uses LLM to add synonyms and context to user query
   * for better semantic search. Falls back to original query if expansion fails.
   * Results are cached to avoid redundant LLM calls.
   */
  private queryExpansionCache = new Map<string, { expanded: string; timestamp: number }>();
  private readonly EXPANSION_TTL = 30 * 60 * 1000; // 30 min

  private async expandQuery(query: string): Promise<string> {
    // Check cache first
    const cached = this.queryExpansionCache.get(query);
    if (cached && Date.now() - cached.timestamp < this.EXPANSION_TTL) {
      return cached.expanded;
    }

    try {
      const response = await mistral.chat({
        model: 'mistral-small-latest',
        temperature: 0.1,
        messages: [
          { role: 'system', content: 'Anda adalah sistem query expansion untuk mesin pencari konten TAMPARAN ANAK MUDA. Tugas: tambahkan sinonim dan konteks relevan ke query user untuk meningkatkan hasil pencarian semantik. Respons HANYA teks yang diperluas, tidak ada penjelasan.' },
          { role: 'user', content: `Query asli: "${query}"\n\nTambahkan 3-5 sinonim atau frasa terkait dalam bahasa Indonesia yang bisa membantu pencarian semantik. Gabungkan dengan query asli menjadi satu paragraf singkat. Jangan ulang query asli verbatim.` },
        ],
        maxTokens: 100,
        promptCacheKey: 'tami-query-expand',
        timeoutMs: 5000,
      });

      const expanded = response.choices[0].message.content.trim();
      const result = (expanded.length > 10 && expanded.length < 500) ? `${query} ${expanded}` : query;

      // Cache the expansion
      if (this.queryExpansionCache.size >= 50) {
        const oldestKey = this.queryExpansionCache.keys().next().value;
        if (oldestKey) this.queryExpansionCache.delete(oldestKey);
      }
      this.queryExpansionCache.set(query, { expanded: result, timestamp: Date.now() });

      return result;
    } catch {
      return query;
    }
  }

  /**
   * LLM-based reranking: uses Mistral to score chunk relevance to query.
   * Falls back to original vector search order if reranking fails.
   */
  private async rerank(
    query: string,
    candidates: { chunk: ArticleChunk; score: number }[],
  ): Promise<{ chunk: ArticleChunk; score: number }[]> {
    if (candidates.length <= 5) return candidates;

    try {
      const chunkSummaries = candidates.map((c, i) => {
        const typeLabel = c.chunk.type === 'series' ? `Seri: ${c.chunk.seriesName}` : c.chunk.type === 'whitepaper' ? 'Whitepaper' : 'Artikel';
        const preview = c.chunk.text.slice(0, 200).replace(/\n/g, ' ');
        return `[${i}] ${typeLabel}: ${c.chunk.title}\n${preview}`;
      }).join('\n\n');

      const rerankPrompt = `Anda adalah sistem reranking untuk mesin pencari konten TAMPARAN ANAK MUDA.
Pertanyaan user: "${query.slice(0, 500)}"

Berikut adalah ${candidates.length} kandidat konten yang diambil berdasarkan vector similarity. Tugas Anda: tentukan urutan relevansi yang PALING tepat dengan pertanyaan user.

Kandidat:
${chunkSummaries}

Hasilkan JSON dengan array berisi indeks kandidat (0-based) dari yang PALING relevan ke PALING tidak relevan:
{ "rankedIndices": [indeks1, indeks2, ...] }

Pertimbangkan: kesesuaian topik dengan intent user, bukan hanya kemiripan kata.`;

      const response = await mistral.chat({
        model: 'mistral-small-latest',
        temperature: 0.1,
        messages: [
          { role: 'system', content: 'Anda adalah sistem reranking yang precise. Respons HANYA JSON yang valid.' },
          { role: 'user', content: rerankPrompt },
        ],
        responseFormat: { type: 'json_object' },
        promptCacheKey: 'tami-rerank',
        timeoutMs: 10000,
      });

      const result = parseAndValidate(response.choices[0].message.content, rerankResponseSchema);

      if (result.success) {
        const ranked = result.data.rankedIndices
          .filter(idx => idx >= 0 && idx < candidates.length)
          .map(idx => candidates[idx]);

        // Append any candidates not included by the LLM
        const included = new Set(result.data.rankedIndices.filter(idx => idx >= 0 && idx < candidates.length));
        for (let i = 0; i < candidates.length; i++) {
          if (!included.has(i)) ranked.push(candidates[i]);
        }

        return ranked;
      }

      // If validation fails, fall back to vector search order
      console.warn('[TAMI RAG] Rerank validation failed, using vector search order:', result.error);
      return candidates;
    } catch (error) {
      console.warn('[TAMI RAG] Rerank failed, using vector search order:', error);
      return candidates;
    }
  }

  // Convert chunk results to CitationRef format
  getCitations(searchResults: { chunk: ArticleChunk; score: number }[], userQuery?: string): CitationRef[] {
    const citationsMap = new Map<string, CitationRef>();

    for (const { chunk } of searchResults) {
      if (!citationsMap.has(chunk.slug)) {
        const typeLabel = chunk.type === 'series' ? 'Seri' : chunk.type === 'whitepaper' ? 'Whitepaper' : 'Artikel';
        const relevanceExplanation = userQuery
          ? `Relevan dengan pertanyaanmu tentang "${userQuery.slice(0, 80)}" — ${typeLabel} ini membahas: ${chunk.text.slice(0, 120).replace(/\n/g, ' ')}...`
          : `Membahas konsep: "${chunk.text.slice(0, 120).replace(/\n/g, ' ')}..."`;
        citationsMap.set(chunk.slug, {
          title: chunk.title,
          slug: chunk.slug,
          type: chunk.type,
          seriesName: chunk.seriesName,
          seriesOrder: chunk.seriesOrder,
          relevanceExplanation,
        });
      }
    }

    return Array.from(citationsMap.values());
  }
}

export const knowledgeGraph = new KnowledgeGraphEngine();
