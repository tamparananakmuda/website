import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Syne } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { ConditionalHeader } from '@/components/conditional-header';
import { SiteFooter } from '@/components/site-footer';
import { SearchSchema } from '@/components/schema/search-schema';
import { ThemeProvider } from '@/components/theme-provider';
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
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Menyadarkan generasi muda akan kenyataan - Tamparan Anak Muda',
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
    title: 'Menyadarkan generasi muda akan kenyataan - Tamparan Anak Muda',
    description:
      'Editorial media digital untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tamparananakmuda',
    creator: '@tamparananakmuda',
    title: 'Menyadarkan generasi muda akan kenyataan - Tamparan Anak Muda',
    description:
      'Editorial media digital untuk anak muda Indonesia. Tulisan mendalam tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
    types: {
      'application/rss+xml': `${siteUrl}/rss.xml`,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
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
    <html lang="id" className={`scroll-smooth dark ${jakarta.variable} ${syne.variable}`} suppressHydrationWarning>
      <head>
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
          <SiteFooter />
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
      </body>
    </html>
  );
}
