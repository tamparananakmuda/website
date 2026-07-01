import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: {
    default: 'TAMPARAN ANAK MUDA',
    template: '%s | TAMPARAN ANAK MUDA',
  },
  description:
    'Perspektif jujur untuk anak muda Indonesia yang lagi berproses menjadi diri sendiri.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans`}>
        <SiteHeader />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        {umamiUrl && umamiWebsiteId && (
          <Script
            src={`${umamiUrl}/tam.js`}
            data-website-id={umamiWebsiteId}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
