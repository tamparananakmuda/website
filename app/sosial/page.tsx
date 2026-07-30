import { Metadata } from 'next';
import { getPublishedSocialPosts } from '@/lib/db/queries/social-posts';
import type { SocialPost } from '@/lib/db/schema';
import SocialGrid from './social-grid';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

export const metadata: Metadata = {
  title: 'TAM+ - Video, Reels, dan Thread Pilihan',
  description: 'TAM+ adalah konten sosial pilihan dari YouTube, TikTok, Instagram, dan X. Konten yang membuat kamu berpikir, bukan sekadar scroll.',
  keywords: ['tam plus', 'tam+ tamparan anak muda', 'video gen z', 'tiktok gen z', 'reels indonesia', 'konten pilihan'],
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

export default async function SosialPage() {
  let posts: SocialPost[] = [];
  try {
    posts = await getPublishedSocialPosts(30);
  } catch {
    // social_posts table may not exist yet
  }

  const videoPosts = posts.filter((p) => p.videoUrl);
  const heroPost = videoPosts[0] || posts[0] || null;
  const spotlightPosts = videoPosts.slice(1, 7);
  const gridPosts = posts;

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM+', href: '/sosial' },
      ]} />

      <div className="mb-8">
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
          Video, reels, dan thread pilihan TAM+. Bukan sekadar konten untuk di-scroll, tapi perspektif yang membuat kamu berpikir.
        </p>
      </div>

      <SocialGrid
        posts={gridPosts || []}
        heroPost={heroPost || null}
        spotlightPosts={spotlightPosts}
      />
    </main>
  );
}
