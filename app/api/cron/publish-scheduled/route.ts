import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, lte, inArray, and } from 'drizzle-orm';
import { getPostWithRelationsBySlug, countPublishedPostsInSeries, updatePostOGUrls } from '@/lib/db/queries/posts';
import { generateAndUploadOGImages } from '@/lib/cdn/generate';
import { deleteOldOGImages } from '@/lib/cdn/r2';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date().toISOString();

    const scheduled = await db.select({ id: posts.id, slug: posts.slug, title: posts.title })
      .from(posts)
      .where(and(eq(posts.status, 'scheduled'), lte(posts.publishedAt, now)));

    if (scheduled.length === 0) {
      return NextResponse.json({ published: 0, slugs: [], ogGenerated: 0 });
    }

    const ids = scheduled.map((p) => p.id);
    await db.update(posts)
      .set({ status: 'published', updatedAt: now })
      .where(inArray(posts.id, ids));

    const slugs = scheduled.map((p) => p.slug);
    console.log(`[cron] Published ${scheduled.length} scheduled articles:`, slugs);

    let ogGenerated = 0;
    const ogErrors: string[] = [];

    for (const post of scheduled) {
      try {
        const fullPost = await getPostWithRelationsBySlug(post.slug);
        if (!fullPost) continue;

        const category = fullPost.category ?? null;
        const author = fullPost.author ?? null;
        const series = fullPost.series ?? null;

        let seriesCurrent: number | undefined;
        let seriesTotal: number | undefined;
        if (series && fullPost.seriesOrder) {
          seriesTotal = await countPublishedPostsInSeries(series.id);
          seriesCurrent = fullPost.seriesOrder;
        }

        await deleteOldOGImages(post.slug);

        const urls = await generateAndUploadOGImages(post.slug, {
          title: fullPost.title,
          category: category?.title,
          categoryColor: category?.color ?? undefined,
          categorySlug: category?.slug ?? undefined,
          excerpt: fullPost.excerpt || undefined,
          readingTime: fullPost.readingTime ?? undefined,
          publishedAt: fullPost.publishedAt ?? undefined,
          authorName: author?.name ?? undefined,
          isPremium: fullPost.isPremium ?? undefined,
          isSponsored: fullPost.isSponsored ?? undefined,
          seriesCurrent,
          seriesTotal,
          coverImageUrl: fullPost.coverImageUrl ?? undefined,
          ogHeadline: fullPost.ogHeadline || undefined,
        });

        await updatePostOGUrls(fullPost.id, {
          ogCardUrl: urls.card,
          ogFeatureUrl: urls.feature,
          ogImageUrl: urls.feature,
        });

        ogGenerated++;
        console.log(`[cron] OG generated for: ${post.slug}`);
      } catch (ogError) {
        console.error(`[cron] OG failed for ${post.slug}:`, ogError);
        ogErrors.push(post.slug);
      }
    }

    return NextResponse.json({
      published: scheduled.length,
      slugs,
      ogGenerated,
      ogErrors,
    });
  } catch (error) {
    console.error('[cron] publish-scheduled error:', error);
    return NextResponse.json(
      { error: 'Failed to publish scheduled articles' },
      { status: 500 }
    );
  }
}
