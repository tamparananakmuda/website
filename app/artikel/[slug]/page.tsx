import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MarkdownContent } from '@/components/markdown-content';
import { ArticleSchema } from '@/components/schema/article-schema';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

interface ArticlePageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('title, excerpt, seo_meta_title, seo_meta_description')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  return {
    title: post.seo_meta_title || post.title,
    description: post.seo_meta_description || post.excerpt || undefined,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = createClient();
  const { data: post } = await supabase
    .from('posts')
    .select('*, category:categories(*), author:authors(*)')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12">
      <ArticleSchema
        title={post.title}
        description={post.excerpt || ''}
        slug={post.slug}
        publishedAt={post.published_at || post.created_at}
        modifiedAt={post.updated_at}
        authorName={post.author?.name}
        categoryTitle={post.category?.title}
      />
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Artikel', href: '/artikel' }, { name: post.title, href: `/artikel/${post.slug}` }]} />
      <header className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-sm">
          {post.category && (
            <span style={{ color: post.category.color }}>
              {post.category.title}
            </span>
          )}
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{post.reading_time} menit baca</span>
        </div>
        <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mb-6 text-lg text-muted-foreground">{post.excerpt}</p>
        )}
        {post.author && (
          <div className="mb-8 text-sm text-muted-foreground">
            Ditulis oleh {post.author.name}
            {post.updated_at && (
              <span className="ml-2">&middot; Terakhir diperbarui: {new Date(post.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            )}
          </div>
        )}
      </header>

      <div className="mx-auto max-w-3xl">
        <MarkdownContent body={post.body} />
      </div>
    </article>
  );
}
