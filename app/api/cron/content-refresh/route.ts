import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, lt, sql, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

/**
 * Content Refresh Cron — identify artikel yang sudah lama tidak di-update.
 *
 * Jalankan via GitHub Actions cron bulanan, atau manual GET dari admin panel.
 * Protected dengan CRON_SECRET header.
 *
 * Response: daftar artikel yang butuh refresh (published > 12 bulan & belum di-update).
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get('authorization');

  if (secret && authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const staleArticles = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        publishedAt: posts.publishedAt,
        updatedAt: posts.updatedAt,
        daysSinceUpdate: sql<number>`
          extract(day from now() - ${posts.updatedAt}::timestamptz)
        `,
      })
      .from(posts)
      .where(
        and(
          eq(posts.status, 'published'),
          lt(posts.updatedAt, twelveMonthsAgo.toISOString())
        )
      )
      .orderBy(posts.updatedAt)
      .limit(50);

    const result = {
      checkedAt: new Date().toISOString(),
      staleThresholdMonths: 12,
      staleCount: staleArticles.length,
      articles: staleArticles.map((a) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        publishedAt: a.publishedAt,
        updatedAt: a.updatedAt,
        daysSinceUpdate: Math.round(Number(a.daysSinceUpdate)),
        url: `https://tamparananakmuda.com/artikel/${a.slug}`,
      })),
    };

    if (staleArticles.length > 0) {
      console.log(
        `[content-refresh] ${staleArticles.length} stale articles found:`,
        staleArticles.map((a) => a.slug).join(', ')
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('[content-refresh] Error:', error);
    return NextResponse.json({ error: 'Content refresh check failed' }, { status: 500 });
  }
}
