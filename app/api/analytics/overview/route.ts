import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();

    const [
      { count: totalPosts },
      { count: publishedPosts },
      { count: draftPosts },
      { data: postsByCategory },
      { data: postsByPovTag },
      { data: postsByMonth },
      { data: pipelineStats },
      { data: topPosts },
      { data: pillarStats },
    ] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
      supabase.from('posts').select('category_id, categories(title, color)').eq('status', 'published'),
      supabase.from('posts').select('pov_tag').eq('status', 'published').not('pov_tag', 'is', null),
      supabase
        .from('posts')
        .select('published_at')
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(100),
      supabase.from('content_queue').select('status'),
      supabase
        .from('posts')
        .select('id, title, slug, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10),
      supabase
        .from('posts')
        .select('subcategory_id, subcategories(title)')
        .eq('status', 'published')
        .not('subcategory_id', 'is', null),
    ]);

    const byCategory = new Map<string, { title: string; color: string; count: number }>();
    (postsByCategory || []).forEach((p: { category_id: string | null; categories: { title: string; color: string }[] | null }) => {
      const cat = p.categories?.[0];
      if (!cat) return;
      const key = p.category_id || 'unknown';
      const existing = byCategory.get(key);
      if (existing) {
        existing.count++;
      } else {
        byCategory.set(key, { title: cat.title, color: cat.color, count: 1 });
      }
    });

    const byPovTag = new Map<string, number>();
    (postsByPovTag || []).forEach((p: { pov_tag: string | null }) => {
      if (p.pov_tag) {
        byPovTag.set(p.pov_tag, (byPovTag.get(p.pov_tag) || 0) + 1);
      }
    });

    const byMonth = new Map<string, number>();
    (postsByMonth || []).forEach((p: { published_at: string | null }) => {
      if (p.published_at) {
        const monthKey = p.published_at.substring(0, 7);
        byMonth.set(monthKey, (byMonth.get(monthKey) || 0) + 1);
      }
    });

    const byPillar = new Map<string, { title: string; count: number }>();
    (pillarStats || []).forEach((p: { subcategory_id: string | null; subcategories: { title: string }[] | null }) => {
      const sub = p.subcategories?.[0];
      if (!sub) return;
      const key = p.subcategory_id || 'unknown';
      const existing = byPillar.get(key);
      if (existing) {
        existing.count++;
      } else {
        byPillar.set(key, { title: sub.title, count: 1 });
      }
    });

    const pipelineByStatus = new Map<string, number>();
    (pipelineStats || []).forEach((p: { status: string }) => {
      pipelineByStatus.set(p.status, (pipelineByStatus.get(p.status) || 0) + 1);
    });

    return NextResponse.json({
      totals: {
        total: totalPosts || 0,
        published: publishedPosts || 0,
        draft: draftPosts || 0,
      },
      byCategory: Array.from(byCategory.entries()).map(([_, v]) => v).sort((a, b) => b.count - a.count),
      byPovTag: Array.from(byPovTag.entries()).map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count),
      byMonth: Array.from(byMonth.entries())
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      byPillar: Array.from(byPillar.entries()).map(([_, v]) => v).sort((a, b) => b.count - a.count),
      pipeline: Array.from(pipelineByStatus.entries()).map(([status, count]) => ({ status, count })),
      topPosts: topPosts || [],
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    return NextResponse.json({ error: 'Gagal mengambil analytics' }, { status: 500 });
  }
}
