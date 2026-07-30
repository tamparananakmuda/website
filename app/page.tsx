import { getAllCategories } from '@/lib/db/queries/categories';
import { getNonSeriesPublishedPostsWithRelations, getLatestSeriesWithPosts } from '@/lib/db/queries/posts';
import { series as seriesConfig } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
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
  const [categories, recentPosts, latestSeries] = await Promise.all([
    getAllCategories(),
    getNonSeriesPublishedPostsWithRelations(3),
    getLatestSeriesWithPosts(1, 999),
  ]);

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
      <LatestSeries series={latestSeries || []} comingSoon={comingSoonSeries} />
      <WhyTam />
      <Faq />
      <NewsletterCta />
    </main>
  );
}
