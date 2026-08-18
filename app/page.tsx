import { Hero } from '@/components/sections/hero';
import { FeaturedQuote } from '@/components/sections/featured-quote';
import { Philosophy } from '@/components/sections/philosophy';
import { HomeBelowFold } from '@/components/sections/home-below-fold';
import { FAQSchema } from '@/components/schema/faq-schema';
import { faqItems } from '@/components/sections/faq';

export const revalidate = 60;
export const dynamic = 'force-static';

export default async function HomePage() {
  return (
    <main>
      <FAQSchema items={faqItems} />

      <Hero />
      <FeaturedQuote />
      <Philosophy />
      <HomeBelowFold />
    </main>
  );
}
