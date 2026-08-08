/**
 * Conversation Analytics: Topic clustering & sentiment trends
 * 
 * - Topic clustering: most frequently discussed topics across all sessions
 * - Sentiment trend: aggregate mood over time
 * - Response quality metrics: feedback correlation, cache performance
 * - Export multi-format: CSV, JSON summary
 */

import { getActiveSessionCount } from '../cognitive/conversation-memory';
import { getCostSummary } from '../observability/cost-tracker';
import { getTraceSummary } from '../observability/tracer';
import { tamiResponseCache } from '../cache/response-cache';

// ─── Topic Tracking ───────────────────────────────────────

interface TopicEntry {
  topic: string;
  count: number;
  lastMentioned: number;
  relatedEmotions: string[];
}

const topicStore = new Map<string, TopicEntry>();
const MAX_TOPICS = 100;

export function trackTopicMention(topic: string, emotion?: string): void {
  const normalized = topic.toLowerCase().trim();
  if (normalized.length < 3) return;

  let entry = topicStore.get(normalized);
  if (!entry) {
    if (topicStore.size >= MAX_TOPICS) {
      let leastKey: string | null = null;
      let leastCount = Infinity;
      for (const [key, val] of Array.from(topicStore.entries())) {
        if (val.count < leastCount) {
          leastCount = val.count;
          leastKey = key;
        }
      }
      if (leastKey) topicStore.delete(leastKey);
    }
    entry = { topic: normalized, count: 0, lastMentioned: 0, relatedEmotions: [] };
    topicStore.set(normalized, entry);
  }

  entry.count++;
  entry.lastMentioned = Date.now();
  if (emotion && !entry.relatedEmotions.includes(emotion)) {
    entry.relatedEmotions.push(emotion);
    if (entry.relatedEmotions.length > 5) entry.relatedEmotions.shift();
  }
}

export function getTopTopics(limit = 10): TopicEntry[] {
  return Array.from(topicStore.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ─── Sentiment Timeline ───────────────────────────────────

interface SentimentDataPoint {
  timestamp: number;
  emotion: string;
  sessionId: string;
}

const sentimentTimeline: SentimentDataPoint[] = [];
const MAX_TIMELINE = 500;

export function recordSentiment(emotion: string, sessionId: string): void {
  sentimentTimeline.push({ timestamp: Date.now(), emotion, sessionId });
  if (sentimentTimeline.length > MAX_TIMELINE) {
    sentimentTimeline.shift();
  }
}

export function getSentimentDistribution(): { emotion: string; count: number; percentage: number }[] {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const point of sentimentTimeline) {
    counts[point.emotion] = (counts[point.emotion] || 0) + 1;
    total++;
  }

  return Object.entries(counts)
    .map(([emotion, count]) => ({
      emotion,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getSentimentTrend(): {
  last1h: { emotion: string; count: number }[];
  last24h: { emotion: string; count: number }[];
  allTime: { emotion: string; count: number }[];
} {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const aggregate = (since: number) => {
    const counts: Record<string, number> = {};
    for (const point of sentimentTimeline) {
      if (point.timestamp >= since) {
        counts[point.emotion] = (counts[point.emotion] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count);
  };

  return {
    last1h: aggregate(oneHourAgo),
    last24h: aggregate(oneDayAgo),
    allTime: aggregate(0),
  };
}

// ─── Conversation Analytics Summary ───────────────────────

export function getConversationAnalytics(): {
  topics: TopicEntry[];
  sentiment: {
    distribution: { emotion: string; count: number; percentage: number }[];
    trend: { last1h: { emotion: string; count: number }[]; last24h: { emotion: string; count: number }[]; allTime: { emotion: string; count: number }[] };
  };
  performance: {
    activeSessions: number;
    cacheHitRate: number;
    cacheSize: number;
    totalTopics: number;
    sentimentDataPoints: number;
  };
  cost: {
    totalTokens: number;
    estimatedCostUsd: number;
    agentCalls: number;
  };
  traces: Record<string, { count: number; avgMs: number; p50Ms: number; p95Ms: number; p99Ms: number; failures: number; errors: number }>;
} {
  const cost = getCostSummary();
  const traces = getTraceSummary();
  const cacheStats = tamiResponseCache.getStats();

  return {
    topics: getTopTopics(10),
    sentiment: {
      distribution: getSentimentDistribution(),
      trend: getSentimentTrend(),
    },
    performance: {
      activeSessions: getActiveSessionCount(),
      cacheHitRate: cacheStats.hitRate,
      cacheSize: cacheStats.size,
      totalTopics: topicStore.size,
      sentimentDataPoints: sentimentTimeline.length,
    },
    cost: {
      totalTokens: cost.totalTokens,
      estimatedCostUsd: cost.estimatedCostUsd,
      agentCalls: cost.agentCalls,
    },
    traces,
  };
}

// ─── Export Multi-format ──────────────────────────────────

export function exportAnalyticsJSON(): string {
  return JSON.stringify(getConversationAnalytics(), null, 2);
}

export function exportAnalyticsCSV(): string {
  const analytics = getConversationAnalytics();
  const lines: string[] = [];

  lines.push('Section,Topic/Emotion,Count,Percentage/Extra');
  for (const topic of analytics.topics) {
    lines.push(`Topic,${topic.topic},${topic.count},${topic.relatedEmotions.join(';')}`);
  }

  for (const sent of analytics.sentiment.distribution) {
    lines.push(`Sentiment,${sent.emotion},${sent.count},${sent.percentage.toFixed(1)}%`);
  }

  lines.push('');
  lines.push('Performance,Metric,Value,');
  lines.push(`Performance,Active Sessions,${analytics.performance.activeSessions},`);
  lines.push(`Performance,Cache Hit Rate,${(analytics.performance.cacheHitRate * 100).toFixed(1)}%,`);
  lines.push(`Performance,Cache Size,${analytics.performance.cacheSize},`);
  lines.push(`Performance,Total Topics,${analytics.performance.totalTopics},`);
  lines.push(`Performance,Sentiment Data Points,${analytics.performance.sentimentDataPoints},`);

  lines.push('');
  lines.push('Cost,Metric,Value,');
  lines.push(`Cost,Total Tokens,${analytics.cost.totalTokens},`);
  lines.push(`Cost,Est. USD,${analytics.cost.estimatedCostUsd.toFixed(4)},`);
  lines.push(`Cost,Agent Calls,${analytics.cost.agentCalls},`);

  return lines.join('\n');
}
