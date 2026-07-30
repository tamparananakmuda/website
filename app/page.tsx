import { getAllCategories } from '@/lib/db/queries/categories';
import { getNonSeriesPublishedPostsWithRelations, getLatestSeriesWithPosts } from '@/lib/db/queries/posts';
import { series as seriesConfig } from '@/content/config';
import { getPostsBySeries, getAllArticles } from '@/lib/articles/loader';
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
    }
  }

  // Add upcoming info to published series
  const seriesWithUpcoming = (latestSeries || []).map((s) => ({
    ...s,
    upcomingCount: upcomingBySeries.get(s.seriesSlug)?.count ?? 0,
    nextDate: upcomingBySeries.get(s.seriesSlug)?.nextDate ?? null,
  }));

  // Get coming-soon series that don't have published articles yet
  const seriesWithCounts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 1);
      return { ...s, hasPosts: posts.length > 0 };
    })
  );
  const comingSoonSeries = seriesWithCounts.filter((s) => s.status === 'coming-soon' && !s.hasPosts);

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
      <LatestSeries series={seriesWithUpcoming} comingSoon={comingSoonSeries} />
      <WhyTam />
      <Faq />
      <NewsletterCta />
    </main>
  );
}
