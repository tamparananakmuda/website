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
    <main className="min-h-screen bg-[#080808] text-zinc-100 antialiased font-sans">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM Report', href: '/whitepaper' },
      ]} />

      {/* EDITORIAL HEADER - CLEAN ARCHIVAL MAGAZINE */}
      <section className="border-b border-zinc-800/80 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">
                Riset &amp; Dokumen Independen
              </span>
              <span className="text-zinc-600">&mdash;</span>
              <span className="text-xs font-mono text-zinc-400">
                {allReports.length} Publikasi
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              TAM Report.
            </h1>

            <p className="max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed font-normal">
              Investigasi mendalam tentang ekonomi, dinamika sosial, dan realitas generasi muda Indonesia yang disusun secara objektif berbasis data faktual.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED ESSAY / DOSSIER */}
      {featuredReport && (
        <section className="border-b border-zinc-800/80 py-16 md:py-20 bg-zinc-950/40">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-12 items-start">
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 border border-zinc-800 px-2.5 py-1 rounded">
                    Laporan Utama
                  </span>
                  {featuredReport.reportCode && (
                    <ReportBadge reportCode={featuredReport.reportCode} reportYear={featuredReport.reportYear || undefined} size="sm" />
                  )}
                </div>

                <div className="pt-2 text-xs font-mono text-zinc-400 space-y-1">
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
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <Clock size={12} />
                      <span>{featuredReport.readingTime} Menit Waktu Baca</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 space-y-6">
                <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white hover:text-zinc-300 transition-colors leading-tight">
                  <Link href={`/whitepaper/${featuredReport.slug}`}>
                    {featuredReport.title}
                  </Link>
                </h2>

                {featuredReport.subtitle && (
                  <p className="text-base text-zinc-300 leading-relaxed font-light">
                    {featuredReport.subtitle}
                  </p>
                )}

                {/* Key Findings List */}
                {featuredReport.keyFindings && featuredReport.keyFindings.length > 0 && (
                  <div className="pt-4 border-t border-zinc-900 space-y-3">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                      Ringkasan Temuan:
                    </h3>
                    <ul className="space-y-2">
                      {featuredReport.keyFindings.slice(0, 3).map((finding, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-zinc-300 flex items-start gap-2.5">
                          <span className="text-zinc-500 font-mono select-none">&mdash;</span>
                          <span>{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <Link
                    href={`/whitepaper/${featuredReport.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-zinc-300 transition-colors group"
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
          <div className="mb-12 flex items-center justify-between border-b border-zinc-800 pb-4">
            <h2 className="font-display text-xl font-bold text-white tracking-tight">
              Arsip Laporan
            </h2>
            <span className="font-mono text-xs text-zinc-400">
              {restReports.length} Dokumen
            </span>
          </div>

          <div className="divide-y divide-zinc-800/60">
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
                        <span className="text-[10px] font-mono text-zinc-400">
                          Report
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {wp.publishedAt ? new Date(wp.publishedAt).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : ''}
                      {wp.readingTime ? ` · ${wp.readingTime} min` : ''}
                    </div>
                  </div>

                  <div className="md:col-span-9 space-y-3">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white group-hover:text-zinc-300 transition-colors">
                      <Link href={`/whitepaper/${wp.slug}`}>
                        {wp.title}
                      </Link>
                    </h3>

                    {wp.subtitle && (
                      <p className="text-sm text-zinc-400 leading-relaxed font-light line-clamp-2">
                        {wp.subtitle}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between">
                      {wp.tags && wp.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {wp.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-zinc-400 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      ) : <div />}

                      <Link
                        href={`/whitepaper/${wp.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 group-hover:text-white transition-colors"
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
          <div className="py-20 text-center border border-zinc-800 bg-zinc-950/40 p-8 rounded-lg">
            <h3 className="font-display text-lg font-bold text-white mb-2">Belum Ada Laporan Rilis</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              TAM Report sedang dalam proses penyusunan dan pengolahan data.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}


