import { Metadata } from 'next';
import { getPublishedSocialPosts } from '@/lib/db/queries/social-posts';
import type { SocialPost } from '@/lib/db/schema';
import SlideGrid from '@/components/slide-grid';
import ReelsGrid from '@/components/reels-grid';
import VideoLandscapeGrid from '@/components/video-landscape-grid';
import SeriesBannerSection from '@/components/series-banner-section';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import slidesData from '@/files/slides-data.json';

export const metadata: Metadata = {
  title: 'TAM+ - Video, Reels, dan Slide Pilihan',
  description: 'TAM+ adalah konten sosial pilihan dari YouTube, TikTok, Instagram, dan X. Konten yang membuat kamu berpikir, bukan sekadar scroll.',
  keywords: ['tam plus', 'tam+ tamparan anak muda', 'video gen z', 'tiktok gen z', 'reels indonesia', 'konten pilihan', 'slide gen z'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/sosial`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/sosial`,
    title: 'TAM+ - Tamparan Anak Muda',
    description: 'TAM+ adalah konten sosial pilihan. Konten yang membuat kamu berpikir, bukan sekadar scroll.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAM+ - Tamparan Anak Muda',
    description: 'TAM+ adalah konten sosial pilihan. Konten yang membuat kamu berpikir, bukan sekadar scroll.',
  },
};

export const revalidate = 300;
export const dynamic = 'force-dynamic';

// Sample Special Topic / Series Data for Featured Banner Section
const sampleSeries = {
  id: 'generasi-sewa',
  title: 'SERI: GENERASI SEWA',
  subtitle: 'Fenomena & Realita Ekonomi Gen-Z',
  description: 'Membongkar jebakan ekonomi generasi sewa, dari biaya hidup rumah tangga, gaya hidup hingga strategi membangun fondasi finansial mandiri.',
  bgGradient: 'bg-emerald-500',
  accentColor: 'emerald',
  tag: 'GenerasiSewa',
};

export default async function SosialPage() {
  let posts: SocialPost[] = [];
  try {
    posts = await getPublishedSocialPosts(40);
  } catch {
    // social_posts table may not exist yet
  }

  // Filter posts by media orientation & type
  const reelsPosts = posts.filter(
    (p) => p.platform === 'tiktok' || p.platform === 'instagram' || (p.duration && p.duration < 120)
  );

  const videoLandscapePosts = posts.filter(
    (p) => (p.platform === 'youtube' || (p.duration && p.duration >= 120)) && !reelsPosts.includes(p)
  );

  const seriesPosts = posts.slice(0, 5);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 space-y-12">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM+', href: '/sosial' },
      ]} />

      {/* Header Title */}
      <div>
        <div className="mb-3 flex items-center gap-3">
          <div className="flex gap-1">
            <div className="h-7 w-1.5 rounded-full bg-primary" />
            <div className="h-7 w-1.5 rounded-full bg-primary" />
          </div>
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            TAMPARAN ANAK MUDA
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
          TAM+
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Video 9:16, reels, slide infografis 4:5, dan seri video pilihan TAM+. Bukan sekadar konten untuk di-scroll, tapi perspektif yang membuat kamu berpikir.
        </p>
      </div>

      {/* SECTION 1: Koleksi Slide Konten (4:5 Ratio Grid) */}
      {slidesData.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-red-600" />
              <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
                Koleksi Slide Konten (4:5)
              </h2>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {slidesData.length} Slide Set
            </span>
          </div>

          <SlideGrid slideSets={slidesData} />
        </section>
      )}

      {/* SECTION 2: Reels & Shorts Vertikal (9:16 Ratio Grid) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-pink-600" />
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
              Reels & Shorts Vertikal (9:16)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {reelsPosts.length > 0 ? `${reelsPosts.length} Video` : 'Segera Hadir'}
          </span>
        </div>

        {reelsPosts.length > 0 ? (
          <ReelsGrid posts={reelsPosts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/40">
            <p className="text-sm text-muted-foreground">Konten Reels & Shorts (9:16) sedang disiapkan.</p>
          </div>
        )}
      </section>

      {/* SECTION 3: Banner Topik & Seri Khusus */}
      <SeriesBannerSection
        seriesInfo={sampleSeries}
        posts={seriesPosts.length > 0 ? seriesPosts : posts}
      />

      {/* SECTION 4: Video Landscape (16:9 Ratio Grid) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-blue-600" />
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
              Video & Wawancara Landscape (16:9)
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {videoLandscapePosts.length > 0 ? `${videoLandscapePosts.length} Video` : 'Segera Hadir'}
          </span>
        </div>

        {videoLandscapePosts.length > 0 ? (
          <VideoLandscapeGrid posts={videoLandscapePosts} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/70 p-8 text-center bg-card/40">
            <p className="text-sm text-muted-foreground">Konten Video Landscape (16:9) sedang disiapkan.</p>
          </div>
        )}
      </section>
    </main>
  );
}

