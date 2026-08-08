import { NextRequest, NextResponse } from 'next/server';
import { knowledgeGraph } from '@/lib/tami/rag/knowledge-graph';
import { tamiResponseCache } from '@/lib/tami/cache/response-cache';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { checkRagSyncNeeded } from '@/lib/tami/rag/knowledge-sync';
import { getHealthStatus } from '@/lib/tami/observability/health';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return authResult.response;
  }

  try {
    const previousCount = knowledgeGraph.chunkCount;

    // T7-3: Check if content has changed before rebuild
    const contentPath = process.cwd() + '/content';
    const syncCheck = checkRagSyncNeeded(contentPath);

    // Reload RAG embeddings from disk
    knowledgeGraph.reload();

    const newCount = knowledgeGraph.chunkCount;

    // Clear response cache (stale responses may reference old articles)
    tamiResponseCache.clear();

    console.log('[TAMI REBUILD] RAG cache reloaded, response cache cleared', {
      syncNeeded: syncCheck.needsRebuild,
      changes: syncCheck.changes,
    });

    return NextResponse.json({
      ok: true,
      previousChunks: previousCount,
      newChunks: newCount,
      cacheCleared: true,
      contentSync: {
        needsRebuild: syncCheck.needsRebuild,
        changes: syncCheck.changes,
        details: syncCheck.details,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[TAMI REBUILD] Failed:', error);
    return NextResponse.json(
      { error: 'Failed to rebuild RAG index', detail: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  const health = getHealthStatus();
  return NextResponse.json({
    chunks: knowledgeGraph.chunkCount,
    cacheSize: tamiResponseCache.size,
    health: {
      status: health.status,
      circuitState: health.components.mistral.circuitState,
      ragLoaded: health.components.rag.loaded,
    },
  });
}
