import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArticleCard } from '@/components/article-card';

interface CategoryPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('title, description')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return { title: 'Kategori Tidak Ditemukan' };
  }

  return {
    title: category.title,
    description: category.description || undefined,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    notFound();
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('*, category:categories(*)')
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false });

  return (
    <main className="container mx-auto px-4 py-16">
      <header className="mb-12 max-w-2xl">
        <h1
          className="mb-4 font-serif text-3xl font-bold md:text-4xl"
          style={{ color: category.color }}
        >
          {category.title}
        </h1>
        {category.description && (
          <p className="text-lg text-muted-foreground">{category.description}</p>
        )}
      </header>

      {posts && posts.length > 0 ? (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          Belum ada artikel di kategori ini.
        </p>
      )}
    </main>
  );
}
