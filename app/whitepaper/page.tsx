import type { Metadata } from 'next';
import { getAnnualReports, getStandaloneWhitepapers } from '@/lib/db/queries/whitepapers';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ReportBadge } from '@/components/report-badge';
import { FileText, Clock, ArrowRight, BarChart3 } from 'lucide-react';
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
  const [annualReports, standaloneWps] = await Promise.all([
    getAnnualReports(),
    getStandaloneWhitepapers(),
  ]);

  const publishedCount = annualReports.filter((w) => w.status === 'published').length;

  return (
    <main>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM Report', href: '/whitepaper' },
      ]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0C0A08] via-[#0A0A0A] to-[#141210]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1">
            <BarChart3 size={14} className="text-amber-400" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80">Riset &amp; Analisis</span>
          </div>
          <h1 className="mb-6 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            TAM Report
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Laporan editorial berbasis data tentang generasi muda Indonesia. Bukan opini, bukan clickbait. Sumber yang bisa kamu verifikasi sendiri.
          </p>
          {annualReports.length > 0 && (
            <div className="mt-6 flex items-center gap-3 text-sm text-white/40">
              <span className="font-mono font-medium text-amber-500/80">{publishedCount} Laporan</span>
              <span className="text-white/20">·</span>
              <span className="font-mono font-medium text-amber-500/80">2026 Edition</span>
            </div>
          )}
        </div>
      </section>

      {/* TAM Report Annual Section */}
      {annualReports.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              TAM Report 2026
            </h2>
            <span className="text-sm text-muted-foreground">{annualReports.length} laporan</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {annualReports.map((wp) => (
              <Link
                key={wp.slug}
                href={`/whitepaper/${wp.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-amber-500/30 hover:shadow-md md:p-6"
              >
                {wp.reportCode && (
                  <div className="mb-3">
                    <ReportBadge reportCode={wp.reportCode} reportYear={wp.reportYear || undefined} size="sm" />
                  </div>
                )}

                <h3 className="mb-2 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-amber-600 md:text-xl">
                  {wp.title}
                </h3>

                {wp.subtitle && (
                  <p className="mb-3 line-clamp-2 text-sm font-medium text-muted-foreground">
                    {wp.subtitle}
                  </p>
                )}

                {wp.tags && wp.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {wp.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground/60">
                  {wp.readingTime && (
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} />
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
                  <span className="ml-auto inline-flex items-center gap-1 font-semibold text-amber-600 opacity-0 transition-all group-hover:opacity-100">
                    Baca laporan
                    <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Standalone Whitepapers Section */}
      {standaloneWps.length > 0 && (
        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Whitepaper Lainnya
            </h2>
          </div>

          <div className="space-y-4">
            {standaloneWps.map((wp) => (
              <Link
                key={wp.slug}
                href={`/whitepaper/${wp.slug}`}
                className="group relative flex gap-5 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-amber-500/30 hover:shadow-md md:p-7"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-20 w-16 flex-col items-center justify-center rounded-lg border border-amber-500/15 bg-amber-500/5 transition-colors group-hover:border-amber-500/30 group-hover:bg-amber-500/10">
                    <FileText size={24} className="text-amber-500/70 transition-colors group-hover:text-amber-500" />
                    {wp.readingTime && (
                      <span className="mt-1.5 text-[10px] font-medium text-amber-500/50">
                        {wp.readingTime}m
                      </span>
                    )}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  {wp.tags && wp.tags.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      {wp.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h3 className="mb-2 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-amber-600 md:text-xl">
                    {wp.title}
                  </h3>

                  {wp.subtitle && (
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      {wp.subtitle}
                    </p>
                  )}

                  {wp.summary && (
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
                      {wp.summary}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground/60">
                    <span>{wp.author}</span>
                    {wp.publishedAt && (
                      <span>
                        {new Date(wp.publishedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-1 font-semibold text-amber-600 opacity-0 transition-all group-hover:opacity-100">
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

      {/* Empty state */}
      {annualReports.length === 0 && standaloneWps.length === 0 && (
        <section className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText size={40} className="mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">TAM Report 2026 akan segera hadir.</p>
          </div>
        </section>
      )}
    </main>
  );
}
