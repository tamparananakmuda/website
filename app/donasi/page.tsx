import type { Metadata } from 'next';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import DonasiForm from './donasi-form';

export const metadata: Metadata = {
  title: 'Donasi',
  description:
    'Dukung jurnalisme independen TAM. Tidak ada paywall, tidak ada iklan yang mengganggu. Donasi kamu membantu kami tetap independen dan terus menulis tanpa kompromi.',
  keywords: ['donasi tamparan anak muda', 'dukung jurnalisme independen', 'donasi media digital', 'dukung TAM', 'donasi qris'],
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
      'Dukung jurnalisme independen TAM. Donasi kamu membantu kami tetap independen dan terus menulis tanpa kompromi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donasi - Tamparan Anak Muda',
    description:
      'Dukung jurnalisme independen TAM. Donasi kamu membantu kami tetap independen dan terus menulis tanpa kompromi.',
  },
};

export default function DonasiPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Donasi', href: '/donasi' },
      ]} />
      <DonasiForm />
    </>
  );
}
