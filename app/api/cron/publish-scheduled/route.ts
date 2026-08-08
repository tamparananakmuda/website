import { NextRequest, NextResponse } from 'next/server';
import { getPostWithRelationsBySlug, countPublishedPostsInSeries, updatePostOGUrls } from '@/lib/db/queries/posts';
import { generateAndUploadOGImages } from '@/lib/cdn/generate';
import { deleteOldOGImages } from '@/lib/cdn/r2';
import { getAllArticles, publishArticleFile } from '@/lib/articles/loader';
import { getScheduledWhitepapers, publishWhitepaperFile } from '@/lib/whitepaper/loader';
import { db } from '@/lib/db';
import { postMetadata } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { knowledgeGraph } from '@/lib/tami/rag/knowledge-graph';
import { tamiResponseCache } from '@/lib/tami/cache/response-cache';

import { checkCronAuth } from '@/lib/auth/cron-check';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const cronAuth = checkCronAuth(request);
  if (!cronAuth.isAuthorized) {
    return cronAuth.response;
  }

  try {
    const now = new Date().toISOString();
    const allArticles = await getAllArticles();

    const scheduled = allArticles.filter(
      (a) => a.status === 'scheduled' && a.publishedAt <= now
    );

    if (scheduled.length === 0) {
      return NextResponse.json({ published: 0, slugs: [], ogGenerated: 0 });
    }

    const slugs = scheduled.map((p) => p.slug);
    console.log(`[cron] Found ${scheduled.length} scheduled articles:`, slugs);

    let ogGenerated = 0;
    const ogErrors: string[] = [];

    for (const post of scheduled) {
      try {
        // Try to publish file (works locally, fails silently on Vercel read-only FS)
        try {
          await publishArticleFile(post.slug);
          console.log(`[cron] Published: ${post.slug}`);
        } catch (pubError) {
          console.log(`[cron] File publish skipped for ${post.slug} (read-only FS or already published)`);
        }

        // Check if OG images already exist in DB. On Vercel, publishArticleFile
        // fails (read-only FS) so status stays "scheduled" and cron reprocesses
        // every run. Skip OG generation if URLs already saved to prevent
        // delete-then-fail race condition that leaves CDN with 404s.
        const existingMeta = await db.select().from(postMetadata).where(eq(postMetadata.slug, post.slug)).limit(1);
        if (existingMeta.length > 0 && existingMeta[0].ogFeatureUrl) {
          console.log(`[cron] OG already exists for ${post.slug}, skipping`);
          continue;
        }

        // OG generation runs regardless of file publish result
        const fullPost = await getPostWithRelationsBySlug(post.slug);
        if (!fullPost) continue;

        const category = fullPost.category ?? null;
        const author = fullPost.author ?? null;
        const series = fullPost.series ?? null;

        let seriesCurrent: number | undefined;
        let seriesTotal: number | undefined;
        if (series && fullPost.seriesOrder) {
          seriesTotal = await countPublishedPostsInSeries(series.slug);
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

        await updatePostOGUrls(post.slug, {
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

    // Process scheduled whitepapers
    const scheduledWhitepapers = getScheduledWhitepapers().filter(
      (w) => w.publishedAt <= now
    );

    const wpSlugs = scheduledWhitepapers.map((w) => w.slug);
    console.log(`[cron] Found ${scheduledWhitepapers.length} scheduled whitepapers:`, wpSlugs);

    for (const wp of scheduledWhitepapers) {
      try {
        try {
          publishWhitepaperFile(wp.slug);
          console.log(`[cron] Published whitepaper: ${wp.slug}`);
        } catch (pubError) {
          console.log(`[cron] Whitepaper file publish skipped for ${wp.slug} (read-only FS or already published)`);
        }
      } catch (wpError) {
        console.error(`[cron] Whitepaper publish failed for ${wp.slug}:`, wpError);
      }
    }

    // Sync TAMI RAG index with newly published content
    if (scheduled.length > 0 || scheduledWhitepapers.length > 0) {
      try {
        knowledgeGraph.reload();
        tamiResponseCache.clear();
        console.log('[cron] TAMI RAG index reloaded and response cache cleared');
      } catch (ragError) {
        console.error('[cron] TAMI RAG reload failed:', ragError);
      }
    }

    return NextResponse.json({
      published: scheduled.length + scheduledWhitepapers.length,
      slugs: [...slugs, ...wpSlugs],
      ogGenerated,
      ogErrors,
      whitepapersPublished: scheduledWhitepapers.length,
    });
  } catch (error) {
    console.error('[cron] publish-scheduled error:', error);
    return NextResponse.json(
      { error: 'Failed to process scheduled articles' },
      { status: 500 }
    );
  }
}
