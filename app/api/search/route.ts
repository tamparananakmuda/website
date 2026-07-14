import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient } from '@/lib/supabase/public';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 30,
      window: 60,
      identifier: 'search',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get('q')?.trim();
    const category = searchParams.get('category');

    if (!rawQ || rawQ.length < 2) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const q = rawQ.slice(0, 100).replace(/%/g, '\\%').replace(/_/g, '\\_');

    const supabase = createPublicClient();

    let query = supabase
      .from('posts')
      .select('id, title, slug, excerpt, cover_image_url, reading_time, published_at, category:categories(title, slug, color)')
      .eq('status', 'published')
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,body.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .limit(10);

    if (category && category !== 'all') {
      query = query.eq('categories.slug', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      results: data || [],
      total: data?.length || 0,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan pencarian' },
      { status: 500 }
    );
  }
}
