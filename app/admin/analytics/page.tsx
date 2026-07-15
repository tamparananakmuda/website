'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Loader2, TrendingUp, FileText, CheckCircle, Clock } from 'lucide-react';

interface AnalyticsData {
  totals: { total: number; published: number; draft: number };
  byCategory: { title: string; color: string; count: number }[];
  byPovTag: { tag: string; count: number }[];
  byMonth: { month: string; count: number }[];
  byPillar: { title: string; count: number }[];
  pipeline: { status: string; count: number }[];
  topPosts: { id: string; title: string; slug: string; published_at: string | null }[];
}

const monthLabels: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'Mei', '06': 'Jun',
  '07': 'Jul', '08': 'Agu', '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

const statusLabels: Record<string, string> = {
  'idea': 'Idea', 'research': 'Research', 'draft': 'Draft', 'review': 'Review',
  'revision': 'Revision', 'fact-check': 'Fact-Check', 'scheduled': 'Scheduled', 'published': 'Published',
};

const statusColors: Record<string, string> = {
  'idea': 'bg-slate-500', 'research': 'bg-blue-500', 'draft': 'bg-amber-500',
  'review': 'bg-orange-500', 'revision': 'bg-red-500', 'fact-check': 'bg-purple-500',
  'scheduled': 'bg-cyan-500', 'published': 'bg-green-500',
};

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    const res = await fetch('/api/analytics/overview');
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <p className="text-muted-foreground">Gagal memuat analytics.</p>;
  }

  const maxMonthCount = Math.max(...data.byMonth.map((m) => m.count), 1);
  const maxPillarCount = Math.max(...data.byPillar.map((p) => p.count), 1);
  const maxCategoryCount = Math.max(...data.byCategory.map((c) => c.count), 1);
  const totalPipeline = data.pipeline.reduce((sum, p) => sum + p.count, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Performa konten dan pipeline editorial</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText size={16} />
            <span className="text-xs">Total Artikel</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{data.totals.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle size={16} />
            <span className="text-xs">Published</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-500">{data.totals.published}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-amber-500">
            <Clock size={16} />
            <span className="text-xs">In Pipeline</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-500">{totalPipeline}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-blue-500">
            <TrendingUp size={16} />
            <span className="text-xs">Draft</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-500">{data.totals.draft}</p>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Artikel per Bulan</h2>
          {data.byMonth.length > 0 ? (
            <div className="space-y-2">
              {data.byMonth.slice(-12).map((m) => {
                const [year, month] = m.month.split('-');
                const label = `${monthLabels[month] || month} ${year}`;
                const width = (m.count / maxMonthCount) * 100;
                return (
                  <div key={m.month} className="flex items-center gap-3">
                    <span className="w-16 text-xs text-muted-foreground">{label}</span>
                    <div className="flex-1 rounded-full bg-secondary h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-medium">{m.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada data.</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Artikel per Kategori</h2>
          {data.byCategory.length > 0 ? (
            <div className="space-y-2">
              {data.byCategory.map((c) => {
                const width = (c.count / maxCategoryCount) * 100;
                return (
                  <div key={c.title} className="flex items-center gap-3">
                    <span className="w-24 truncate text-xs text-muted-foreground">{c.title}</span>
                    <div className="flex-1 rounded-full bg-secondary h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${width}%`, backgroundColor: c.color }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-medium">{c.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada data.</p>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">Artikel per Pillar</h2>
          {data.byPillar.length > 0 ? (
            <div className="space-y-2">
              {data.byPillar.map((p) => {
                const width = (p.count / maxPillarCount) * 100;
                return (
                  <div key={p.title} className="flex items-center gap-3">
                    <span className="w-32 truncate text-xs text-muted-foreground">{p.title}</span>
                    <div className="flex-1 rounded-full bg-secondary h-6 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-6 text-right text-xs font-medium">{p.count}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada artikel dengan pillar.</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-semibold">POV Tag Distribution</h2>
          {data.byPovTag.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.byPovTag.map((p) => (
                <div
                  key={p.tag}
                  className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5"
                >
                  <span className="text-xs font-medium">{p.tag}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {p.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada data POV tag.</p>
          )}
        </div>
      </div>

      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Pipeline Status</h2>
        {data.pipeline.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {data.pipeline.map((p) => (
              <div key={p.status} className="text-center">
                <div className={`mx-auto mb-2 h-2 w-full rounded-full ${statusColors[p.status] || 'bg-gray-500'}`} />
                <p className="text-lg font-bold">{p.count}</p>
                <p className="text-xs text-muted-foreground">{statusLabels[p.status] || p.status}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Pipeline kosong.</p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold">Artikel Terbaru</h2>
        {data.topPosts.length > 0 ? (
          <div className="space-y-2">
            {data.topPosts.map((post, i) => (
              <Link
                key={post.id}
                href={`/artikel/${post.slug}`}
                className="flex items-center gap-3 rounded-md p-2 text-sm hover:bg-accent transition-colors"
              >
                <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                <span className="flex-1 truncate font-medium">{post.title}</span>
                {post.published_at && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Belum ada artikel published.</p>
        )}
      </div>
    </div>
  );
}
