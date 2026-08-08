/**
 * Lightweight token cost tracker for TAMI.
 * Tracks estimated token usage per day and logs warnings
 * when approaching budget limits.
 * 
 * Uses in-memory counters (resets on serverless cold start).
 * For production, replace with DB-backed tracking.
 */

interface DailyCostTracker {
  date: string;
  totalTokens: number;
  agentCalls: number;
  byAgent: Record<string, { tokens: number; calls: number }>;
  estimatedCostUsd: number;
}

const DAILY_TOKEN_BUDGET = 500_000; // Conservative daily budget
const WARNING_THRESHOLD = 0.8; // Warn at 80% usage

// Mistral pricing (approximate, per 1M tokens)
const PRICING: Record<string, { input: number; output: number }> = {
  'mistral-large-latest': { input: 2.0, output: 6.0 },
  'mistral-small-latest': { input: 0.2, output: 0.6 },
  'mistral-embed': { input: 0.1, output: 0 },
};

let todayTracker: DailyCostTracker | null = null;

function getTodayTracker(): DailyCostTracker {
  const today = new Date().toISOString().slice(0, 10);
  if (!todayTracker || todayTracker.date !== today) {
    todayTracker = {
      date: today,
      totalTokens: 0,
      agentCalls: 0,
      byAgent: {},
      estimatedCostUsd: 0,
    };
  }
  return todayTracker;
}

/**
 * Record token usage for an agent call.
 * Accepts actual usage from API response if available, otherwise estimates.
 */
export function trackTokenUsage(
  agentName: string,
  estimatedTokens: number,
  model?: string,
  actualUsage?: { prompt_tokens: number; completion_tokens: number },
): void {
  const tracker = getTodayTracker();
  const tokens = actualUsage ? actualUsage.prompt_tokens + actualUsage.completion_tokens : estimatedTokens;
  
  tracker.totalTokens += tokens;
  tracker.agentCalls += 1;

  // Estimate USD cost
  if (model && PRICING[model]) {
    if (actualUsage) {
      tracker.estimatedCostUsd += (actualUsage.prompt_tokens / 1_000_000) * PRICING[model].input;
      tracker.estimatedCostUsd += (actualUsage.completion_tokens / 1_000_000) * PRICING[model].output;
    } else {
      // Rough split: 70% input, 30% output
      tracker.estimatedCostUsd += (tokens * 0.7 / 1_000_000) * PRICING[model].input;
      tracker.estimatedCostUsd += (tokens * 0.3 / 1_000_000) * PRICING[model].output;
    }
  }

  if (!tracker.byAgent[agentName]) {
    tracker.byAgent[agentName] = { tokens: 0, calls: 0 };
  }
  tracker.byAgent[agentName].tokens += tokens;
  tracker.byAgent[agentName].calls += 1;

  // Log warning if approaching budget
  const usage = tracker.totalTokens / DAILY_TOKEN_BUDGET;
  if (usage >= WARNING_THRESHOLD && usage < 1) {
    console.warn(`[TAMI COST] Approaching daily budget: ${tracker.totalTokens}/${DAILY_TOKEN_BUDGET} tokens (${(usage * 100).toFixed(1)}%) | Est. cost: $${tracker.estimatedCostUsd.toFixed(4)}`);
  } else if (usage >= 1) {
    console.error(`[TAMI COST] DAILY BUDGET EXCEEDED: ${tracker.totalTokens}/${DAILY_TOKEN_BUDGET} tokens | Est. cost: $${tracker.estimatedCostUsd.toFixed(4)}`);
  }
}

/**
 * Estimate token count from text (rough: 1 token ≈ 4 chars for Indonesian).
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Get current daily cost summary.
 */
export function getCostSummary(): DailyCostTracker {
  return getTodayTracker();
}
