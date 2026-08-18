import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedPostWithRelationsBySlug, getRelatedPosts } from '@/lib/db/queries/posts';
import { getAllArticles, getAllArticlesUncached, getPostBySlug } from '@/lib/articles/loader';
import { MarkdownContent } from '@/components/markdown-content';
import { ReadingProgress } from '@/components/whitepaper/reading-progress';
import { FeatureImage } from '@/components/feature-image';
import { ArticleSchema } from '@/components/schema/article-schema';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { AuthorSchema } from '@/components/schema/author-schema';
import { FAQSchema } from '@/components/schema/faq-schema';
import { SponsoredBadge } from '@/components/sponsored-badge';
import { DonationCTA } from '@/components/donation-cta';
import { TableOfContents } from '@/components/table-of-contents';
import { RelatedArticles } from '@/components/related-articles';
import { SeriesNavigation } from '@/components/series-navigation';
import { Breadcrumb } from '@/components/breadcrumb';
import { SourceReferences, type SourceReferenceItem } from '@/components/source-references';
import { ArticleSummary } from '@/components/article-summary';
import { ArticleEndCTA } from '@/components/article-end-cta';
import { NewsletterInline } from '@/components/newsletter-inline';
import { ReadAlso } from '@/components/read-also';
import { CommentsSection, ReadingTracker, PremiumGate, ShareButtons } from '@/components/article-dynamic';
import { BookmarkButton } from '@/components/bookmark-button';
import { CalendarClock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function extractFAQFromBody(body: string): { question: string; answer: string }[] {
  const faqSection = body.match(/^##\s+FAQ\s*$/m);
  if (!faqSection) return [];
  const faqStart = faqSection.index! + faqSection[0].length;
  const remaining = body.slice(faqStart);
  const nextH2 = remaining.match(/^##\s+/m);
  const faqContent = nextH2 ? remaining.slice(0, nextH2.index) : remaining;
  const faqItems: { question: string; answer: string }[] = [];
  const blocks = faqContent.split(/^###\s+/m).filter(s => s.trim());
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    const question = lines[0].replace(/\?\s*$/, '').trim() + '?';
    const answer = lines.slice(1).join('\n').trim().replace(/\n\n+/g, ' ');
    if (question && answer) faqItems.push({ question, answer });
  }
  return faqItems;
}

interface ArticlePageProps {
  params: { slug: string };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = getAllArticlesUncached();
  return articles
    .filter((a) => a.status === 'published' || a.status === 'scheduled')
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  try {
    const post = await getPublishedPostWithRelationsBySlug(params.slug);

    if (!post) {
      // Check if scheduled for SEO noindex
      const scheduledPost = await getPostBySlug(params.slug);
      if (scheduledPost && scheduledPost.status === 'scheduled') {
        return {
          title: `${scheduledPost.title} - Segera Hadir`,
          description: scheduledPost.excerpt || 'Artikel ini belum tersedia.',
          robots: { index: false, follow: false },
        };
      }
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
        authors: post.author?.name ? [post.author.name] : undefined,
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
      // Check if article exists but is scheduled (not yet published)
      const scheduledPost = await getPostBySlug(params.slug);
      if (scheduledPost && scheduledPost.status === 'scheduled' && scheduledPost.publishedAt) {
        const releaseDate = new Date(scheduledPost.publishedAt);
        const now = new Date();
        const isFuture = releaseDate > now;

        if (isFuture) {
          // Find series info if applicable
          const allArticles = await getAllArticles();
          const seriesArticle = allArticles.find((a) => a.slug === params.slug);
          const seriesSlug = seriesArticle?.seriesSlug;
          const seriesOrder = seriesArticle?.seriesOrder;

          let seriesLink: React.ReactNode = null;
          if (seriesSlug) {
            seriesLink = (
              <Link
                href={`/seri/${seriesSlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
              >
                <ArrowLeft size={14} />
                Kembali ke seri
              </Link>
            );
          }

          return (
            <div className="container mx-auto px-4 py-20">
              <div className="mx-auto max-w-2xl text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-primary/5">
                  <CalendarClock size={28} className="text-primary/60" />
                </div>
                <h1 className="mb-3 font-display text-2xl font-bold md:text-3xl">
                  {scheduledPost.title}
                </h1>
                <p className="mb-2 text-lg text-muted-foreground">
                  Artikel ini belum tersedia.
                </p>
                <p className="mb-8 text-muted-foreground">
                  Akan rilis pada{' '}
                  <span className="font-semibold text-foreground">
                    {releaseDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </p>
                {scheduledPost.excerpt && (
                  <p className="mb-8 rounded-xl border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-muted-foreground">
                    {scheduledPost.excerpt}
                  </p>
                )}
                {seriesLink}
              </div>
            </div>
          );
        }
      }
      notFound();
    }

    const related = await getRelatedPosts(post.category?.slug || post.categoryId!, post.slug, 3);

    // Fetch series parts for navigation
    let seriesNav: React.ReactNode = null;
    if (post.series && post.series.slug && post.seriesOrder) {
      const allArticles = await getAllArticles();
      const seriesParts = allArticles
        .filter((a) => a.seriesSlug === post.series!.slug)
        .map((a) => ({
          slug: a.slug,
          title: a.title,
          seriesOrder: a.seriesOrder,
          status: a.status,
          publishedAt: a.publishedAt,
        }));
      const totalParts = seriesParts.length;
      seriesNav = (
        <SeriesNavigation
          seriesSlug={post.series.slug}
          seriesTitle={post.series.title}
          currentOrder={post.seriesOrder}
          totalParts={totalParts}
          allParts={seriesParts}
        />
      );
    }

    return (
      <article className="container mx-auto px-4 py-12">
        <ReadingProgress />
        <link
          rel="preload"
          as="image"
          href={post.ogFeatureUrl || post.ogImageUrl || `/api/og/feature?slug=${post.slug}`}
          imageSrcSet={`${post.ogFeatureUrl || post.ogImageUrl || `/api/og/feature?slug=${post.slug}`} 1x`}
          imageSizes="(max-width: 1200px) 100vw, 1024px"
          fetchPriority="high"
        />
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
          citations={post.sourceReferences as { title?: string; url?: string; label?: string }[] | undefined}
          wordCount={post.body?.split(/\s+/).length}
          humanReviewed={post.humanSignature || false}
        />
        {post.author && post.author.name && post.author.name !== 'TAMPARAN ANAK MUDA' && (
          <AuthorSchema
            name={post.author.name}
            bio={post.author.bio || undefined}
            slug={post.author.slug || undefined}
            jobTitle={(post.author as { jobTitle?: string | null }).jobTitle || undefined}
            socialLinks={{
              instagram: post.author.socialInstagram || undefined,
              twitter: post.author.socialTwitter || undefined,
              linkedin: post.author.socialLinkedin || undefined,
              website: (post.author as { socialWebsite?: string | null }).socialWebsite || undefined,
            }}
          />
        )}
        {(() => {
          const faqItems = post.body ? extractFAQFromBody(post.body) : [];
          const items = faqItems.length > 0
            ? faqItems
            : post.excerpt
              ? [{ question: `Apa inti dari ${post.title}?`, answer: post.excerpt }]
              : [];
          return items.length > 0 ? <FAQSchema items={items} /> : null;
        })()}
        <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Artikel', href: '/artikel' }, { name: post.title, href: `/artikel/${post.slug}` }]} />

        {/* Visual breadcrumb */}
        <Breadcrumb
          items={[
            { name: 'Beranda', href: '/' },
            ...(post.category ? [{ name: post.category.title, href: `/kategori/${post.category.slug}` }] : []),
            { name: post.title, href: `/artikel/${post.slug}` },
          ]}
        />

        {/* Feature image */}
        <FeatureImage
          src={post.ogFeatureUrl || post.ogImageUrl || `/api/og/feature?slug=${post.slug}`}
          alt={post.coverImageAlt || post.title}
          fallbackSrc={`/api/og/feature?slug=${post.slug}`}
        />

        <header className="mx-auto max-w-3xl" data-article-slug={post.slug} data-category={post.category?.slug}>
          <div className="mb-4 flex items-center gap-2 text-sm">
            {post.category && (
              <Link
                href={`/kategori/${post.category.slug}`}
                className="font-medium transition-opacity hover:opacity-70"
                style={{ color: post.category.color }}
              >
                {post.category.title}
              </Link>
            )}
            <span className="text-muted-foreground">&bull;</span>
            <span className="text-muted-foreground">{post.readingTime ?? 1} menit baca</span>
          </div>
          <h1 className="mb-10 text-3xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mb-8 text-lg text-muted-foreground" data-testid="article-excerpt">{post.excerpt}</p>
          )}
          {post.author && (
            <div className="mb-8 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Ditulis oleh{' '}
                {post.author.slug && post.author.name !== 'TAMPARAN ANAK MUDA' ? (
                  <Link href={`/penulis/${post.author.slug}`} className="font-medium text-foreground transition-colors hover:text-primary">
                    {post.author.name}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">{post.author.name}</span>
                )}
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="ml-2">&middot; {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                )}
                {post.updatedAt && post.updatedAt !== post.publishedAt && (
                  <time dateTime={post.updatedAt} className="ml-2">&middot; Diperbarui: {new Date(post.updatedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                )}
              </div>
              <BookmarkButton postSlug={post.slug} />
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

        {(() => {
          const summary = post.summary;
          if (!summary || !Array.isArray(summary) || (summary as string[]).length === 0) return null;
          return (
            <div className="mx-auto max-w-3xl">
              <ArticleSummary items={summary as string[]} />
            </div>
          );
        })()}

        <section className="mx-auto max-w-3xl" aria-label="Konten artikel">
          <TableOfContents body={post.body} />
          {post.isPremium ? (
            <>
              <MarkdownContent body={post.premiumExcerpt || post.excerpt || ''} />
              <PremiumGate postSlug={post.slug} excerpt={post.premiumExcerpt || post.excerpt || ''} />
            </>
          ) : (
            <MarkdownContent body={post.body} />
          )}
        </section>

        <div className="mx-auto max-w-3xl mt-8 pt-6 border-t border-border">
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        <NewsletterInline />

        {!post.isSponsored && <DonationCTA />}

        {(() => {
          const refs = post.sourceReferences;
          if (!refs || !Array.isArray(refs) || refs.length === 0) return null;
          return <SourceReferences sources={refs as SourceReferenceItem[] | string[]} />;
        })()}

        {related && related.length > 0 && (
          <div className="mx-auto max-w-3xl">
            <ReadAlso articles={related.slice(0, 3).map((r) => ({
              slug: r.slug,
              title: r.title,
              category: r.category ? { title: r.category.title, slug: r.category.slug, color: r.category.color } : null,
            }))} />
          </div>
        )}

        {related && related.length > 0 && (
          <RelatedArticles articles={related.map((r) => ({
            id: r.id,
            title: r.title,
            slug: r.slug,
            excerpt: r.excerpt,
            coverImageUrl: r.coverImageUrl,
            ogCardUrl: r.ogCardUrl,
            readingTime: r.readingTime ?? 1,
            category: r.category ? { title: r.category.title, slug: r.category.slug, color: r.category.color } : null,
          }))} />
        )}

        <ArticleEndCTA
          nextArticle={related && related.length > 0 ? {
            slug: related[0].slug,
            title: related[0].title,
            excerpt: related[0].excerpt,
            category: related[0].category ? { title: related[0].category.title, slug: related[0].category.slug, color: related[0].category.color } : null,
          } : null}
          categoryLink={post.category ? { title: post.category.title, slug: post.category.slug } : null}
        />

        <CommentsSection postSlug={post.slug} />

        {seriesNav}

        <ReadingTracker postSlug={post.slug} />
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
