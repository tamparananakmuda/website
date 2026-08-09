import { Suspense } from 'react';
import { getAllCategories } from '@/lib/db/queries/categories';
import { getNonSeriesPublishedPostsWithRelations, getLatestSeriesWithPosts } from '@/lib/db/queries/posts';
import { getAllArticles } from '@/lib/articles/loader';
import { Topics } from '@/components/sections/topics';
import { LatestArticles } from '@/components/sections/latest-articles';
import { LatestSeries } from '@/components/sections/latest-series';
import { WhyTam } from '@/components/sections/why-tam';
import { Faq, faqItems } from '@/components/sections/faq';
import { NewsletterCta } from '@/components/sections/newsletter-cta';

async function TopicsSection() {
  const categories = await getAllCategories();
  return <Topics categories={categories || []} />;
}

async function LatestArticlesSection() {
  const recentPosts = await getNonSeriesPublishedPostsWithRelations(3);
  return <LatestArticles posts={recentPosts || []} />;
}

async function LatestSeriesSection() {
  const latestSeries = await getLatestSeriesWithPosts(1, 999);
  const allArticles = await getAllArticles();

  const currentTime = new Date().toISOString();
  const upcomingBySeries = new Map<string, { count: number; nextDate: string }>();
  const upcomingPartsBySeries = new Map<string, Array<{ slug: string; title: string; excerpt: string; seriesOrder: number | null; publishedAt: string }>>();

  for (const a of allArticles) {
    if (a.seriesSlug && a.status === 'scheduled' && a.publishedAt > currentTime) {
      const existing = upcomingBySeries.get(a.seriesSlug);
      if (!existing || a.publishedAt < existing.nextDate) {
        upcomingBySeries.set(a.seriesSlug, {
          count: (existing?.count ?? 0) + 1,
          nextDate: a.publishedAt,
        });
      } else {
        upcomingBySeries.set(a.seriesSlug, {
          count: existing.count + 1,
          nextDate: existing.nextDate,
        });
      }
      const parts = upcomingPartsBySeries.get(a.seriesSlug) ?? [];
      parts.push({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        seriesOrder: a.seriesOrder,
        publishedAt: a.publishedAt,
      });
      upcomingPartsBySeries.set(a.seriesSlug, parts);
    }
  }

  const seriesWithUpcoming = (latestSeries || []).map((s) => ({
    ...s,
    upcomingCount: upcomingBySeries.get(s.seriesSlug)?.count ?? 0,
    nextDate: upcomingBySeries.get(s.seriesSlug)?.nextDate ?? null,
    upcomingParts: (upcomingPartsBySeries.get(s.seriesSlug) ?? []).sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    ),
  }));

  return <LatestSeries series={seriesWithUpcoming} />;
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
