import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article-card';

export const revalidate = 60;

export const metadata = {
  title: 'Semua Artikel',
};

export default async function ArticlesPage() {
  const supabase = createClient();

  const { data: posts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  return (
    <main className="container mx-auto px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 font-serif text-3xl font-bold md:text-4xl">
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
