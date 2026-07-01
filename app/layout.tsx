import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ConditionalHeader } from '@/components/conditional-header';
import { SiteFooter } from '@/components/site-footer';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  title: {
    default: 'TAMPARAN ANAK MUDA | Editorial Media untuk Anak Muda Indonesia',
    template: '%s | TAMPARAN ANAK MUDA',
  },
  description:
    'TAMPARAN ANAK MUDA adalah editorial media digital Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset, bukan ringkasan 60 detik, tapi tulisan mendalam yang membuat anak muda berpikir lebih kritis dan bertindak lebih berani.',
  keywords: [
    'media anak muda indonesia',
    'pengembangan diri',
    'mindset',
    'bisnis muda',
    'keuangan generasi muda',
    'teknologi',
    'tamparan anak muda',
  ],
  authors: [{ name: 'TAMPARAN ANAK MUDA' }],
  creator: 'TAMPARAN ANAK MUDA',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'TAMPARAN ANAK MUDA',
    title: 'TAMPARAN ANAK MUDA | Editorial Media untuk Anak Muda Indonesia',
    description:
      'Editorial media Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset untuk anak muda.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAMPARAN ANAK MUDA',
    description:
      'Menyadarkan generasi muda akan kenyataan. Editorial media untuk anak muda Indonesia.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="id" className={`scroll-smooth ${jakarta.variable} ${syne.variable}`}>
      <body className="flex min-h-screen flex-col font-sans">
        <ConditionalHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {umamiUrl && umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/tam.js`}
            data-website-id={umamiWebsiteId}
            strategy="lazyOnload"
          />
        )}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
