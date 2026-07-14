import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createPublicClient } from '@/lib/supabase/public';
import { MarkdownContent } from '@/components/markdown-content';
import { FeatureImage } from '@/components/feature-image';
import { ArticleSchema } from '@/components/schema/article-schema';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { AuthorSchema } from '@/components/schema/author-schema';
import { FAQSchema } from '@/components/schema/faq-schema';
import { SponsoredBadge } from '@/components/sponsored-badge';
import { DonationCTA } from '@/components/donation-cta';
import { TableOfContents } from '@/components/table-of-contents';
import { RelatedArticles } from '@/components/related-articles';
import nextDynamic from 'next/dynamic';

const CommentsSection = nextDynamic(() => import('@/components/comments-section').then(m => m.CommentsSection), {
  loading: () => <div className="mx-auto max-w-3xl mt-8 h-48 animate-pulse rounded-xl bg-muted/20" />,
  ssr: false,
});

const ReadingTracker = nextDynamic(() => import('@/components/reading-tracker').then(m => m.ReadingTracker), {
  ssr: false,
});

const PremiumGate = nextDynamic(() => import('@/components/premium-gate').then(m => m.PremiumGate), {
  loading: () => <div className="mx-auto max-w-3xl mt-8 h-32 animate-pulse rounded-xl bg-muted/20" />,
  ssr: false,
});

const BookmarkButton = nextDynamic(() => import('@/components/bookmark-button').then(m => m.BookmarkButton), {
  ssr: false,
});

const ShareButtons = nextDynamic(() => import('@/components/share-buttons').then(m => m.ShareButtons), {
  loading: () => <div className="mx-auto max-w-3xl mt-8 h-10 animate-pulse rounded-lg bg-muted/20" />,
  ssr: false,
});

interface ArticlePageProps {
  params: { slug: string };
}

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const supabase = createPublicClient();
    const { data: post } = await supabase
      .from('posts')
      .select('title, excerpt, seo_meta_title, seo_meta_description, published_at, updated_at, slug')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (!post) {
      return { title: 'Artikel Tidak Ditemukan' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
    const url = `${siteUrl}/artikel/${post.slug}`;

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
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seo_meta_title || post.title,
        description: post.seo_meta_description || post.excerpt || undefined,
      },
    };
  } catch (err) {
    console.error('generateMetadata error:', err);
    return { title: 'Artikel' };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const supabase = createPublicClient();
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('*, category:categories(*), author:authors(*), series:series(*)')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .single();

    if (postError) {
      console.error('Article fetch error:', postError);
    }

    if (!post) {
      notFound();
    }

    const { data: related, error: relatedError } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, cover_image_url, reading_time, category:categories(*)')
      .eq('status', 'published')
      .neq('id', post.id)
      .eq('category_id', post.category_id)
      .order('published_at', { ascending: false })
      .limit(3);

    if (relatedError) {
      console.error('Related fetch error:', relatedError);
    }

    return (
      <article className="container mx-auto px-4 py-12">
        <link rel="preload" as="image" href={`/api/og/feature?slug=${post.slug}`} fetchPriority="high" />
        <ArticleSchema
          title={post.title}
          description={post.excerpt || ''}
          slug={post.slug}
          publishedAt={post.published_at || post.created_at}
          modifiedAt={post.updated_at}
          authorName={post.author?.name}
          authorBio={post.author?.bio || undefined}
          authorSlug={post.author?.slug || undefined}
          categoryTitle={post.category?.title}
          categorySlug={post.category?.slug}
          readingTime={post.reading_time}
          isPremium={post.is_premium}
          isSponsored={post.is_sponsored}
          sponsorName={post.sponsor_name || undefined}
          citations={post.source_references as { title?: string; url?: string }[] | undefined}
          wordCount={post.body?.split(/\s+/).length}
          humanReviewed={post.human_signature || false}
        />
        {post.author && post.author.name && post.author.name !== 'TAMPARAN ANAK MUDA' && (
          <AuthorSchema
            name={post.author.name}
            bio={post.author.bio || undefined}
            slug={post.author.slug || undefined}
          />
        )}
        {post.excerpt && (
          <FAQSchema items={[{ question: `Apa inti dari ${post.title}?`, answer: post.excerpt }]} />
        )}
        <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Artikel', href: '/artikel' }, { name: post.title, href: `/artikel/${post.slug}` }]} />

        {/* Feature image */}
        <FeatureImage
          src={`/api/og/feature?slug=${post.slug}`}
          alt={post.title}
        />

        <header className="mx-auto max-w-3xl" data-article-slug={post.slug} data-category={post.category?.slug}>
          <div className="mb-4 flex items-center gap-2 text-sm">
            {post.category && (
              <span style={{ color: post.category.color }}>
                {post.category.title}
              </span>
            )}
            <span className="text-muted-foreground">&bull;</span>
            <span className="text-muted-foreground">{post.reading_time} menit baca</span>
          </div>
          <h1 className="mb-6 text-3xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mb-6 text-lg text-muted-foreground" data-testid="article-excerpt">{post.excerpt}</p>
          )}
          {post.author && (
            <div className="mb-8 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Ditulis oleh {post.author.name}
                {post.published_at && (
                  <time dateTime={post.published_at} className="ml-2">&middot; {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                )}
                {post.updated_at && post.updated_at !== post.published_at && (
                  <time dateTime={post.updated_at} className="ml-2">&middot; Diperbarui: {new Date(post.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
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

        <section className="mx-auto max-w-3xl" aria-label="Konten artikel">
          <TableOfContents body={post.body} />
          {post.is_premium ? (
            <>
              <MarkdownContent body={post.premium_excerpt || post.excerpt || ''} />
              <PremiumGate postId={post.id} excerpt={post.premium_excerpt || post.excerpt} />
            </>
          ) : (
            <MarkdownContent body={post.body} />
          )}
        </section>

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
  } catch (err) {
    console.error('ArticlePage error:', err);
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h1>
        <p className="text-muted-foreground mb-2">Gagal memuat artikel.</p>
        <p className="text-sm text-muted-foreground/60">{String(err)}</p>
      </div>
    );
  }
}
