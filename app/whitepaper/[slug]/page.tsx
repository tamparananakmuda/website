import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPublishedWhitepaperBySlug, getRelatedWhitepapers } from '@/lib/db/queries/whitepapers';
import { TableOfContents } from '@/components/table-of-contents';
import { WhitepaperContent } from '@/components/charts/whitepaper-content';
import { ShareButtons } from '@/components/share-buttons';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArticleSchema } from '@/components/schema/article-schema';
import { FileText, Clock, Download, ArrowLeft, ArrowRight, BarChart3 } from 'lucide-react';
import { ReportBadge } from '@/components/report-badge';
import { KeyFindings } from '@/components/key-findings';
import { DataSources } from '@/components/data-sources';
import { ReadingProgress } from '@/components/whitepaper/reading-progress';

interface WhitepaperPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: WhitepaperPageProps): Promise<Metadata> {
  const wp = await getPublishedWhitepaperBySlug(params.slug);

  if (!wp) {
    return { title: 'Whitepaper Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/whitepaper/${wp.slug}`;

  return {
    title: wp.title,
    description: wp.summary || wp.subtitle || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title: wp.title,
      description: wp.summary || wp.subtitle || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: wp.title,
      description: wp.summary || wp.subtitle || undefined,
    },
  };
}

export default async function WhitepaperDetailPage({ params }: WhitepaperPageProps) {
  const wp = await getPublishedWhitepaperBySlug(params.slug);

  if (!wp) {
    notFound();
  }

  const related = await getRelatedWhitepapers(wp.slug, 3);

  return (
    <article>
      <ReadingProgress />
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Whitepaper', href: '/whitepaper' },
          { name: wp.title, href: `/whitepaper/${wp.slug}` },
        ]}
      />
      <ArticleSchema
        title={wp.title}
        description={wp.summary || wp.subtitle || ''}
        slug={wp.slug}
        publishedAt={wp.publishedAt || new Date().toISOString()}
        authorName={wp.author || undefined}
        readingTime={wp.readingTime || undefined}
        keywords={wp.tags || undefined}
        urlPrefix="whitepaper"
      />

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0C0A08] via-[#0A0A0A] to-[#141210]" />
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: 'radial-gradient(ellipse at 20% 0%, hsl(38 90% 55%) 0%, transparent 55%), radial-gradient(ellipse at 90% 100%, hsl(38 90% 55% / 0.25) 0%, transparent 45%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(hsl(38 90% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 90% 55%) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
          {/* Back link */}
          <Link
            href="/whitepaper"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={15} />
            {wp.isAnnualReport ? 'Semua TAM Report' : 'Semua Whitepaper'}
          </Link>

          {/* Badges */}
          <div className="mb-6 flex items-center gap-2">
            {wp.isAnnualReport && wp.reportCode ? (
              <ReportBadge reportCode={wp.reportCode} reportYear={wp.reportYear || undefined} size="md" />
            ) : (
              <span className="inline-flex items-center rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400/80">
                <BarChart3 size={12} className="mr-1" />
                Whitepaper
              </span>
            )}
            {wp.readingTime && (
              <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-white/40">
                <Clock size={13} />
                {wp.readingTime} menit baca
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="mb-4 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            {wp.title}
          </h1>

          {/* Subtitle */}
          {wp.subtitle && (
            <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
              {wp.subtitle}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
            <span className="font-medium text-white/70">{wp.author}</span>
            {wp.publishedAt && (
              <span>
                {new Date(wp.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            )}
            {wp.downloadUrl && (
              <a
                href={wp.downloadUrl}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold text-amber-950 transition-colors hover:bg-amber-400"
              >
                <Download size={14} />
                Download PDF
              </a>
            )}
          </div>

          {/* Tags */}
          {wp.tags && wp.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {wp.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/60"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Key Findings box */}
      <section className="mx-auto max-w-3xl px-4 pt-12 md:pt-16">
        <KeyFindings findings={wp.keyFindings} summary={wp.summary} />
      </section>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
        <TableOfContents body={wp.body} />
        <WhitepaperContent body={wp.body} />
      </div>

      {/* Share */}
      <div className="mx-auto max-w-3xl px-4 pb-8">
        <div className="border-t border-border pt-6">
          <ShareButtons title={wp.title} slug={wp.slug} />
        </div>
      </div>

      {/* Data Sources */}
      <div className="mx-auto max-w-3xl px-4">
        <DataSources sources={wp.dataSources} />
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <h2 className="mb-8 font-display text-xl font-bold text-foreground">
            {wp.isAnnualReport ? 'TAM Report lainnya' : 'Whitepaper lainnya'}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/whitepaper/${r.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-amber-500/30 hover:shadow-md"
              >
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center gap-2">
                    {r.isAnnualReport && r.reportCode ? (
                      <ReportBadge reportCode={r.reportCode} reportYear={r.reportYear || undefined} size="sm" />
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-amber-500/15 bg-amber-500/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-600">
                        <FileText size={10} className="mr-1" />
                        Whitepaper
                      </span>
                    )}
                    {r.readingTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {r.readingTime} min
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-display text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-amber-600 line-clamp-2">
                    {r.title}
                  </h3>
                  {r.summary && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {r.summary}
                    </p>
                  )}
                  <div className="mt-auto pt-4">
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600 transition-all group-hover:gap-2">
                      Baca laporan
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
