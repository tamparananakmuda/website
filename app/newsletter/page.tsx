import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import NewsletterForm from './newsletter-form';

export const metadata: Metadata = {
  title: 'Newsletter',
  description:
    'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak. Gratis, berhenti kapan saja.',
  keywords: ['newsletter anak muda', 'newsletter gen z', 'newsletter tamparan anak muda', 'sudut pandang mingguan', 'newsletter gratis indonesia'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/newsletter`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/newsletter`,
    title: 'Newsletter - Tamparan Anak Muda',
    description:
      'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter - Tamparan Anak Muda',
    description:
      'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak.',
  },
};

export default function NewsletterPage() {
  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Newsletter', href: '/newsletter' },
      ]} />
      <NewsletterForm />
    </main>
  );
}
