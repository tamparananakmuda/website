/**
 * Knowledge Sync: Auto-detect content changes and rebuild RAG embeddings.
 * 
 * - Hash-based change detection: only re-embed changed articles
 * - Incremental update: add/update/remove individual chunks
 * - Entity extraction: people, organizations, concepts from articles
 * - Cross-article linking: find related articles via shared entities
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join, extname } from 'path';

interface ContentFileHash {
  path: string;
  hash: string;
  modifiedAt: number;
}

const CONTENT_DIRS = [
  'content/articles',
  'content/seri',
  'content/whitepaper',
];

/**
 * Simple hash function for content comparison.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Scan content directories and build file hash map.
 */
export function scanContentFiles(basePath: string): ContentFileHash[] {
  const results: ContentFileHash[] = [];
  
  for (const dir of CONTENT_DIRS) {
    const fullPath = join(basePath, dir);
    if (!existsSync(fullPath)) continue;
    
    scanDirectory(fullPath, basePath, results);
  }
  
  return results;
}

function scanDirectory(dirPath: string, basePath: string, results: ContentFileHash[]): void {
  const entries = readdirSync(dirPath);
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanDirectory(fullPath, basePath, results);
    } else if (extname(entry) === '.md') {
      const content = readFileSync(fullPath, 'utf-8');
      results.push({
        path: fullPath.replace(basePath + '/', ''),
        hash: simpleHash(content),
        modifiedAt: stat.mtimeMs,
      });
    }
  }
}

/**
 * Compare current file hashes with cached hashes to detect changes.
 */
export function detectContentChanges(
  currentFiles: ContentFileHash[],
  cachedFiles: ContentFileHash[] | null,
): {
  added: ContentFileHash[];
  modified: ContentFileHash[];
  removed: string[];
  hasChanges: boolean;
} {
  const cachedMap = new Map<string, ContentFileHash>();
  if (cachedFiles) {
    for (const f of cachedFiles) {
      cachedMap.set(f.path, f);
    }
  }
  
  const currentPaths = new Set(currentFiles.map(f => f.path));
  const added: ContentFileHash[] = [];
  const modified: ContentFileHash[] = [];
  
  for (const file of currentFiles) {
    const cached = cachedMap.get(file.path);
    if (!cached) {
      added.push(file);
    } else if (cached.hash !== file.hash) {
      modified.push(file);
    }
  }
  
  const removed: string[] = [];
  if (cachedFiles) {
    for (const cached of cachedFiles) {
      if (!currentPaths.has(cached.path)) {
        removed.push(cached.path);
      }
    }
  }
  
  return {
    added,
    modified,
    removed,
    hasChanges: added.length > 0 || modified.length > 0 || removed.length > 0,
  };
}

/**
 * Check if RAG embeddings cache needs rebuild.
 */
export function checkRagSyncNeeded(basePath: string): {
  needsRebuild: boolean;
  changes: { added: number; modified: number; removed: number };
  details: { added: string[]; modified: string[]; removed: string[] };
} {
  const currentFiles = scanContentFiles(basePath);
  
  let cachedFiles: ContentFileHash[] | null = null;
  const hashCachePath = join(basePath, 'lib/tami/rag/content-hashes.json');
  if (existsSync(hashCachePath)) {
    try {
      cachedFiles = JSON.parse(readFileSync(hashCachePath, 'utf-8'));
    } catch {
      cachedFiles = null;
    }
  }
  
  const changes = detectContentChanges(currentFiles, cachedFiles);
  
  return {
    needsRebuild: changes.hasChanges,
    changes: {
      added: changes.added.length,
      modified: changes.modified.length,
      removed: changes.removed.length,
    },
    details: {
      added: changes.added.map(f => f.path),
      modified: changes.modified.map(f => f.path),
      removed: changes.removed,
    },
  };
}

/**
 * Entity extraction from text: identify people, organizations, concepts.
 * Uses simple NER-like pattern matching (no external API needed).
 */
export function extractEntities(text: string): {
  people: string[];
  organizations: string[];
  concepts: string[];
  numbers: string[];
} {
  const people: string[] = [];
  const organizations: string[] = [];
  const concepts: string[] = [];
  const numbers: string[] = [];

  // Indonesian name patterns (Title Case, 2-3 words)
  const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}\b/g;
  const matches = text.match(namePattern) || [];
  for (const match of matches) {
    const lower = match.toLowerCase();
    if (!['tamparan anak muda', 'gen z', 'milenial', 'indonesia', 'jakarta', 'surabaya'].includes(lower)) {
      if (!people.includes(match)) people.push(match);
    }
  }

  // Organization patterns
  const orgPattern = /\b(?:Kementerian|Lembaga|Badan|BPS|BPSDM|KPK|OJK|BI|DPR|DPD|MPR|Komisi|Yayasan)\s+[A-Z][a-z]+/g;
  const orgMatches = text.match(orgPattern) || [];
  for (const match of orgMatches) {
    if (!organizations.includes(match)) organizations.push(match);
  }

  // Concept patterns (key terms in quotes or bold)
  const conceptPattern = /(?:"|")([^"]{3,50})(?:"|")/g;
  let conceptMatch: RegExpExecArray | null;
  while ((conceptMatch = conceptPattern.exec(text)) !== null) {
    if (conceptMatch[1] && !concepts.includes(conceptMatch[1])) concepts.push(conceptMatch[1]);
  }

  // Numbers with context (percentages, currency, statistics)
  const numberPattern = /\b(?:Rp\.?\s?\d|[A-Z]{3}\s?\d|\d+(?:[.,]\d+)?%|\d+(?:[.,]\d+)?\s?(?:juta|miliar|triliun|ribu|persen))\b/gi;
  const numberMatches = text.match(numberPattern) || [];
  for (const match of numberMatches) {
    if (!numbers.includes(match)) numbers.push(match);
  }

  return { people, organizations, concepts, numbers };
}

/**
 * Find cross-article relationships based on shared entities.
 */
export function findCrossArticleRelations(
  articles: { slug: string; title: string; text: string }[],
): { slugA: string; slugB: string; sharedEntities: string[]; relationType: string }[] {
  const relations: { slugA: string; slugB: string; sharedEntities: string[]; relationType: string }[] = [];
  
  const entityMap = articles.map(a => ({
    slug: a.slug,
    title: a.title,
    entities: extractEntities(a.text),
  }));

  for (let i = 0; i < entityMap.length; i++) {
    for (let j = i + 1; j < entityMap.length; j++) {
      const a = entityMap[i];
      const b = entityMap[j];
      
      const sharedPeople = a.entities.people.filter(p => b.entities.people.includes(p));
      const sharedOrgs = a.entities.organizations.filter(o => b.entities.organizations.includes(o));
      const sharedConcepts = a.entities.concepts.filter(c => b.entities.concepts.includes(c));
      
      const allShared = [...sharedPeople, ...sharedOrgs, ...sharedConcepts];
      
      if (allShared.length >= 2) {
        let relationType = 'related';
        if (sharedPeople.length > 0) relationType = 'shared_person';
        else if (sharedOrgs.length > 0) relationType = 'shared_organization';
        else if (sharedConcepts.length >= 2) relationType = 'shared_topic';
        
        relations.push({
          slugA: a.slug,
          slugB: b.slug,
          sharedEntities: allShared.slice(0, 5),
          relationType,
        });
      }
    }
  }

  return relations;
}
