import { Metadata } from 'next';
import { getPublishedSocialPosts } from '@/lib/db/queries/social-posts';
import type { SocialPost } from '@/lib/db/schema';
import SocialGrid from './social-grid';

export const metadata: Metadata = {
  title: 'Konten Sosial',
  description: 'Konten pilihan TAM dari X, Instagram, TikTok, dan YouTube dalam satu tempat.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/sosial`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/sosial`,
    title: 'Konten Sosial - Tamparan Anak Muda',
    description: 'Konten pilihan TAM dari X, Instagram, TikTok, dan YouTube dalam satu tempat.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Konten Sosial - Tamparan Anak Muda',
    description: 'Konten pilihan TAM dari X, Instagram, TikTok, dan YouTube dalam satu tempat.',
  },
};

export const revalidate = 300;
export const dynamic = 'force-dynamic';

export default async function SosialPage() {
  let posts: SocialPost[] = [];
  try {
    posts = await getPublishedSocialPosts(24);
  } catch {
    // social_posts table may not exist yet in the Drizzle-connected DB
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Konten Sosial</h1>
        <p className="text-muted-foreground">
          Thread, reels, dan video pilihan TAM. Semua dalam satu tempat, tanpa algoritma yang ngatur apa yang kamu lihat.
        </p>
      </div>
      <SocialGrid posts={posts || []} />
    </main>
  );
}
