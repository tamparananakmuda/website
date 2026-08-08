'use client';

import React, { useState, useEffect } from 'react';
import { Activity, DollarSign, Database, Zap, RefreshCw, TrendingUp, MousePointerClick } from 'lucide-react';

interface AnalyticsData {
  cost: {
    date: string;
    totalTokens: number;
    agentCalls: number;
    byAgent: Record<string, { tokens: number; calls: number }>;
  };
  traces: {
    totalTraces: number;
    avgDurationMs: number;
    byAgent: Record<string, { count: number; avgMs: number; errors: number }>;
  };
  cacheSize: number;
  ragChunks: number;
  variantStats: Array<{ variant: string; count: number; followUps: number; engagementRate: number }>;
  timestamp: string;
}

interface ClickData {
  topCitations: Array<{ slug: string; clicks: number }>;
  totalTracked: number;
}

interface FeedbackData {
  negativeFeedback: Array<{ messageId: string; query: string; reply: string; timestamp: string }>;
  totalNegative: number;
}

export default function TamiAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [clicks, setClicks] = useState<ClickData | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rebuilding, setRebuilding] = useState(false);

  const fetchData = async () => {
    try {
      const [analyticsRes, clicksRes, feedbackRes] = await Promise.all([
        fetch('/api/tami/analytics'),
        fetch('/api/tami/track-click'),
        fetch('/api/tami/feedback'),
      ]);
      if (analyticsRes.ok) setData(await analyticsRes.json());
      if (clicksRes.ok) setClicks(await clicksRes.json());
      if (feedbackRes.ok) setFeedback(await feedbackRes.json());
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRebuild = async () => {
    setRebuilding(true);
    try {
      await fetch('/api/tami/rebuild', { method: 'POST' });
      fetchData();
    } catch (err) {
      console.error('Rebuild failed:', err);
    } finally {
      setRebuilding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-950">
        <RefreshCw className="w-6 h-6 text-neutral-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">TAMI Analytics</h1>
            <p className="text-sm text-neutral-400 mt-1">Tamparan Anak Muda Intelligence Dashboard</p>
          </div>
          <button
            onClick={handleRebuild}
            disabled={rebuilding}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${rebuilding ? 'animate-spin' : ''}`} />
            Rebuild RAG
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Token Cost */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-neutral-400">Token Usage</span>
            </div>
            <p className="text-2xl font-bold">{data?.cost.totalTokens.toLocaleString() || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">{data?.cost.agentCalls || 0} agent calls</p>
          </div>

          {/* Avg Response Time */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs text-neutral-400">Avg Response</span>
            </div>
            <p className="text-2xl font-bold">{data?.traces.avgDurationMs ? `${Math.round(data.traces.avgDurationMs)}ms` : '-'}</p>
            <p className="text-xs text-neutral-500 mt-1">{data?.traces.totalTraces || 0} traces</p>
          </div>

          {/* Cache Size */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-neutral-400">Cache Size</span>
            </div>
            <p className="text-2xl font-bold">{data?.cacheSize || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">cached responses</p>
          </div>

          {/* RAG Chunks */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs text-neutral-400">RAG Chunks</span>
            </div>
            <p className="text-2xl font-bold">{data?.ragChunks || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">indexed articles</p>
          </div>
        </div>

        {/* Agent Breakdown */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">Agent Performance</h2>
          </div>
          <div className="space-y-3">
            {data?.cost.byAgent && Object.entries(data.cost.byAgent).map(([name, stats]) => (
              <div key={name} className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-mono">{name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">{stats.calls} calls</span>
                  <span className="text-neutral-400">{stats.tokens.toLocaleString()} tokens</span>
                </div>
              </div>
            ))}
            {data?.traces.byAgent && Object.entries(data.traces.byAgent).map(([name, stats]) => (
              <div key={`trace-${name}`} className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-mono">{name} (trace)</span>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400">{Math.round(stats.avgMs)}ms avg</span>
                  {stats.errors > 0 && <span className="text-red-400">{stats.errors} errors</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* A/B Test Personality Variants */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">Personality A/B Test</h2>
          </div>
          {data?.variantStats && data.variantStats.length > 0 ? (
            <div className="space-y-2">
              {data.variantStats.map((v, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-mono">{v.variant}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-neutral-400">{v.count} responses</span>
                    <span className="text-neutral-400">{v.followUps} follow-ups</span>
                    <span className="text-primary font-bold">{(v.engagementRate * 100).toFixed(0)}% engagement</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No A/B test data yet.</p>
          )}
        </div>

        {/* Citation Clicks */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <MousePointerClick className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">Top Citation Clicks</h2>
          </div>
          {clicks?.topCitations && clicks.topCitations.length > 0 ? (
            <div className="space-y-2">
              {clicks.topCitations.map((c, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 font-mono truncate max-w-md">{c.slug}</span>
                  <span className="text-neutral-400 font-bold">{c.clicks} clicks</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No citation clicks tracked yet.</p>
          )}
        </div>

        {/* Self-Improvement Log */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-red-400" />
            <h2 className="text-sm font-bold">Self-Improvement Log</h2>
            <span className="text-xs text-neutral-500">({feedback?.totalNegative || 0} negative feedback)</span>
          </div>
          {feedback?.negativeFeedback && feedback.negativeFeedback.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {feedback.negativeFeedback.map((entry, i) => (
                <div key={i} className="border border-neutral-800 rounded-lg p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 font-mono">{entry.messageId}</span>
                    <span className="text-[10px] text-neutral-600">{entry.timestamp}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold">Query:</span>
                    <p className="text-xs text-neutral-300 mt-0.5">{entry.query}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 font-bold">Reply:</span>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-3">{entry.reply}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-neutral-500">No negative feedback logged yet.</p>
          )}
        </div>

        <p className="text-xs text-neutral-600 text-center">
          Last updated: {data?.timestamp || '-'} | Data resets on serverless cold start
        </p>
      </div>
    </div>
  );
}
