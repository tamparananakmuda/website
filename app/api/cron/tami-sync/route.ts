import { NextRequest, NextResponse } from 'next/server';
import { checkCronAuth } from '@/lib/auth/cron-check';
import { checkRagSyncNeeded } from '@/lib/tami/rag/knowledge-sync';
import { knowledgeGraph } from '@/lib/tami/rag/knowledge-graph';
import { tamiResponseCache } from '@/lib/tami/cache/response-cache';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * T7-3: Auto-sync TAMI RAG index when content files change.
 * Triggered by GitHub Actions cron every 30 minutes.
 * Only rebuilds if file hashes have changed (no wasted rebuilds).
 */
export async function GET(request: NextRequest) {
  const cronAuth = checkCronAuth(request);
  if (!cronAuth.isAuthorized) {
    return cronAuth.response;
  }

  try {
    const contentPath = process.cwd() + '/content';
    const syncCheck = checkRagSyncNeeded(contentPath);

    if (!syncCheck.needsRebuild) {
      return NextResponse.json({
        synced: false,
        reason: 'no_changes_detected',
        chunks: knowledgeGraph.chunkCount,
        timestamp: new Date().toISOString(),
      });
    }

    // Content changed - rebuild RAG index and clear cache
    const previousCount = knowledgeGraph.chunkCount;
    knowledgeGraph.reload();
    const newCount = knowledgeGraph.chunkCount;
    tamiResponseCache.clear();

    console.log('[cron] TAMI RAG auto-sync triggered', {
      changes: syncCheck.changes,
      previousChunks: previousCount,
      newChunks: newCount,
    });

    return NextResponse.json({
      synced: true,
      changes: syncCheck.changes,
      details: syncCheck.details,
      previousChunks: previousCount,
      newChunks: newCount,
      cacheCleared: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[cron] TAMI sync failed:', error);
    return NextResponse.json(
      { error: 'TAMI sync failed', detail: error.message },
      { status: 500 }
    );
  }
}
