/**
 * Generates a lightweight search-index.json from embeddings-cache.json.
 * Strips out embedding vectors and truncates text to keep file size ~1MB.
 * This file is used by the KnowledgeGraphEngine on Vercel serverless for BM25-only search.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const CACHE_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'embeddings-cache.json');
const OUTPUT_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'search-index.json');

const TEXT_TRUNCATE_LENGTH = 500;

interface ArticleChunk {
  id: string;
  slug: string;
  title: string;
  type: 'article' | 'series' | 'whitepaper';
  seriesName?: string;
  seriesOrder?: number;
  text: string;
  embedding: number[];
}

interface LightweightChunk {
  id: string;
  slug: string;
  title: string;
  type: 'article' | 'series' | 'whitepaper';
  seriesName?: string;
  seriesOrder?: number;
  text: string;
}

function main() {
  console.log('[search-index] Reading embeddings cache...');
  const raw = readFileSync(CACHE_PATH, 'utf8');
  const chunks: ArticleChunk[] = JSON.parse(raw);
  console.log(`[search-index] Loaded ${chunks.length} chunks from embeddings cache.`);

  const lightweight: LightweightChunk[] = chunks.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    type: c.type,
    seriesName: c.seriesName,
    seriesOrder: c.seriesOrder,
    text: c.text.slice(0, TEXT_TRUNCATE_LENGTH),
  }));

  const json = JSON.stringify(lightweight);
  writeFileSync(OUTPUT_PATH, json);

  const sizeMB = (Buffer.byteLength(json) / 1024 / 1024).toFixed(2);
  console.log(`[search-index] Written ${lightweight.length} chunks to ${OUTPUT_PATH} (${sizeMB} MB)`);
}

main();
