import { NextRequest, NextResponse } from 'next/server';
import { searchPostsWithCategory } from '@/lib/db/queries/posts';
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

    const data = await searchPostsWithCategory(q, category || undefined, 10);

    return NextResponse.json({
      results: data.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        coverImageUrl: p.coverImageUrl,
        readingTime: p.readingTime,
        publishedAt: p.publishedAt,
        category: p.category ? { title: p.category.title, slug: p.category.slug, color: p.category.color } : null,
      })),
      total: data.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Gagal melakukan pencarian' },
      { status: 500 }
    );
  }
}
