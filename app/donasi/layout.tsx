import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donasi',
  description:
    'Dukung TAMPARAN ANAK MUDA tetap independen. Donasi via QRIS dan Virtual Account. TAM gratis untuk semua, donasi membantu kami terus menulis tanpa kompromi.',
  keywords: ['donasi media independen', 'dukung tamparan anak muda', 'donasi qris', 'media independen indonesia'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/donasi`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/donasi`,
    title: 'Donasi - Tamparan Anak Muda',
    description:
      'Dukung TAMPARAN ANAK MUDA tetap independen. Donasi via QRIS dan Virtual Account. TAM gratis untuk semua, donasi membantu kami terus menulis tanpa kompromi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donasi - Tamparan Anak Muda',
    description:
      'Dukung TAMPARAN ANAK MUDA tetap independen. Donasi via QRIS dan Virtual Account. TAM gratis untuk semua, donasi membantu kami terus menulis tanpa kompromi.',
  },
};

export default function DonasiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
