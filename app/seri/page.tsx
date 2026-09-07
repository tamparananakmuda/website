import { series as seriesConfig, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { SeriesClient, type PublishedSeriesItem, type ComingSoonSeriesItem } from './series-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Seri Investigasi Mendalam',
  description:
    'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  keywords: ['seri artikel', 'konten mendalam', 'investigasi gen z', 'tamparan anak muda seri', 'artikel bersambung'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
    title: 'Seri Investigasi Mendalam - Tamparan Anak Muda',
    description:
      'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seri Investigasi Mendalam - Tamparan Anak Muda',
    description:
      'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  },
};

export default async function SeriesPage() {
  const seriesWithCounts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 100);
      const category = posts[0]?.categoryId ? getCategoryById(posts[0].categoryId) : null;
      const totalReadingMinutes = posts.reduce((acc, p) => acc + (p.readingTime || 5), 0);

      // Determine appropriate cover image with robust fallbacks
      const firstPostWithCover = posts.find((p) => p.coverImageUrl);
      const coverImageSrc =
        firstPostWithCover?.coverImageUrl ||
        (posts[0] ? `/api/og/card?slug=${posts[0].slug}` : 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp');

      const mappedPosts = posts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || '',
        readingTime: p.readingTime || 5,
        seriesOrder: p.seriesOrder,
        coverImageUrl: p.coverImageUrl || null,
      }));

      return {
        id: s.id,
        title: s.title,
        slug: s.slug,
        description: s.description || null,
        status: s.status,
        expectedDate: s.expectedDate,
        expectedParts: s.expectedParts,
        teaser: s.teaser,
        postCount: posts.length,
        category: category
          ? {
              id: category.id,
              title: category.title,
              slug: category.slug,
              color: category.color,
            }
          : null,
        posts: mappedPosts,
        totalReadingMinutes,
        coverImageSrc,
      };
    })
  );

  const publishedSeries: PublishedSeriesItem[] = seriesWithCounts
    .filter((s) => s.postCount > 0)
    .map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      postCount: s.postCount,
      totalReadingMinutes: s.totalReadingMinutes,
      category: s.category,
      posts: s.posts,
      coverImageSrc: s.coverImageSrc,
    }));

  const comingSoonSeries: ComingSoonSeriesItem[] = seriesWithCounts
    .filter((s) => s.status === 'coming-soon' || s.postCount === 0)
    .map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      description: s.description,
      status: s.status,
      expectedDate: s.expectedDate,
      expectedParts: s.expectedParts,
      teaser: s.teaser,
    }));

  const totalPublished = publishedSeries.length;
  const totalArticles = publishedSeries.reduce((sum, s) => sum + s.postCount, 0);
  const totalMinutes = publishedSeries.reduce((sum, s) => sum + s.totalReadingMinutes, 0);
  const totalRoadmap = comingSoonSeries.length;

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Seri', href: '/seri' },
        ]}
      />

      {/* HERO SECTION - 100% THEME ADAPTIVE */}
      <section className="relative w-full overflow-hidden border-b border-border bg-gradient-to-b from-muted/50 via-background to-background pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Ambient atmospheric gradients (soft glow in dark, clean tint in light) */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[380px] w-[700px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-xs font-bold tracking-widest text-primary uppercase">
                INVESTIGASI MULTI-PART
              </span>
            </div>

            {/* Main Editorial Title */}
            <h1 className="mb-5 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:leading-[1.1]">
              Seri Dokumen <span className="text-primary">&amp; Investigasi</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Arsip liputan mendalam dan telaah sistemik TAM yang disusun berseri untuk membongkar akar
              realitas generasi muda, bukan sekadar riak di permukaan.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE CLIENT SERIES EXPLORER */}
      <SeriesClient
        publishedSeries={publishedSeries}
        comingSoonSeries={comingSoonSeries}
        stats={{
          totalPublished,
          totalArticles,
          totalMinutes,
          totalRoadmap,
        }}
      />
    </main>
  );
}
