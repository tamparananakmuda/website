import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedSocialPostById, getPublishedSocialPosts, getRelatedSocialPosts } from '@/lib/db/queries/social-posts';
import SocialDetail from './social-detail';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import SlideGrid from '@/components/slide-grid';
import slidesData from '@/files/slides-data.json';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slideItem = slidesData.find((s) => s.id === params.id || s.id === `konten-tam-${params.id}`);
  if (slideItem) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
    const title = `${slideItem.caption.slice(0, 60)}... - TAM+`;
    return {
      title,
      description: slideItem.caption,
      alternates: { canonical: `${siteUrl}/sosial/${slideItem.id}` },
      openGraph: {
        type: 'article',
        locale: 'id_ID',
        url: `${siteUrl}/sosial/${slideItem.id}`,
        title,
        description: slideItem.caption,
        images: slideItem.slides[0] ? [{ url: slideItem.slides[0] }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: slideItem.caption,
        images: slideItem.slides[0] ? [slideItem.slides[0]] : [],
      },
    };
  }

  const post = await getPublishedSocialPostById(params.id).catch(() => null);

  if (!post) return { title: 'Konten tidak ditemukan' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/sosial/${params.id}`;
  const title = post.title || `Konten ${post.platform.toUpperCase()} - TAM`;

  return {
    title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title,
      description: post.excerpt || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt || undefined,
    },
  };
}

export const revalidate = 300;

export default async function SocialPostPage({ params }: Props) {
  // Check slidesData first for instant direct link sharing (Instagram/TikTok style)
  const slideItem = slidesData.find((s) => s.id === params.id || s.id === `konten-tam-${params.id}`);
  if (slideItem) {
    let posts: any[] = [];
    try {
      posts = await getPublishedSocialPosts(40);
    } catch {}

    const reelsPosts = posts.filter(
      (p) => p.platform === 'tiktok' || p.platform === 'instagram' || (p.duration && p.duration < 120)
    );
    const videoLandscapePosts = posts.filter(
      (p) => (p.platform === 'youtube' || (p.duration && p.duration >= 120)) && !reelsPosts.includes(p)
    );
    const seriesPosts = posts.slice(0, 5);
    const sampleSeries = {
      id: 'generasi-sewa',
      title: 'SERI: GENERASI SEWA',
      subtitle: 'Fenomena & Realita Ekonomi Gen-Z',
      description: 'Membongkar jebakan ekonomi generasi sewa, dari biaya hidup rumah tangga, gaya hidup hingga strategi membangun fondasi finansial mandiri.',
      bgGradient: 'bg-emerald-500',
      accentColor: 'emerald',
      tag: 'GenerasiSewa',
    };

    return (
      <main className="container mx-auto px-4 py-8 md:py-12 space-y-12">
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'TAM+', href: '/sosial' },
          { name: slideItem.caption.slice(0, 30), href: `/sosial/${slideItem.id}` },
        ]} />

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
            Video, reels, slide infografis, dan seri video pilihan TAM+. Bukan sekadar konten untuk di-scroll, tapi perspektif yang membuat kamu berpikir.
          </p>
        </div>

        {slidesData.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-red-600" />
                <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
                  Koleksi Slide Konten
                </h2>
              </div>
            </div>

            <SlideGrid slideSets={slidesData} initialSelectedId={slideItem.id} />
          </section>
        )}
      </main>
    );
  }

  const post = await getPublishedSocialPostById(params.id).catch(() => null);

  if (!post) notFound();

  const related = await getRelatedSocialPosts(post.platform, post.id, 4);

  return (
    <main className="container mx-auto px-4 py-12">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Konten Sosial', href: '/sosial' },
        { name: post.title || 'Konten', href: `/sosial/${params.id}` },
      ]} />
      <div className="mb-4">
        <Link href="/sosial" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Semua konten sosial
        </Link>
      </div>
      <SocialDetail post={post} related={related || []} />
    </main>
  );
}
