import type { Metadata } from 'next';
import { getPublishedWhitepapers } from '@/lib/db/queries/whitepapers';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ReportBadge } from '@/components/report-badge';
import { ArrowUpRight, FileSpreadsheet, ChevronRight, Terminal, Clock, Sparkles, CheckCircle2, ArrowRight, FileText, BookOpen } from 'lucide-react';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'TAM Report & Dokumen Riset Faktual',
  description:
    'Laporan editorial berbasis data dan dokumen riset independen TAMPARAN ANAK MUDA tentang realita sistemik generasi muda Indonesia.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
    title: 'TAM Report - Dokumen Riset Faktual | Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data dan dokumen riset independen TAMPARAN ANAK MUDA tentang realita sistemik generasi muda Indonesia.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAM Report - Dokumen Riset Faktual | Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data dan dokumen riset independen TAMPARAN ANAK MUDA tentang realita sistemik generasi muda Indonesia.',
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
    <main className="min-h-screen bg-background text-foreground antialiased font-sans dark:bg-[#080808] dark:text-zinc-100">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM Report', href: '/whitepaper' },
      ]} />

      {/* EDITORIAL HEADER - CLEAN ARCHIVAL MAGAZINE */}
      <section className="border-b border-border pt-20 pb-16 md:pt-28 md:pb-24 dark:border-zinc-800/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase dark:text-zinc-400">
                Riset &amp; Dokumen Independen
              </span>
              <span className="text-muted-foreground/60 dark:text-zinc-600">&mdash;</span>
              <span className="text-xs font-mono text-muted-foreground dark:text-zinc-400">
                {allReports.length} Publikasi
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] dark:text-white">
              TAM Report.
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed font-normal dark:text-zinc-400">
              Investigasi mendalam tentang ekonomi, dinamika sosial, dan realitas generasi muda Indonesia yang disusun secara objektif berbasis data faktual.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED ESSAY / DOSSIER */}
      {featuredReport && (
        <section className="border-b border-border py-16 md:py-20 bg-muted/30 dark:border-zinc-800/80 dark:bg-zinc-950/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground border border-border px-2.5 py-1 rounded dark:text-zinc-400 dark:border-zinc-800">
                    Laporan Utama
                  </span>
                  {featuredReport.reportCode && (
                    <ReportBadge reportCode={featuredReport.reportCode} reportYear={featuredReport.reportYear || undefined} size="sm" />
                  )}
                </div>

                <div className="pt-2 text-xs font-mono text-muted-foreground space-y-1 dark:text-zinc-400">
                  {featuredReport.publishedAt && (
                    <div>
                      {new Date(featuredReport.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                  {featuredReport.readingTime && (
                    <div className="flex items-center gap-1.5 text-muted-foreground dark:text-zinc-400">
                      <Clock size={12} />
                      <span>{featuredReport.readingTime} Menit Waktu Baca</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-foreground hover:text-primary transition-colors leading-tight dark:text-white dark:hover:text-zinc-300">
                  <Link href={`/whitepaper/${featuredReport.slug}`}>
                    {featuredReport.title}
                  </Link>
                </h2>

                {featuredReport.subtitle && (
                  <p className="text-base text-foreground/70 leading-relaxed font-light dark:text-zinc-300">
                    {featuredReport.subtitle}
                  </p>
                )}

                {/* Key Findings List */}
                {featuredReport.keyFindings && featuredReport.keyFindings.length > 0 && (
                  <div className="pt-4 border-t border-border space-y-3 dark:border-zinc-900">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground dark:text-zinc-400">
                      Ringkasan Temuan:
                    </h3>
                    <ul className="space-y-2">
                      {featuredReport.keyFindings.slice(0, 3).map((finding, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-foreground/70 flex items-start gap-2.5 dark:text-zinc-300">
                          <span className="text-muted-foreground/60 font-mono select-none dark:text-zinc-500">&mdash;</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href={`/whitepaper/${featuredReport.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors group dark:text-white dark:hover:text-zinc-300"
                  >
                    <span>Baca Laporan Selengkapnya</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ARCHIVE INDEX LISTING */}
      {restReports.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <div className="mb-12 flex items-center justify-between border-b border-border pb-4 dark:border-zinc-800">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight dark:text-white">
              Arsip Laporan
            </h2>
            <span className="font-mono text-xs text-muted-foreground dark:text-zinc-400">
              {restReports.length} Dokumen
            </span>
          </div>

          <div className="divide-y divide-border dark:divide-zinc-800/60">
            {restReports.map((wp) => (
              <article
                key={wp.slug}
                className="py-8 first:pt-0 last:pb-0 group transition-colors"
              >
                <div className="grid gap-4 md:grid-cols-12 md:items-baseline">
                  <div className="md:col-span-3 space-y-1">
                    <div className="flex items-center gap-2">
                      {wp.reportCode ? (
                        <ReportBadge reportCode={wp.reportCode} reportYear={wp.reportYear || undefined} size="sm" />
                      ) : (
                        <span className="text-[10px] font-mono text-muted-foreground dark:text-zinc-400">
                          Report
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-muted-foreground dark:text-zinc-400">
                      {wp.publishedAt ? new Date(wp.publishedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : ''}
                      {wp.readingTime ? ` · ${wp.readingTime} min` : ''}
                    </div>
                  </div>

                  <div className="md:col-span-9 space-y-3">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors dark:text-white dark:group-hover:text-zinc-300">
                      <Link href={`/whitepaper/${wp.slug}`}>
                        {wp.title}
                      </Link>
                    </h3>

                    {wp.subtitle && (
                      <p className="text-sm text-muted-foreground leading-relaxed font-light line-clamp-2 dark:text-zinc-400">
                        {wp.subtitle}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      {wp.tags && wp.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {wp.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-muted-foreground font-mono dark:text-zinc-400">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : <div />}

                      <Link
                        href={`/whitepaper/${wp.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors dark:text-zinc-300 dark:group-hover:text-zinc-300"
                      >
                        <span>Lihat Dokumen</span>
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {allReports.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="py-20 text-center border border-border bg-muted/30 p-8 rounded-lg dark:border-zinc-800 dark:bg-zinc-950/40">
            <h3 className="font-display text-lg font-bold text-foreground mb-2 dark:text-white">Belum Ada Laporan Rilis</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto dark:text-zinc-400">
              TAM Report sedang dalam proses penyusunan dan pengolahan data.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}


