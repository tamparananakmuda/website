import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { ArticleCard } from '@/components/article-card';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { CollectionPageSchema } from '@/components/schema/collection-page-schema';

interface CategoryPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const supabase = createPublicClient();
  const { data: category } = await supabase
    .from('categories')
    .select('title, description, slug')
    .eq('slug', params.slug)
    .single();

  if (!category) {
    return { title: 'Kategori Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/kategori/${category.slug}`;

  return {
    title: category.title,
    description: category.description || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createPublicClient();

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
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(12);

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Kategori', href: '/kategori' }, { name: category.title, href: `/kategori/${category.slug}` }]} />
      <CollectionPageSchema
        name={category.title}
        slug={category.slug}
        description={category.description || undefined}
        items={(posts || []).map((p) => ({ title: p.title, slug: p.slug }))}
      />
      <header className="mb-12 max-w-2xl">
        <h1
          className="mb-4 text-3xl font-bold md:text-4xl"
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
