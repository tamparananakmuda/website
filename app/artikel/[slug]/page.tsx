import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPostWithRelationsBySlug, getRelatedPosts } from '@/lib/db/queries/posts';
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
    const post = await getPublishedPostWithRelationsBySlug(params.slug);

    if (!post) {
      return { title: 'Artikel Tidak Ditemukan' };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
    const url = `${siteUrl}/artikel/${post.slug}`;

    return {
      title: post.seoMetaTitle || post.title,
      description: post.seoMetaDescription || post.excerpt || undefined,
      keywords: post.seoKeywords || undefined,
      robots: { index: true, follow: true },
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: 'article',
        locale: 'id_ID',
        url,
        title: post.seoMetaTitle || post.title,
        description: post.seoMetaDescription || post.excerpt || undefined,
        publishedTime: post.publishedAt || undefined,
        modifiedTime: post.updatedAt || undefined,
        images: post.ogImageUrl ? [{ url: post.ogImageUrl, width: 1600, height: 900 }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.seoMetaTitle || post.title,
        description: post.seoMetaDescription || post.excerpt || undefined,
        images: post.ogImageUrl ? [post.ogImageUrl] : undefined,
      },
    };
  } catch (err) {
    console.error('generateMetadata error:', err);
    return { title: 'Artikel' };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  try {
    const post = await getPublishedPostWithRelationsBySlug(params.slug);

    if (!post) {
      notFound();
    }

    const related = await getRelatedPosts(post.categoryId!, post.id, 3);

    return (
      <article className="container mx-auto px-4 py-12">
        <link rel="preload" as="image" href={post.ogFeatureUrl || post.ogImageUrl || `/api/og/feature?slug=${post.slug}`} fetchPriority="high" />
        <ArticleSchema
          title={post.title}
          description={post.excerpt || ''}
          slug={post.slug}
          publishedAt={post.publishedAt || post.createdAt || ''}
          modifiedAt={post.updatedAt || undefined}
          authorName={post.author?.name}
          authorBio={post.author?.bio || undefined}
          authorSlug={post.author?.slug || undefined}
          categoryTitle={post.category?.title}
          categorySlug={post.category?.slug}
          readingTime={post.readingTime || undefined}
          imageUrl={post.ogImageUrl || undefined}
          keywords={post.seoKeywords || undefined}
          isPremium={post.isPremium || undefined}
          isSponsored={post.isSponsored || undefined}
          sponsorName={post.sponsorName || undefined}
          citations={post.sourceReferences as { title?: string; url?: string }[] | undefined}
          wordCount={post.body?.split(/\s+/).length}
          humanReviewed={post.humanSignature || false}
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
          src={post.ogFeatureUrl || post.ogImageUrl || `/api/og/feature?slug=${post.slug}`}
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
            <span className="text-muted-foreground">{post.readingTime ?? 1} menit baca</span>
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
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="ml-2">&middot; {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                )}
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <time dateTime={post.updatedAt} className="ml-2">&middot; Diperbarui: {new Date(post.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                )}
              </div>
              <BookmarkButton postId={post.id} />
            </div>
          )}
        </header>

        {post.isSponsored && post.sponsorName && (
          <div className="mx-auto max-w-3xl mb-6">
            <SponsoredBadge
              sponsorName={post.sponsorName}
              sponsorUrl={post.sponsorUrl || undefined}
              disclosure={post.sponsorDisclosure || undefined}
            />
          </div>
        )}

        <section className="mx-auto max-w-3xl" aria-label="Konten artikel">
          <TableOfContents body={post.body} />
          {post.isPremium ? (
            <>
              <MarkdownContent body={post.premiumExcerpt || post.excerpt || ''} />
              <PremiumGate postId={post.id} excerpt={post.premiumExcerpt || post.excerpt || ''} />
            </>
          ) : (
            <MarkdownContent body={post.body} />
          )}
        </section>

        <div className="mx-auto max-w-3xl mt-8 pt-6 border-t border-border">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {!post.isSponsored && <DonationCTA />}

        {related && related.length > 0 && (
          <RelatedArticles articles={related.map((r) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            excerpt: r.excerpt,
            coverImageUrl: r.coverImageUrl,
            readingTime: r.readingTime ?? 1,
            category: r.category ? { title: r.category.title, slug: r.category.slug, color: r.category.color } : null,
          }))} />
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
