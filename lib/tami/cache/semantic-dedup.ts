/**
 * Semantic dedup: detect when a user query is semantically similar
 * to a recent query in the same session. Uses embedding cosine similarity.
 * If similarity exceeds threshold, the orchestrator can adjust behavior
 * (e.g., reference previous answer instead of re-running full pipeline).
 */

import { mistral } from '../mistral/client';

const SIMILARITY_THRESHOLD = 0.92;

interface QueryEmbedding {
  query: string;
  embedding: number[];
  timestamp: number;
}

// Per-session store of recent query embeddings (max 5 per session)
const sessionQueries = new Map<string, QueryEmbedding[]>();
const MAX_PER_SESSION = 5;
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_SESSIONS = 200; // Bound total sessions to prevent memory leak

// Periodic cleanup of stale sessions
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Run cleanup every 5 minutes

function cleanupStaleSessions(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  let cleaned = 0;
  for (const [sid, entries] of Array.from(sessionQueries.entries())) {
    const fresh = entries.filter((e: QueryEmbedding) => now - e.timestamp < TTL_MS);
    if (fresh.length === 0) {
      sessionQueries.delete(sid);
      cleaned++;
    } else {
      sessionQueries.set(sid, fresh);
    }
  }
  if (cleaned > 0) {
    console.log(`[TAMI DEDUP] Cleaned up ${cleaned} stale sessions (${sessionQueries.size} active)`);
  }
}

/**
 * Check if a query is semantically similar to a recent query in the same session.
 * Returns the similar query if found, or null if this is a new/unique query.
 * Also stores the current query embedding for future checks.
 */
export async function checkSemanticDup(
  sessionId: string,
  query: string,
): Promise<{ isDuplicate: boolean; similarQuery?: string; similarity?: number }> {
  // Run periodic cleanup
  cleanupStaleSessions();

  // Enforce max sessions limit
  if (sessionQueries.size >= MAX_SESSIONS && !sessionQueries.has(sessionId)) {
    const oldestSession = sessionQueries.keys().next().value;
    if (oldestSession) sessionQueries.delete(oldestSession);
  }

  // Prune expired entries
  const now = Date.now();
  const existing = (sessionQueries.get(sessionId) || []).filter(e => now - e.timestamp < TTL_MS);

  // Generate embedding for current query
  let queryEmbedding: number[];
  try {
    [queryEmbedding] = await mistral.embed(query);
  } catch {
    // If embedding fails, skip dedup check
    return { isDuplicate: false };
  }

  // Compare against existing embeddings
  let bestMatch: { query: string; similarity: number } | null = null;
  for (const entry of existing) {
    const sim = cosineSimilarity(queryEmbedding, entry.embedding);
    if (sim > SIMILARITY_THRESHOLD && (!bestMatch || sim > bestMatch.similarity)) {
      bestMatch = { query: entry.query, similarity: sim };
    }
  }

  // Store current query
  const updated = [...existing, { query, embedding: queryEmbedding, timestamp: now }].slice(-MAX_PER_SESSION);
  sessionQueries.set(sessionId, updated);

  if (bestMatch) {
    console.log(`[TAMI DEDUP] Query similar to previous (sim=${bestMatch.similarity.toFixed(3)}): "${bestMatch.query.slice(0, 60)}"`);
    return { isDuplicate: true, similarQuery: bestMatch.query, similarity: bestMatch.similarity };
  }

  return { isDuplicate: false };
}

/**
 * Clear session query history (call when session ends).
 */
export function clearSession(sessionId: string): void {
  sessionQueries.delete(sessionId);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}
