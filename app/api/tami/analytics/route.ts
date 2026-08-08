import { NextResponse } from 'next/server';
import { getCostSummary } from '@/lib/tami/observability/cost-tracker';
import { getTraceSummary } from '@/lib/tami/observability/tracer';
import { tamiResponseCache } from '@/lib/tami/cache/response-cache';
import { knowledgeGraph } from '@/lib/tami/rag/knowledge-graph';
import { getVariantStats } from '@/lib/tami/cognitive/personality';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getConversationAnalytics } from '@/lib/tami/observability/conversation-analytics';
import { getCrisisAuditStats, getCrisisAuditLog, getRateLimitStats, getRetentionStats } from '@/lib/tami/guardrails/safety';
import { getHealthStatus } from '@/lib/tami/observability/health';

export async function GET() {
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return authResult.response;
  }

  const cost = getCostSummary();
  const traces = getTraceSummary();
  const cacheStats = tamiResponseCache.getStats();
  const conversationAnalytics = getConversationAnalytics();
  const crisisStats = getCrisisAuditStats();
  const crisisLog = getCrisisAuditLog(20);
  const health = getHealthStatus();
  const rateLimit = getRateLimitStats();
  const retention = getRetentionStats();

  return NextResponse.json({
    cost,
    traces,
    cacheSize: tamiResponseCache.size,
    cacheStats,
    ragChunks: knowledgeGraph.chunkCount,
    variantStats: getVariantStats(),
    conversationAnalytics,
    crisisAudit: {
      stats: crisisStats,
      recentLog: crisisLog,
    },
    health,
    rateLimit,
    retention,
    timestamp: new Date().toISOString(),
  });
}
