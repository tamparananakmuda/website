import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import SocialDetail from './social-detail';
import Link from 'next/link';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: post } = await supabase
    .from('social_posts')
    .select('title, excerpt, platform, thumbnail_url')
    .eq('id', parseInt(params.id, 10))
    .eq('status', 'published')
    .single();

  if (!post) return { title: 'Konten tidak ditemukan' };

  return {
    title: post.title || `Konten ${post.platform.toUpperCase()} - TAM`,
    description: post.excerpt || undefined,
    openGraph: post.thumbnail_url ? { images: [post.thumbnail_url] } : undefined,
  };
}

export const revalidate = 300;

export default async function SocialPostPage({ params }: Props) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: post } = await supabase
    .from('social_posts')
    .select('*')
    .eq('id', parseInt(params.id, 10))
    .eq('status', 'published')
    .single();

  if (!post) notFound();

  const { data: related } = await supabase
    .from('social_posts')
    .select('id, platform, title, thumbnail_url')
    .eq('status', 'published')
    .eq('platform', post.platform)
    .neq('id', post.id)
    .limit(4);

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-4">
        <Link href="/sosial" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Semua konten sosial
        </Link>
      </div>
      <SocialDetail post={post} related={related || []} />
    </main>
  );
}
