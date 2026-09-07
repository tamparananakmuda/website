import { series as seriesConfig, getSeriesBySlug, getAuthorById, getCategoryById } from '@/content/config';
import { getPostsBySeries, getAllArticles } from '@/lib/articles/loader';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ItemListSchema } from '@/components/schema/item-list-schema';
import { ArrowRight, ArrowLeft, Clock, Layers, CalendarClock } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Only pre-generate series that have published articles OR are coming-soon
  return seriesConfig.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};

  const posts = await getPostsBySeries(series.slug, 100);
  const title = `Seri ${series.title}`;
  const description = series.description || `Seri ${posts.length} bagian dari TAMPARAN ANAK MUDA.`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/seri/${series.slug}`;

  // Coming-soon series with no articles: noindex
  if (posts.length === 0 && series.status === 'coming-soon') {
    return {
      title,
      description,
      keywords: ['seri', series.title.toLowerCase(), 'tamparan anak muda seri', 'coming soon'],
      robots: { index: false, follow: true },
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        locale: 'id_ID',
        url,
        title: `${title} - Tamparan Anak Muda`,
        description,
        siteName: 'TAMPARAN ANAK MUDA',
        images: [{ url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp', width: 1600, height: 900, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Tamparan Anak Muda`,
        description,
        images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
      },
    };
  }

  // Series with no published posts and not coming-soon (all scheduled): noindex
  if (posts.length === 0) {
    return {
      title,
      description,
      keywords: ['seri', series.title.toLowerCase(), 'tamparan anak muda seri'],
      robots: { index: false, follow: true },
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        locale: 'id_ID',
        url,
        title: `${title} - Tamparan Anak Muda`,
        description,
        siteName: 'TAMPARAN ANAK MUDA',
        images: [{ url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp', width: 1600, height: 900, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} - Tamparan Anak Muda`,
        description,
        images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
      },
    };
  }

  // Published series: indexable, use first post's OG
  const firstPost = posts[0];
  const ogImageUrl =
    (firstPost as { ogFeatureUrl?: string; ogImageUrl?: string })?.ogFeatureUrl ||
    (firstPost as { ogFeatureUrl?: string; ogImageUrl?: string })?.ogImageUrl ||
    (firstPost ? `/api/og/card?slug=${firstPost.slug}` : 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp');

  return {
    title,
    description,
    keywords: ['seri', series.title.toLowerCase(), 'tamparan anak muda seri'],
    robots: { index: true, follow: true },
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: `${title} - Tamparan Anak Muda`,
      description,
      siteName: 'TAMPARAN ANAK MUDA',
      images: [{ url: ogImageUrl, width: 1600, height: 900, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Tamparan Anak Muda`,
      description,
      images: [ogImageUrl],
    },
  };
}

function estimateReadingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatExpectedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const posts = await getPostsBySeries(series.slug, 100);

  // Coming-soon series: show teaser page instead of 404
  if (posts.length === 0 && series.status === 'coming-soon') {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'Seri', href: '/seri' },
          { name: series.title, href: `/seri/${series.slug}` },
        ]} />

        <section className="relative w-full overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 via-background to-background">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div
              className="absolute inset-0 opacity-[0.08] dark:opacity-[0.15]"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 15%, hsl(0 63% 52%) 0%, transparent 50%), radial-gradient(circle at 85% 85%, hsl(0 63% 52% / 0.3) 0%, transparent 40%)',
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
            <Link
              href="/seri"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Semua Seri
            </Link>

            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <CalendarClock size={13} />
                Coming Soon
              </span>
              {series.expectedParts && (
                <span className="inline-flex items-center gap-1 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                  <Layers size={13} />
                  ~{series.expectedParts} bagian
                </span>
              )}
            </div>

            <h1 className="mb-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {series.title}
            </h1>

            {series.description && (
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {series.description}
              </p>
            )}

            {series.teaser && (
              <p className="mb-8 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 text-base font-medium italic text-primary">
                &ldquo;{series.teaser}&rdquo;
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {series.expectedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock size={15} />
                  Rilis {formatExpectedDate(series.expectedDate)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock size={15} />
                Seri sedang dalam riset &amp; penulisan
              </span>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12 shadow-sm">
            <p className="text-lg font-bold text-foreground">
              Mau jadi yang pertama tahu saat seri ini rilis?
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Subscribe newsletter TAM. Kami kirim notifikasi saat bagian pertama dipublikasikan.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe Newsletter
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Series with no published posts but not marked coming-soon (all scheduled)
  if (posts.length === 0) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'Seri', href: '/seri' },
          { name: series.title, href: `/seri/${series.slug}` },
        ]} />

        <section className="relative w-full overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 via-background to-background">
          <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
            <Link
              href="/seri"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft size={15} />
              Semua Seri
            </Link>

            <h1 className="mb-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {series.title}
            </h1>

            {series.description && (
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock size={15} />
                Seri sedang dalam penulisan
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12 shadow-sm">
            <p className="text-lg font-bold text-foreground">
              Mau jadi yang pertama tahu saat seri ini rilis?
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              Subscribe newsletter TAM. Kami kirim notifikasi saat bagian pertama dipublikasikan.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe Newsletter
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const author = posts[0].authorId ? getAuthorById(posts[0].authorId) : null;
  const category = posts[0].categoryId ? getCategoryById(posts[0].categoryId) : null;
  const categoryColor = category?.color || '#D13A3A';
  const totalReadingTime = posts.reduce((sum, p) => sum + estimateReadingTime(p.body), 0);

  // Get upcoming (scheduled, not yet published) parts from this series
  const currentTime = new Date().toISOString();
  const allArticles = await getAllArticles();
  const upcomingParts = allArticles
    .filter((a) => a.seriesSlug === series.slug && a.status === 'scheduled' && a.publishedAt > currentTime)
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime())
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      seriesOrder: a.seriesOrder,
      publishedAt: a.publishedAt,
    }));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Seri', href: '/seri' },
        { name: series.title, href: `/seri/${series.slug}` },
      ]} />
      <ItemListSchema
        name={series.title}
        description={series.description || undefined}
        items={posts.map((p, i) => ({
          position: i + 1,
          name: p.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/artikel/${p.slug}`,
          description: p.excerpt || undefined,
        }))}
      />

      {/* Hero Section - Fully theme adaptive */}
      <section className="relative w-full overflow-hidden border-b border-border bg-gradient-to-b from-muted/60 via-background to-background">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.07] dark:opacity-[0.14]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 15%, ${categoryColor} 0%, transparent 50%), radial-gradient(circle at 85% 85%, ${categoryColor}66 0%, transparent 40%)`,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-16 md:py-24">
          <Link
            href="/seri"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={15} />
            Semua Seri
          </Link>

          {category && (
            <div className="mb-6 flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: categoryColor }}
              >
                {category.title}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-medium uppercase tracking-wider text-muted-foreground">
                <Layers size={13} />
                Seri Investigasi
              </span>
            </div>
          )}

          <h1 className="mb-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {series.title}
          </h1>

          {series.description && (
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {series.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Layers size={15} />
              {posts.length} bagian
            </span>
            {author && (
              <span className="inline-flex items-center gap-1.5">
                oleh <span className="font-medium text-foreground">{author.name}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} />
              ~{totalReadingTime} menit total
            </span>
          </div>
        </div>
      </section>

      {/* Parts List */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            Daftar Bab &amp; Pembahasan
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            {posts.length} artikel terbit
          </span>
        </div>

        {/* Timeline-style list */}
        <div className="relative">
          <div
            className="absolute left-[27px] top-2 bottom-2 w-px md:left-[31px]"
            style={{ backgroundColor: `${categoryColor}30` }}
          />

          <div className="space-y-3">
            {posts.map((post, idx) => {
              const order = post.seriesOrder || idx + 1;
              const readingTime = estimateReadingTime(post.body);
              const isFirst = idx === 0;

              return (
                <Link
                  key={post.slug}
                  href={`/artikel/${post.slug}`}
                  className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-md md:gap-5 md:p-5"
                >
                  <div
                    className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 bg-background font-display text-lg font-bold transition-colors md:h-16 md:w-16 md:text-xl"
                    style={{
                      borderColor: isFirst ? categoryColor : `${categoryColor}40`,
                      color: isFirst ? categoryColor : `${categoryColor}80`,
                    }}
                  >
                    {String(order).padStart(2, '0')}
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <h3 className="mb-1.5 font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary md:text-lg">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        {readingTime} min
                      </span>
                      {isFirst && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                          style={{ backgroundColor: categoryColor }}
                        >
                          Mulai di sini
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-center text-muted-foreground/30 transition-all group-hover:translate-x-1 group-hover:text-primary">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              );
            })}

            {/* Upcoming scheduled parts in same timeline */}
            {upcomingParts.map((part) => {
              const order = part.seriesOrder || posts.length + 1;
              return (
                <div
                  key={part.slug}
                  className="group relative flex items-start gap-4 rounded-xl border border-dashed border-border bg-card/50 p-4 md:gap-5 md:p-5"
                >
                  <div className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-background md:h-16 md:w-16">
                    <span className="font-display text-lg font-bold text-primary/40 md:text-xl">
                      {String(order).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 pt-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        <CalendarClock size={11} />
                        Coming Soon
                      </span>
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Bagian {order} dari {posts.length + upcomingParts.length}
                      </span>
                    </div>
                    <h3 className="mb-1.5 font-display text-base font-semibold leading-snug text-foreground/80 md:text-lg">
                      {part.title}
                    </h3>
                    {part.excerpt && (
                      <p className="mb-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {part.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground/70">
                      <span className="inline-flex items-center gap-1">
                        <CalendarClock size={12} />
                        Rilis {formatExpectedDate(part.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12 shadow-sm">
          <p className="text-sm font-medium text-foreground">
            Disarankan membaca dari bab pertama untuk memahami alur argumentasi dan investigasi secara menyeluruh.
          </p>
          <Link
            href={`/artikel/${posts[0].slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Mulai dari Part 1
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
