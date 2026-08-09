import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Manrope } from 'next/font/google';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import './globals.css';
import { ConditionalHeader } from '@/components/conditional-header';
import { ConditionalFooter } from '@/components/conditional-footer';
import { SearchSchema } from '@/components/schema/search-schema';
import { ThemeProvider } from '@/components/theme-provider';

const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then((m) => m.SpeedInsights), { ssr: false });
const Analytics = dynamic(() => import('@vercel/analytics/next').then((m) => m.Analytics), { ssr: false });
const WebVitals = dynamic(() => import('@/components/web-vitals').then((m) => m.WebVitals), { ssr: false });

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Menyadarkan Generasi Muda akan Kenyataan - Tamparan Anak Muda',
    template: '%s - Tamparan Anak Muda',
  },
  description:
    'Editorial media digital untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset. Kami menulis agar kamu melihat kenyataan lebih jelas, bukan untuk membuatmu merasa nyaman.',
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
    title: 'Menyadarkan Generasi Muda akan Kenyataan - Tamparan Anak Muda',
    description:
      'Editorial media digital untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.',
    images: [
      {
        url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp',
        width: 1600,
        height: 900,
        alt: 'TAMPARAN ANAK MUDA - Melawan Ilusi. Membangun Realita.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tamparananakmuda',
    creator: '@tamparananakmuda',
    title: 'Menyadarkan Generasi Muda akan Kenyataan - Tamparan Anak Muda',
    description:
      'Editorial media digital untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.',
    images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: 'any', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'TAMPARAN ANAK MUDA',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF9F6' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="id" className={`scroll-smooth dark ${manrope.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        <meta name="robots" content="max-image-preview:large" />
        <link rel="preconnect" href="https://cdn.tamparananakmuda.com" />
        <link rel="dns-prefetch" href="https://analytics.tamparananakmuda.com" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('tam-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='light'||(!t&&!d)){document.documentElement.classList.remove('dark')}}catch(e){}})()` }} />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main-content" className="skip-to-content">
          Lewati ke konten utama
        </a>
        <SearchSchema siteUrl={siteUrl} />
        <ThemeProvider>
          <ConditionalHeader />
          <div className="flex-1" id="main-content">{children}</div>
          <ConditionalFooter />
        </ThemeProvider>
        {umamiUrl && umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/tam.js`}
            data-website-id={umamiWebsiteId}
            strategy="lazyOnload"
          />
        )}
        <SpeedInsights />
        <Analytics />
        <WebVitals />
      </body>
    </html>
  );
}
