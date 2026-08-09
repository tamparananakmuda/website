import { Hero } from '@/components/sections/hero';
import { FeaturedQuote } from '@/components/sections/featured-quote';
import { Philosophy } from '@/components/sections/philosophy';
import { HomeBelowFold } from '@/components/sections/home-below-fold';
import { OrganizationSchema } from '@/components/schema/organization-schema';
import { WebsiteSchema } from '@/components/schema/website-schema';
import { FAQSchema } from '@/components/schema/faq-schema';
import { faqItems } from '@/components/sections/faq';

export const revalidate = 60;
export const dynamic = 'force-static';

export default async function HomePage() {
  return (
    <main>
      <OrganizationSchema />
      <WebsiteSchema />
      <FAQSchema items={faqItems} />

      <Hero />
      <FeaturedQuote />
      <Philosophy />
      <HomeBelowFold />
    </main>
  );
}
