import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import SocialGrid from './social-grid';

export const metadata: Metadata = {
  title: 'Konten Sosial',
  description: 'Konten pilihan TAM dari X, Instagram, TikTok, dan YouTube dalam satu tempat.',
};

export const revalidate = 300;

export default async function SosialPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );

  const { data: posts } = await supabase
    .from('social_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(24);

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
