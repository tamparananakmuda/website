import { createPublicClient } from '@/lib/supabase/public';
import { Hero } from '@/components/sections/hero';
import { FeaturedQuote } from '@/components/sections/featured-quote';
import { Philosophy } from '@/components/sections/philosophy';
import { Topics } from '@/components/sections/topics';
import { LatestArticles } from '@/components/sections/latest-articles';
import { WhyTam } from '@/components/sections/why-tam';
import { Faq, faqItems } from '@/components/sections/faq';
import { NewsletterCta } from '@/components/sections/newsletter-cta';
import { OrganizationSchema } from '@/components/schema/organization-schema';
import { WebsiteSchema } from '@/components/schema/website-schema';
import { FAQSchema } from '@/components/schema/faq-schema';

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createPublicClient();

  const [{ data: categories }, { data: recentPosts }] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .order('title', { ascending: true }),
    supabase
      .from('posts')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('published_at', { ascending: false })
      .limit(3),
  ]);

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
      <WhyTam />
      <Faq />
      <NewsletterCta />
    </main>
  );
}
