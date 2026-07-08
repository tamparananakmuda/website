import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { MarkdownContent } from '@/components/markdown-content';
import { ArticleSchema } from '@/components/schema/article-schema';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { BookmarkButton } from '@/components/bookmark-button';
import { ReadingTracker } from '@/components/reading-tracker';
import { ShareButtons } from '@/components/share-buttons';
import { SponsoredBadge } from '@/components/sponsored-badge';
import { DonationCTA } from '@/components/donation-cta';
import { TableOfContents } from '@/components/table-of-contents';
import { RelatedArticles } from '@/components/related-articles';
import { CommentsSection } from '@/components/comments-section';
import { PremiumGate } from '@/components/premium-gate';

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
    .select('title, excerpt, seo_meta_title, seo_meta_description, seo_og_image_url, cover_image_url, published_at, updated_at, slug')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single();

  if (!post) {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/artikel/${post.slug}`;
  const ogImage = post.seo_og_image_url || post.cover_image_url || undefined;

  return {
    title: post.seo_meta_title || post.title,
    description: post.seo_meta_description || post.excerpt || undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: post.seo_meta_title || post.title,
      description: post.seo_meta_description || post.excerpt || undefined,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo_meta_title || post.title,
      description: post.seo_meta_description || post.excerpt || undefined,
      ...(ogImage && { images: [ogImage] }),
    },
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

  const { data: related } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, cover_image_url, reading_time, category:categories(*)')
    .eq('status', 'published')
    .neq('id', post.id)
    .eq('category_id', post.category_id)
    .order('published_at', { ascending: false })
    .limit(3);

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
        imageUrl={post.cover_image_url || post.seo_og_image_url || undefined}
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
          <div className="mb-8 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Ditulis oleh {post.author.name}
              {post.updated_at && (
                <span className="ml-2">&middot; Terakhir diperbarui: {new Date(post.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
            </div>
            <BookmarkButton postId={post.id} />
          </div>
        )}
      </header>

      {post.is_sponsored && post.sponsor_name && (
        <div className="mx-auto max-w-3xl mb-6">
          <SponsoredBadge
            sponsorName={post.sponsor_name}
            sponsorUrl={post.sponsor_url}
            disclosure={post.sponsor_disclosure}
          />
        </div>
      )}

      <div className="mx-auto max-w-3xl">
        <TableOfContents body={post.body} />
        {post.is_premium ? (
          <>
            <MarkdownContent body={post.premium_excerpt || post.excerpt || ''} />
            <PremiumGate postId={post.id} excerpt={post.premium_excerpt || post.excerpt} />
          </>
        ) : (
          <MarkdownContent body={post.body} />
        )}
      </div>

      <div className="mx-auto max-w-3xl mt-8 pt-6 border-t border-border">
        <ShareButtons title={post.title} slug={post.slug} />
      </div>

      {!post.is_sponsored && <DonationCTA />}

      {related && related.length > 0 && (
        <RelatedArticles articles={related} />
      )}

      <CommentsSection postId={post.id} />

      <ReadingTracker postId={post.id} />
    </article>
  );
}
