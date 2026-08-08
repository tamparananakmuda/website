import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { mistral } from '../mistral/client';
import { CitationRef } from '../cognitive/types';

export interface ArticleChunk {
  id: string;
  slug: string;
  title: string;
  type: 'article' | 'series' | 'whitepaper';
  seriesName?: string;
  seriesOrder?: number;
  text: string;
  embedding: number[];
}

const CACHE_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'embeddings-cache.json');

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

export class KnowledgeGraphEngine {
  private chunks: ArticleChunk[] = [];

  constructor() {
    this.loadCache();
  }

  private loadCache() {
    try {
      if (existsSync(CACHE_PATH)) {
        const raw = readFileSync(CACHE_PATH, 'utf8');
        this.chunks = JSON.parse(raw);
        console.log(`[TAMI RAG] Loaded ${this.chunks.length} chunks from local embeddings cache.`);
      } else {
        console.warn(`[TAMI RAG] Embeddings cache not found at ${CACHE_PATH}. Please run the ingestion script.`);
      }
    } catch (error) {
      console.error('[TAMI RAG] Failed to load embeddings cache:', error);
    }
  }

  async search(query: string, limit = 5): Promise<{ chunk: ArticleChunk; score: number }[]> {
    if (this.chunks.length === 0) {
      this.loadCache();
      if (this.chunks.length === 0) return [];
    }

    try {
      // 1. Generate query embedding
      const [queryVector] = await mistral.embed(query);

      // 2. Compute similarity for all chunks
      const results = this.chunks.map(chunk => {
        const score = cosineSimilarity(queryVector, chunk.embedding);
        return { chunk, score };
      });

      // 3. Sort by score descending and return top matches
      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      console.error('[TAMI RAG] Search failed, falling back to basic text matching:', error);
      
      // Fallback: simple keyword matching
      const queryLower = query.toLowerCase();
      const results = this.chunks
        .map(chunk => {
          let score = 0;
          if (chunk.title.toLowerCase().includes(queryLower)) score += 0.5;
          if (chunk.text.toLowerCase().includes(queryLower)) score += 0.3;
          return { chunk, score };
        })
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);
        
      return results.slice(0, limit);
    }
  }

  // Convert chunk results to CitationRef format
  getCitations(searchResults: { chunk: ArticleChunk; score: number }[]): CitationRef[] {
    const citationsMap = new Map<string, CitationRef>();

    for (const { chunk } of searchResults) {
      if (!citationsMap.has(chunk.slug)) {
        citationsMap.set(chunk.slug, {
          title: chunk.title,
          slug: chunk.slug,
          type: chunk.type,
          seriesName: chunk.seriesName,
          seriesOrder: chunk.seriesOrder,
          relevanceExplanation: `Membahas konsep: "${chunk.text.slice(0, 100)}..."`
        });
      }
    }

    return Array.from(citationsMap.values());
  }
}

export const knowledgeGraph = new KnowledgeGraphEngine();
