import { series as seriesConfig, getSeriesBySlug, getAuthorById, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowRight, ArrowLeft, Clock, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return seriesConfig.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};

  const posts = await getPostsBySeries(series.slug, 100);
  const title = `${series.title} - Seri - Tamparan Anak Muda`;
  const description = series.description || `Seri ${posts.length} bagian dari TAMPARAN ANAK MUDA.`;

  return {
    title,
    description,
    keywords: ['seri', series.title.toLowerCase(), 'tamparan anak muda seri'],
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri/${series.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri/${series.slug}`,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function estimateReadingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function SeriesDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const posts = await getPostsBySeries(series.slug, 100);

  if (posts.length === 0) {
    notFound();
  }

  const author = posts[0].authorId ? getAuthorById(posts[0].authorId) : null;
  const category = posts[0].categoryId ? getCategoryById(posts[0].categoryId) : null;
  const categoryColor = category?.color || '#D13A3A';
  const totalReadingTime = posts.reduce((sum, p) => sum + estimateReadingTime(p.body), 0);

  return (
    <main>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Seri', href: '/seri' },
        { name: series.title, href: `/seri/${series.slug}` },
      ]} />

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
    </main>
  );
}
