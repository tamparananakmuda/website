import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { getAnalyticsOverview } from '@/lib/db/queries/posts';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const data = await getAnalyticsOverview();

    const byCategory = new Map<string, { title: string; color: string; count: number }>();
    data.postsByCategoryResult.forEach((p) => {
      if (!p.title) return;
      const key = p.categoryId || 'unknown';
      const existing = byCategory.get(key);
      if (existing) {
        existing.count++;
      } else {
        byCategory.set(key, { title: p.title, color: p.color || '', count: 1 });
      }
    });

    const byPovTag = new Map<string, number>();
    data.postsByPovTagResult.forEach((p) => {
      if (p.povTag) {
        byPovTag.set(p.povTag, (byPovTag.get(p.povTag) || 0) + 1);
      }
    });

    const byMonth = new Map<string, number>();
    data.postsByMonthResult.forEach((p) => {
      if (p.publishedAt) {
        const monthKey = p.publishedAt.substring(0, 7);
        byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
      }
    });

    const byPillar = new Map<string, { title: string; count: number }>();
    data.pillarStatsResult.forEach((p) => {
      if (!p.title) return;
      const key = p.subcategoryId || 'unknown';
      const existing = byPillar.get(key);
      if (existing) {
        existing.count++;
      } else {
        byPillar.set(key, { title: p.title, count: 1 });
      }
    });

    const pipelineByStatus = new Map<string, number>();
    data.pipelineStatsResult.forEach((p) => {
      if (p.status) {
        pipelineByStatus.set(p.status, (pipelineByStatus.get(p.status) || 0) + 1);
      }
    });

    return NextResponse.json({
      totals: {
        total: data.totalResult[0]?.count || 0,
        published: data.publishedResult[0]?.count || 0,
        draft: data.draftResult[0]?.count || 0,
      },
      byCategory: Array.from(byCategory.entries()).map(([_, v]) => v).sort((a, b) => b.count - a.count),
      byPovTag: Array.from(byPovTag.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count),
      byMonth: Array.from(byMonth.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      byPillar: Array.from(byPillar.entries()).map(([_, v]) => v).sort((a, b) => b.count - a.count),
      pipeline: Array.from(pipelineByStatus.entries()).map(([status, count]) => ({ status, count })),
      topPosts: data.topPostsResult,
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Gagal mengambil analytics' }, { status: 500 });
  }
}
