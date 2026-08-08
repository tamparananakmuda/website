import { NextResponse } from 'next/server';
import { getHealthStatus } from '@/lib/tami/observability/health';
import { getCostSummary } from '@/lib/tami/observability/cost-tracker';
import { getTraceSummary } from '@/lib/tami/observability/tracer';

export const maxDuration = 10;

export async function GET() {
  const health = getHealthStatus();
  const cost = getCostSummary();
  const traces = getTraceSummary();

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;

  return NextResponse.json({
    ...health,
    cost,
    traces,
    timestamp: new Date().toISOString(),
  }, { status: statusCode });
}
