import type { Metadata } from 'next';
import { createPublicClient } from '@/lib/supabase/public';
import { WhitepaperCard } from '@/components/whitepaper-card';

export const metadata: Metadata = {
  title: 'Whitepaper',
  description:
    'Riset mendalam dan analisis data tentang generasi muda Indonesia. Whitepaper TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
    title: 'Whitepaper - Tamparan Anak Muda',
    description:
      'Riset mendalam dan analisis data tentang generasi muda Indonesia. Whitepaper TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Whitepaper - Tamparan Anak Muda',
    description:
      'Riset mendalam dan analisis data tentang generasi muda Indonesia. Whitepaper TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  },
};

export const revalidate = 60;

export default async function WhitepaperIndexPage() {
  const supabase = createPublicClient();

  const { data: whitepapers } = await supabase
    .from('whitepapers')
    .select('slug, title, subtitle, summary, reading_time, tags, cover_image_url, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Whitepaper
        </p>
        <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          Riset dan analisis mendalam
        </h1>
        <p className="mb-12 text-lg leading-relaxed text-muted-foreground">
          Bukan opini, bukan clickbait. Whitepaper TAM ditulis berbasis data dan riset,
          dengan sumber yang bisa kamu verifikasi sendiri.
        </p>

        {whitepapers && whitepapers.length > 0 ? (
          <div className="grid gap-6">
            {whitepapers.map((wp) => (
              <WhitepaperCard key={wp.slug} {...wp} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">
            Whitepaper pertama akan segera hadir.
          </p>
        )}
      </div>
    </main>
  );
}
