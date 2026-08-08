/**
 * Lightweight agent observability & tracing.
 * Logs agent execution time, status, and token usage to console
 * in a structured format for downstream aggregation.
 */

interface TraceEntry {
  agent: string;
  status: 'success' | 'failed' | 'fallback';
  durationMs: number;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

const traces: TraceEntry[] = [];
const MAX_TRACES = 500; // Bound traces to prevent memory leak

function pushTrace(entry: TraceEntry): void {
  traces.push(entry);
  if (traces.length > MAX_TRACES) {
    traces.shift(); // Remove oldest
  }
}

/**
 * Wrap an async agent call with timing and status tracing.
 * Returns the agent's result on success, or throws on failure
 * (after logging the trace).
 */
export async function traceAgent<T>(
  agent: string,
  fn: () => Promise<T>,
  metadata?: Record<string, unknown>,
): Promise<T> {
  const start = Date.now();
  const entry: TraceEntry = {
    agent,
    status: 'success',
    durationMs: 0,
    timestamp: new Date().toISOString(),
    metadata,
  };

  try {
    const result = await fn();
    entry.durationMs = Date.now() - start;
    pushTrace(entry);
    console.log(`[TAMI TRACE] ${agent} ${entry.status} ${entry.durationMs}ms`);
    return result;
  } catch (error) {
    entry.status = 'failed';
    entry.durationMs = Date.now() - start;
    entry.metadata = { ...metadata, error: (error as Error).message };
    pushTrace(entry);
    console.error(`[TAMI TRACE] ${agent} ${entry.status} ${entry.durationMs}ms: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * Trace an agent call with fallback. Returns fallback value on failure
 * instead of throwing.
 */
export async function traceAgentWithFallback<T>(
  agent: string,
  fn: () => Promise<T>,
  fallback: T,
  metadata?: Record<string, unknown>,
): Promise<T> {
  const start = Date.now();
  const entry: TraceEntry = {
    agent,
    status: 'success',
    durationMs: 0,
    timestamp: new Date().toISOString(),
    metadata,
  };

  try {
    const result = await fn();
    entry.durationMs = Date.now() - start;
    pushTrace(entry);
    console.log(`[TAMI TRACE] ${agent} ${entry.status} ${entry.durationMs}ms`);
    return result;
  } catch (error) {
    entry.status = 'fallback';
    entry.durationMs = Date.now() - start;
    entry.metadata = { ...metadata, error: (error as Error).message };
    pushTrace(entry);
    console.warn(`[TAMI TRACE] ${agent} ${entry.status} ${entry.durationMs}ms: ${(error as Error).message}`);
    return fallback;
  }
}

/**
 * Get all collected traces (for debugging/analytics).
 */
export function getTraces(): TraceEntry[] {
  return [...traces];
}

/**
 * Compute percentile from sorted array.
 */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

/**
 * Get a summary of trace statistics with percentiles.
 */
export function getTraceSummary(): Record<string, {
  count: number;
  avgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  failures: number;
  errors: number;
}> {
  const summary: Record<string, {
    count: number;
    avgMs: number;
    p50Ms: number;
    p95Ms: number;
    p99Ms: number;
    failures: number;
    errors: number;
  }> = {};

  const byAgent: Record<string, number[]> = {};

  for (const trace of traces) {
    if (!summary[trace.agent]) {
      summary[trace.agent] = { count: 0, avgMs: 0, p50Ms: 0, p95Ms: 0, p99Ms: 0, failures: 0, errors: 0 };
      byAgent[trace.agent] = [];
    }
    summary[trace.agent].count++;
    summary[trace.agent].avgMs += trace.durationMs;
    byAgent[trace.agent].push(trace.durationMs);
    if (trace.status !== 'success') summary[trace.agent].failures++;
    if (trace.status === 'failed') summary[trace.agent].errors++;
  }

  for (const agent of Object.keys(summary)) {
    const s = summary[agent];
    s.avgMs = Math.round(s.avgMs / s.count);
    const sorted = byAgent[agent].sort((a, b) => a - b);
    s.p50Ms = percentile(sorted, 50);
    s.p95Ms = percentile(sorted, 95);
    s.p99Ms = percentile(sorted, 99);
  }

  return summary;
}

/**
 * Clear traces (call after consuming summary).
 */
export function clearTraces(): void {
  traces.length = 0;
}
