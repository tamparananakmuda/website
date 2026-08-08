import type { Metadata } from 'next';
import { IntelligenceChatInterface } from '@/components/tami/intelligence-chat-interface';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: 'TAMI AI - Autonomous Cognitive Intelligence Portal',
  description:
    'TAMI (Tamparan Anak Muda Intelligence) adalah asisten AI kecerdasan kognitif dengan antarmuka independen untuk mendiagnosa realita karir, keuangan, & tekanan hidup.',
  alternates: {
    canonical: `${siteUrl}/tami`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${siteUrl}/tami`,
    siteName: 'TAMPARAN ANAK MUDA',
    title: 'TAMI AI - Autonomous Cognitive Intelligence Portal',
    description:
      'TAMI (Tamparan Anak Muda Intelligence) adalah asisten AI kecerdasan kognitif dengan antarmuka independen untuk mendiagnosa realita karir, keuangan, & tekanan hidup.',
    images: [
      {
        url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp',
        width: 1600,
        height: 900,
        alt: 'TAMI AI - Cognitive Intelligence Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAMI AI - Autonomous Cognitive Intelligence Portal',
    description:
      'TAMI (Tamparan Anak Muda Intelligence) adalah asisten AI kecerdasan kognitif dengan antarmuka independen untuk mendiagnosa realita karir, keuangan, & tekanan hidup.',
    images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
  },
};

export default function TamiPage() {
  return (
    <main className="w-full h-screen bg-neutral-950 overflow-hidden flex flex-col">
      <IntelligenceChatInterface />
    </main>
  );
}


