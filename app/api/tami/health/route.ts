import { NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/tami/observability/health';
import { getCostSummary } from '@/lib/tami/observability/cost-tracker';
import { getTraceSummary } from '@/lib/tami/observability/tracer';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const maxDuration = 10;

export async function GET() {
  const health = getHealthStatus();
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  // Basic health status is public (for uptime monitoring)
  // Detailed cost/traces require admin auth
  const authResult = await checkAdminAuth();
  if (!authResult.isAdmin) {
    return NextResponse.json({
      status: health.status,
      timestamp: new Date().toISOString(),
    }, { status: statusCode });
  }

  const cost = getCostSummary();
  const traces = getTraceSummary();

  return NextResponse.json({
    ...health,
    cost,
    traces,
    timestamp: new Date().toISOString(),
  }, { status: statusCode });
}
