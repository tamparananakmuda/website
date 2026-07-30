import { series as seriesConfig, getSeriesBySlug, getAuthorById, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ItemListSchema } from '@/components/schema/item-list-schema';
import { ArrowRight, ArrowLeft, Clock, Layers, CalendarClock, Sparkles } from 'lucide-react';
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
  const title = `${series.title} - Seri - Tamparan Anak Muda`;
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
        title,
        description,
        siteName: 'TAMPARAN ANAK MUDA',
        images: [{ url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp', width: 1600, height: 900, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
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
        title,
        description,
        siteName: 'TAMPARAN ANAK MUDA',
        images: [{ url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp', width: 1600, height: 900, alt: title }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
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
    'https://cdn.tamparananakmuda.com/og/homepage-feature.webp';

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
      title,
      description,
      siteName: 'TAMPARAN ANAK MUDA',
      images: [{ url: ogImageUrl, width: 1600, height: 900, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
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
      <main>
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'Seri', href: '/seri' },
          { name: series.title, href: `/seri/${series.slug}` },
        ]} />

        <section className="relative w-full overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage: 'radial-gradient(circle at 25% 15%, hsl(0 63% 52%) 0%, transparent 50%), radial-gradient(circle at 85% 85%, hsl(0 63% 52% / 0.3) 0%, transparent 40%)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
            <Link
              href="/seri"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowLeft size={15} />
              Semua Seri
            </Link>

            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <CalendarClock size={13} />
                Coming Soon
              </span>
              {series.expectedParts && (
                <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/40">
                  <Layers size={13} />
                  ~{series.expectedParts} bagian
                </span>
              )}
            </div>

            <h1 className="mb-6 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
              {series.title}
            </h1>

            {series.description && (
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                {series.description}
              </p>
            )}

            {series.teaser && (
              <p className="mb-8 max-w-2xl rounded-xl border border-primary/20 bg-primary/5 px-6 py-4 text-lg font-medium italic text-primary/90">
                &ldquo;{series.teaser}&rdquo;
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
              {series.expectedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock size={15} />
                  Rilis {formatExpectedDate(series.expectedDate)}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={15} />
                Seri sedang dalam penulisan
              </span>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <p className="text-lg font-medium text-foreground">
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
      <main>
        <BreadcrumbSchema items={[
          { name: 'Home', href: '/' },
          { name: 'Seri', href: '/seri' },
          { name: series.title, href: `/seri/${series.slug}` },
        ]} />

        <section className="relative w-full overflow-hidden border-b border-border">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
          </div>

          <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
            <Link
              href="/seri"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowLeft size={15} />
              Semua Seri
            </Link>

            <h1 className="mb-6 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
              {series.title}
            </h1>

            {series.description && (
              <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
                {series.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/40">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={15} />
                Seri sedang dalam penulisan
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <p className="text-lg font-medium text-foreground">
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

  // Get coming-soon series (excluding current series)
  const comingSoonList = seriesConfig.filter(
    (s) => s.status === 'coming-soon' && s.slug !== series.slug
  );

  return (
    <main>
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

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 15%, ${categoryColor} 0%, transparent 50%), radial-gradient(circle at 85% 85%, ${categoryColor}66 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
          <Link
            href="/seri"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={15} />
            Semua Seri
          </Link>

          {category && (
            <div className="mb-6 flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
                style={{ backgroundColor: categoryColor }}
              >
                {category.title}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/40">
                <Layers size={13} />
                Seri Investigasi
              </span>
            </div>
          )}

          <h1 className="mb-6 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            {series.title}
          </h1>

          {series.description && (
            <p className="mb-8 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              {series.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
            <span className="inline-flex items-center gap-1.5">
              <Layers size={15} />
              {posts.length} bagian
            </span>
            {author && (
              <span className="inline-flex items-center gap-1.5">
                oleh <span className="font-medium text-white/70">{author.name}</span>
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
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-foreground">
            Daftar Bagian
          </h2>
          <span className="text-sm text-muted-foreground">
            {posts.length} artikel
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
                  className="group relative flex items-start gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-foreground/20 hover:shadow-md md:gap-5 md:p-5"
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
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center md:p-12">
          <p className="text-sm text-muted-foreground">
            Baca dari awal untuk memahami alur argumentasi secara utuh.
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

      {/* Coming Soon Series */}
      {comingSoonList.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 pb-16 md:pb-24">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Seri Berikutnya
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {comingSoonList.map((item) => (
              <Link
                key={item.id}
                href={`/seri/${item.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-card/50 p-6 transition-all hover:border-primary/30 md:p-8"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <CalendarClock size={12} />
                    Coming Soon
                  </span>
                  {item.expectedParts && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Layers size={13} />
                      ~{item.expectedParts} bagian
                    </span>
                  )}
                </div>

                <h3 className="mb-3 font-display text-xl font-bold leading-snug text-foreground/90 md:text-2xl">
                  {item.title}
                </h3>

                {item.description && (
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}

                {item.teaser && (
                  <p className="mb-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium italic text-primary/90">
                    &ldquo;{item.teaser}&rdquo;
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  {item.expectedDate && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CalendarClock size={14} />
                      Rilis {formatExpectedDate(item.expectedDate)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                    Lihat detail
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
