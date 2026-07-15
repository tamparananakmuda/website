import { createPublicClient } from '@/lib/supabase/public';
import { ArticleCard } from '@/components/article-card';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

export const revalidate = 60;

export const metadata = {
  title: 'Semua Artikel',
  description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/artikel`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/artikel`,
    title: 'Semua Artikel - Tamparan Anak Muda',
    description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semua Artikel - Tamparan Anak Muda',
    description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  },
};

export default async function ArticlesPage() {
  const supabase = createPublicClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(12);

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Artikel', href: '/artikel' }]} />
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Semua Artikel
        </h1>
        <p className="text-lg text-muted-foreground">
          Kumpulan perspektif jujur untuk anak muda yang lagi berproses.
        </p>
      </header>

      {posts && posts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Belum ada artikel yang dipublish. Nantikan konten pertama kami.
        </p>
      )}
    </main>
  );
}
