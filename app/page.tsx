import { getAllCategories } from '@/lib/db/queries/categories';
import { getNonSeriesPublishedPostsWithRelations, getLatestSeriesWithPosts } from '@/lib/db/queries/posts';
import { getAllArticles } from '@/lib/articles/loader';
import { Hero } from '@/components/sections/hero';
import { FeaturedQuote } from '@/components/sections/featured-quote';
import { Philosophy } from '@/components/sections/philosophy';
import { Topics } from '@/components/sections/topics';
import { LatestArticles } from '@/components/sections/latest-articles';
import { LatestSeries } from '@/components/sections/latest-series';
import { WhyTam } from '@/components/sections/why-tam';
import { Faq, faqItems } from '@/components/sections/faq';
import { NewsletterCta } from '@/components/sections/newsletter-cta';
import { OrganizationSchema } from '@/components/schema/organization-schema';
import { WebsiteSchema } from '@/components/schema/website-schema';
import { FAQSchema } from '@/components/schema/faq-schema';

export const revalidate = 60;

export default async function HomePage() {
  const [categories, recentPosts, latestSeries, allArticles] = await Promise.all([
    getAllCategories(),
    getNonSeriesPublishedPostsWithRelations(3),
    getLatestSeriesWithPosts(1, 999),
    getAllArticles(),
  ]);

  // Detect upcoming (scheduled, not yet published) parts per series
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

  // Add upcoming info and upcoming parts to published series
  const seriesWithUpcoming = (latestSeries || []).map((s) => ({
    ...s,
    upcomingCount: upcomingBySeries.get(s.seriesSlug)?.count ?? 0,
    nextDate: upcomingBySeries.get(s.seriesSlug)?.nextDate ?? null,
    upcomingParts: (upcomingPartsBySeries.get(s.seriesSlug) ?? []).sort(
      (a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    ),
  }));

  return (
    <main>
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqItems} />

      <Hero />
      <FeaturedQuote />
      <Philosophy />
      <Topics categories={categories || []} />
      <LatestArticles posts={recentPosts || []} />
      <LatestSeries series={seriesWithUpcoming} />
      <WhyTam />
      <Faq />
      <NewsletterCta />
    </main>
  );
}
