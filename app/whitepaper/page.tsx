import type { Metadata } from 'next';
import { getPublishedWhitepapers } from '@/lib/db/queries/whitepapers';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ReportBadge } from '@/components/report-badge';
import { FileText, Clock, ArrowRight, BarChart3, Database } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TAM Report',
  description:
    'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
    title: 'TAM Report - Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAM Report - Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data, bukan opini.',
  },
};

export const revalidate = 60;

export default async function WhitepaperIndexPage() {
  const allReports = await getPublishedWhitepapers(100);

  const totalReadingTime = allReports.reduce((sum, w) => sum + (w.readingTime || 0), 0);
  const totalDataSources = allReports.reduce((sum, w) => sum + (w.dataSources?.length || 0), 0);
  const featuredReport = allReports[0] || null;
  const restReports = allReports.slice(1);

  return (
    <main className="bg-[#0A0A0A]">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM Report', href: '/whitepaper' },
      ]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0A0A0A]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(ellipse 80% 50% at 15% 0%, hsl(38 90% 55%) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 100%, hsl(38 90% 55% / 0.3) 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(hsl(38 90% 55%) 1px, transparent 1px), linear-gradient(90deg, hsl(38 90% 55%) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28 lg:py-36">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-amber-500/25 bg-amber-500/[0.07] px-4 py-1.5">
            <BarChart3 size={14} className="text-amber-400" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-400/90">Riset &amp; Analisis</span>
          </div>

          <h1 className="mb-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl lg:leading-[1.02]">
            TAM Report
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl">
            Laporan editorial berbasis data tentang generasi muda Indonesia. Bukan opini, bukan clickbait. Sumber yang bisa kamu verifikasi sendiri.
          </p>

          {allReports.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
              <div className="flex items-center gap-3">
                <FileText size={18} className="text-amber-500/60" />
                <div>
                  <div className="font-display text-2xl font-bold text-white">{allReports.length}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-white/30">Laporan</div>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-amber-500/60" />
                <div>
                  <div className="font-display text-2xl font-bold text-white">{totalReadingTime}m</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-white/30">Total Baca</div>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div className="flex items-center gap-3">
                <Database size={18} className="text-amber-500/60" />
                <div>
                  <div className="font-display text-2xl font-bold text-white">{totalDataSources}+</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-white/30">Sumber Data</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Report */}
      {featuredReport && (
        <section className="mx-auto max-w-6xl px-4 pb-8 md:pb-12">
          <Link
            href={`/whitepaper/${featuredReport.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-transparent p-8 transition-all hover:border-amber-500/25 md:p-12"
          >
            <div className="absolute left-0 top-0 h-full w-1 bg-amber-500/80" />

            <div className="grid gap-8 md:grid-cols-[1fr,auto] md:items-start">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  {featuredReport.reportCode && (
                    <ReportBadge reportCode={featuredReport.reportCode} reportYear={featuredReport.reportYear || undefined} size="md" />
                  )}
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/60">Latest</span>
                </div>

                <h2 className="mb-4 max-w-2xl font-display text-2xl font-bold leading-[1.15] text-white md:text-3xl lg:text-4xl lg:leading-[1.1]">
                  {featuredReport.title}
                </h2>

                {featuredReport.subtitle && (
                  <p className="mb-5 max-w-2xl text-base leading-relaxed text-white/50 md:text-lg">
                    {featuredReport.subtitle}
                  </p>
                )}

                {featuredReport.keyFindings && featuredReport.keyFindings.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {featuredReport.keyFindings.slice(0, 3).map((finding, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-white/40">
                        <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-amber-500/60" />
                        <span className="line-clamp-1">{finding}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-white/30">
                  {featuredReport.readingTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} />
                      {featuredReport.readingTime}m baca
                    </span>
                  )}
                  {featuredReport.publishedAt && (
                    <span>
                      {new Date(featuredReport.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              <div className="hidden flex-shrink-0 md:block">
                <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3 transition-all group-hover:border-amber-500/40 group-hover:bg-amber-500/10">
                  <span className="text-sm font-semibold text-amber-500">Baca laporan</span>
                  <ArrowRight size={16} className="text-amber-500 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* All Reports Grid */}
      {restReports.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-500/60">Semua Laporan</div>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Laporan Lainnya
              </h2>
            </div>
            <span className="font-mono text-sm text-white/30">{allReports.length} total</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restReports.map((wp) => (
              <Link
                key={wp.slug}
                href={`/whitepaper/${wp.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 transition-all hover:border-amber-500/20 hover:bg-white/[0.03]"
              >
                <div className="absolute left-0 top-0 h-full w-0.5 bg-amber-500/0 transition-all group-hover:bg-amber-500/40" />

                {wp.reportCode && (
                  <div className="mb-4">
                    <ReportBadge reportCode={wp.reportCode} reportYear={wp.reportYear || undefined} size="sm" />
                  </div>
                )}

                <h3 className="mb-3 font-display text-base font-bold leading-snug text-white transition-colors group-hover:text-amber-400 md:text-lg">
                  {wp.title}
                </h3>

                {wp.subtitle && (
                  <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/40">
                    {wp.subtitle}
                  </p>
                )}

                {wp.tags && wp.tags.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {wp.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3 pt-4 text-[11px] text-white/25">
                  {wp.readingTime && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={11} />
                      {wp.readingTime}m
                    </span>
                  )}
                  {wp.publishedAt && (
                    <span>
                      {new Date(wp.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  <ArrowRight size={14} className="ml-auto text-amber-500/0 transition-all group-hover:text-amber-500/70" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {allReports.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/15 bg-amber-500/[0.04]">
              <FileText size={28} className="text-amber-500/40" />
            </div>
            <p className="font-display text-lg text-white/40">TAM Report 2026 akan segera hadir.</p>
          </div>
        </section>
      )}
    </main>
  );
}
