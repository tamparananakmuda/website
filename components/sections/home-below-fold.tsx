import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getAllCategories } from '@/lib/db/queries/categories';
import { getNonSeriesPublishedPostsWithRelations, getLatestSeriesWithPosts } from '@/lib/db/queries/posts';
import { getAllArticles } from '@/lib/articles/loader';
import { series as seriesConfig, getSeriesBySlug } from '@/content/config';
import type { PostWithRelations } from '@/lib/db/schema';
import { Topics } from '@/components/sections/topics';
import { LatestArticles } from '@/components/sections/latest-articles';
import { LatestSeries, type SeriesDisplayItem } from '@/components/sections/latest-series';
import { WhyTam } from '@/components/sections/why-tam';
import { Faq, faqItems } from '@/components/sections/faq';

const NewsletterCta = dynamic(() => import('@/components/sections/newsletter-cta').then((m) => m.NewsletterCta), {
  loading: () => <div className="py-24 md:py-40" aria-hidden="true" />,
});

async function TopicsSection() {
  const [categories, allArticles] = await Promise.all([
    getAllCategories(),
    getAllArticles(),
  ]);
  const currentTime = new Date().toISOString();
  const articleCounts: Record<string, number> = {};
  const articlesByCategory: Record<
    string,
    Array<{
      slug: string;
      title: string;
      excerpt: string;
      readingTime: number;
      publishedAt: string;
      ogHeadline?: string | null;
    }>
  > = {};

  const published = (allArticles || [])
    .filter((a) => a.status === 'published' && a.publishedAt <= currentTime && a.categorySlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  for (const a of published) {
    articleCounts[a.categorySlug] = (articleCounts[a.categorySlug] || 0) + 1;
    if (!articlesByCategory[a.categorySlug]) {
      articlesByCategory[a.categorySlug] = [];
    }
    if (articlesByCategory[a.categorySlug].length < 3) {
      articlesByCategory[a.categorySlug].push({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        readingTime: a.readingTime,
        publishedAt: a.publishedAt,
        ogHeadline: a.ogHeadline,
      });
    }
  }

  return (
    <Topics
      categories={categories || []}
      articleCounts={articleCounts}
      articlesByCategory={articlesByCategory}
    />
  );
}

async function LatestArticlesSection() {
  const recentPosts = await getNonSeriesPublishedPostsWithRelations(3);
  return <LatestArticles posts={recentPosts || []} />;
}

async function LatestSeriesSection() {
  const allArticles = await getAllArticles();
  const publishedSeriesList = await getLatestSeriesWithPosts(10, 999);
  const currentTime = new Date().toISOString();

  // 1. Group scheduled upcoming articles by seriesSlug
  const upcomingPartsBySeries = new Map<
    string,
    Array<{
      slug: string;
      title: string;
      excerpt: string;
      seriesOrder: number;
      publishedAt: string;
    }>
  >();

  for (const a of allArticles) {
    if (a.seriesSlug && a.status === 'scheduled' && a.publishedAt > currentTime) {
      const parts = upcomingPartsBySeries.get(a.seriesSlug) ?? [];
      parts.push({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        seriesOrder: a.seriesOrder ?? (parts.length + 1),
        publishedAt: a.publishedAt,
      });
      upcomingPartsBySeries.set(a.seriesSlug, parts);
    }
  }

  // Sort upcoming parts by seriesOrder ascending, then publishedAt
  Array.from(upcomingPartsBySeries.values()).forEach((parts) => {
    parts.sort((a, b) => {
      if (a.seriesOrder !== b.seriesOrder) return a.seriesOrder - b.seriesOrder;
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    });
  });

  // 2. Build items for published series
  const publishedItems: SeriesDisplayItem[] = (publishedSeriesList || []).map((s) => {
    const upcoming = upcomingPartsBySeries.get(s.seriesSlug) ?? [];
    const cfg = getSeriesBySlug(s.seriesSlug);
    const hasPublished = s.posts.length > 0;
    const hasUpcoming = upcoming.length > 0;
    const state: 'in-progress' | 'upcoming' | 'completed' =
      hasPublished && hasUpcoming ? 'in-progress' : 'completed';

    const totalParts = Math.max(
      s.totalParts + upcoming.length,
      cfg?.expectedParts ?? 0,
      s.posts.length + upcoming.length
    );

    return {
      seriesSlug: s.seriesSlug,
      seriesTitle: cfg?.title || s.seriesTitle,
      description: cfg?.description ?? null,
      teaser: cfg?.teaser ?? null,
      state,
      totalParts,
      publishedCount: s.posts.length,
      upcomingCount: upcoming.length,
      startDate: s.posts[0]?.publishedAt ?? null,
      nextReleaseDate: upcoming[0]?.publishedAt ?? null,
      posts: s.posts,
      upcomingParts: upcoming,
    };
  });

  // Sort published items: in-progress first, then newest published
  publishedItems.sort((a, b) => {
    if (a.state === 'in-progress' && b.state !== 'in-progress') return -1;
    if (b.state === 'in-progress' && a.state !== 'in-progress') return 1;
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateB - dateA;
  });

  // 3. Find candidate upcoming series from config
  const publishedSlugs = new Set(publishedItems.map((item) => item.seriesSlug));
  const upcomingCandidates: SeriesDisplayItem[] = seriesConfig
    .filter((cfg) => !publishedSlugs.has(cfg.slug))
    .map((cfg) => {
      const parts = upcomingPartsBySeries.get(cfg.slug) ?? [];
      const startDate =
        parts[0]?.publishedAt ||
        (cfg.expectedDate ? new Date(cfg.expectedDate).toISOString() : null);
      const totalParts = Math.max(parts.length, cfg.expectedParts ?? 0);

      return {
        seriesSlug: cfg.slug,
        seriesTitle: cfg.title,
        description: cfg.description ?? null,
        teaser: cfg.teaser ?? null,
        state: 'upcoming' as const,
        totalParts,
        publishedCount: 0,
        upcomingCount: totalParts,
        startDate,
        nextReleaseDate: startDate,
        posts: [] as PostWithRelations[],
        upcomingParts: parts,
      };
    })
    .filter((item) => {
      // Must have future start date
      if (!item.startDate) return false;
      return item.startDate >= currentTime;
    })
    .sort((a, b) => {
      const timeA = a.startDate ? new Date(a.startDate).getTime() : Infinity;
      const timeB = b.startDate ? new Date(b.startDate).getTime() : Infinity;
      return timeA - timeB;
    });

  // 4. Assemble final series list
  // Priority:
  // - If any series is 'in-progress', it goes first as the primary spotlight.
  // - Otherwise, the next 'upcoming' series goes first as the primary spotlight!
  // - Followed by the latest completed series so readers can still discover it.
  const inProgressSeries = publishedItems.find((s) => s.state === 'in-progress');
  const nextUpcomingSeries = upcomingCandidates[0];
  const completedSeries = publishedItems.filter((s) => s.state === 'completed');

  const combinedSeries: SeriesDisplayItem[] = [];

  if (inProgressSeries) {
    combinedSeries.push(inProgressSeries);
    if (nextUpcomingSeries) combinedSeries.push(nextUpcomingSeries);
    if (completedSeries[0]) combinedSeries.push(completedSeries[0]);
  } else {
    if (nextUpcomingSeries) combinedSeries.push(nextUpcomingSeries);
    if (completedSeries[0]) combinedSeries.push(completedSeries[0]);
    if (completedSeries[1]) combinedSeries.push(completedSeries[1]);
  }

  // Default active slug is the first item in combinedSeries
  const defaultSlug = combinedSeries[0]?.seriesSlug;

  return <LatestSeries series={combinedSeries} defaultActiveSlug={defaultSlug} />;
}

function SectionSkeleton() {
  return <div className="py-24 md:py-40" aria-hidden="true" />;
}

export function HomeBelowFold() {
  return (
    <>
      <Suspense fallback={<SectionSkeleton />}>
        <TopicsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <LatestArticlesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <LatestSeriesSection />
      </Suspense>
      <WhyTam />
      <Faq />
      <NewsletterCta />
    </>
  );
}
