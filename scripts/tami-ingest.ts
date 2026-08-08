import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { MistralClient } from '../lib/tami/mistral/client';
import { ArticleChunk } from '../lib/tami/rag/knowledge-graph';

const CACHE_PATH = join(process.cwd(), 'lib', 'tami', 'rag', 'embeddings-cache.json');
const mistral = new MistralClient();

const ARTICLES_DIR = join(process.cwd(), 'content', 'articles');
const SERIES_DIR = join(process.cwd(), 'content', 'seri');

function readDirRecursive(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readDirRecursive(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Simple chunking logic: split text by paragraph or subheadings, and combine if too short
function createChunks(body: string, meta: { slug: string; title: string; type: 'article' | 'series' | 'whitepaper'; seriesName?: string; seriesOrder?: number }): string[] {
  // Clean markdown syntax slightly for cleaner embeddings
  const cleanBody = body
    .replace(/[#*`_\[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Split into paragraphs
  const paragraphs = cleanBody.split(/(?<=\. )/g);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + para).length > 1000) {
      if (currentChunk.trim().length > 100) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = para;
    } else {
      currentChunk += ' ' + para;
    }
  }
  if (currentChunk.trim().length > 100) {
    chunks.push(currentChunk.trim());
  }

  // Prepend title and context to each chunk for better semantic retrieval
  return chunks.map(chunk => `Judul: ${meta.title}. Pembahasan: ${chunk}`);
}

async function run() {
  console.log('[TAMI Ingestion] Starting RAG Ingestion Pipeline (Direct Loader)...');
  
  const articleFiles = readDirRecursive(ARTICLES_DIR);
  const seriesFiles = readDirRecursive(SERIES_DIR);
  const allFiles = [...articleFiles, ...seriesFiles];
  
  console.log(`[TAMI Ingestion] Found ${allFiles.length} total markdown files.`);

  const textToEmbed: string[] = [];
  const chunkMetadata: Omit<ArticleChunk, 'embedding'>[] = [];

  // 2. Parse and create metadata
  for (const filePath of allFiles) {
    const fileContent = readFileSync(filePath, 'utf8');
    const { data: fm, content: body } = matter(fileContent);

    if (!fm.slug || !fm.title) continue;

    const isSeries = !!fm.series;
    const type = isSeries ? 'series' : 'article';

    const meta = {
      slug: fm.slug,
      title: fm.title,
      type: type as 'article' | 'series' | 'whitepaper',
      seriesName: fm.series || undefined,
      seriesOrder: fm.seriesOrder || undefined,
    };

    const textChunks = createChunks(body, meta);
    
    textChunks.forEach((text, index) => {
      const id = `${fm.slug}-chunk-${index}`;
      chunkMetadata.push({
        id,
        ...meta,
        text,
      });
      textToEmbed.push(text);
    });
  }

  console.log(`[TAMI Ingestion] Generated ${textToEmbed.length} chunks. Fetching embeddings from Mistral AI in batches...`);

  // 3. Batch fetch embeddings
  const batchSize = 32;
  const embeddings: number[][] = [];

  for (let i = 0; i < textToEmbed.length; i += batchSize) {
    const batch = textToEmbed.slice(i, i + batchSize);
    console.log(`[TAMI Ingestion] Embedding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(textToEmbed.length / batchSize)}...`);
    try {
      const batchVectors = await mistral.embed(batch);
      embeddings.push(...batchVectors);
    } catch (err) {
      console.error(`[TAMI Ingestion] Error embedding batch starting at index ${i}:`, err);
      // Wait and retry once
      await new Promise(res => setTimeout(res, 2000));
      const batchVectors = await mistral.embed(batch);
      embeddings.push(...batchVectors);
    }
  }

  // 4. Combine metadata and embeddings
  const allProcessedChunks: ArticleChunk[] = [];
  for (let i = 0; i < chunkMetadata.length; i++) {
    allProcessedChunks.push({
      ...chunkMetadata[i],
      embedding: embeddings[i],
    });
  }

  // Ensure target folder exists
  const cacheDir = join(process.cwd(), 'lib', 'tami', 'rag');
  const fs = require('fs');
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // 5. Save to disk
  writeFileSync(CACHE_PATH, JSON.stringify(allProcessedChunks, null, 2), 'utf8');
  console.log(`[TAMI Ingestion] Successfully ingested ${allProcessedChunks.length} chunks into ${CACHE_PATH}`);
}

run().catch(err => {
  console.error('[TAMI Ingestion] Critical pipeline failure:', err);
  process.exit(1);
});
