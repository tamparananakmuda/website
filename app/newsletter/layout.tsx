import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Newsletter',
  description:
    'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak. Gratis, berhenti kapan saja.',
  keywords: ['newsletter gen z', 'newsletter mingguan', 'sudut pandang anak muda', 'tamparan anak muda newsletter'],
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
      'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak. Gratis, berhenti kapan saja.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter - Tamparan Anak Muda',
    description:
      'Surat mingguan untuk anak muda yang ingin melihat kenyataan lebih jelas. Satu sudut pandang baru setiap minggu, bukan link-link acak. Gratis, berhenti kapan saja.',
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
