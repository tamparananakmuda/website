import type { Metadata } from 'next';
import { getPublishedWhitepapers } from '@/lib/db/queries/whitepapers';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ReportBadge } from '@/components/report-badge';
import { FileText, Clock, ArrowRight, BarChart3, Database, Sparkles, CheckCircle2, ShieldCheck, Download, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TAM Report & Riset Data Generasi Muda',
  description:
    'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data faktual, bukan sekadar asumsi.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/whitepaper`,
    title: 'TAM Report & Riset Data Generasi Muda - Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data faktual, bukan sekadar asumsi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAM Report & Riset Data Generasi Muda - Tamparan Anak Muda',
    description:
      'Laporan editorial berbasis data tentang generasi muda Indonesia. Riset mendalam TAMPARAN ANAK MUDA: berbasis data faktual, bukan sekadar asumsi.',
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
    <main className="min-h-screen bg-[#080809] text-white selection:bg-amber-500 selection:text-black">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'TAM Report', href: '/whitepaper' },
      ]} />

      {/* HERO SECTION WITH EXECUTIVE AMBER GLOW */}
      <section className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-[#0B0A08] pt-14 pb-16 md:pt-24 md:pb-28">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[850px] rounded-full bg-gradient-to-tr from-amber-600/20 via-amber-500/10 to-transparent blur-[130px] opacity-80" />
        <div className="pointer-events-none absolute top-1/2 -right-30 h-[350px] w-[350px] rounded-full bg-orange-600/10 blur-[110px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.035]" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-amber-950/20">
              <BarChart3 className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-mono text-xs font-bold tracking-widest text-amber-300 uppercase">
                LAPORAN EDITORIAL &amp; DATA
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.08]">
              TAM <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">Report</span>
            </h1>

            <p className="mb-8 text-base text-zinc-400 md:text-lg leading-relaxed max-w-2xl">
              Laporan editorial berbasis data faktual tentang realita ekonomi &amp; sosial generasi muda Indonesia. Bukan asumsi, bukan opini tanpa bukti.
            </p>

            {/* Quick Stats Bar */}
            {allReports.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg rounded-2xl border border-amber-500/20 bg-zinc-900/60 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
                <div className="text-center border-r border-zinc-800/80 last:border-0">
                  <p className="font-display text-xl sm:text-2xl font-bold text-white">{allReports.length}</p>
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Report</p>
                </div>
                <div className="text-center border-r border-zinc-800/80 last:border-0">
                  <p className="font-display text-xl sm:text-2xl font-bold text-amber-400">{totalReadingTime} mnt</p>
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Baca</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-xl sm:text-2xl font-bold text-amber-300">{totalDataSources}+</p>
                  <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Sumber Data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED REPORT SPOTLIGHT */}
      {featuredReport && (
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 -mt-8 z-20">
          <div className="group relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-amber-950/20 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-amber-500/60">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl group-hover:bg-amber-500/20 transition-all duration-500" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-xs font-bold text-amber-300 uppercase tracking-wider shadow-md">
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Edisi Terbaru
                  </span>
                  {featuredReport.reportCode && (
                    <ReportBadge reportCode={featuredReport.reportCode} reportYear={featuredReport.reportYear || undefined} size="md" />
                  )}
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors leading-tight">
                  <Link href={`/whitepaper/${featuredReport.slug}`}>
                    {featuredReport.title}
                  </Link>
                </h2>

                {featuredReport.subtitle && (
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-2">
                    {featuredReport.subtitle}
                  </p>
                )}

                {/* Key Findings List Preview */}
                {featuredReport.keyFindings && featuredReport.keyFindings.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 font-bold">Key Findings / Temuan Utama:</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {featuredReport.keyFindings.slice(0, 4).map((finding, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-2.5">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{finding}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-zinc-400">
                  {featuredReport.readingTime && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={13} className="text-amber-400" />
                      {featuredReport.readingTime} Menit Baca
                    </span>
                  )}
                  {featuredReport.publishedAt && (
                    <span>
                      Dipublikasikan: {new Date(featuredReport.publishedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 pt-4 md:pt-0">
                <Link
                  href={`/whitepaper/${featuredReport.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 text-sm font-bold text-black shadow-xl shadow-amber-950/50 hover:bg-amber-400 hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
                >
                  <span>Baca Laporan Lengkap</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL REPORTS GRID SECTION */}
      {restReports.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
          <div className="mb-10 flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 rounded-full bg-amber-500" />
              <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                Arsip &amp; Laporan Lainnya
              </h2>
            </div>
            <span className="font-mono text-xs text-zinc-400">
              {allReports.length} Laporan Faktual
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restReports.map((wp) => (
              <article
                key={wp.slug}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:bg-zinc-900/40 hover:shadow-xl hover:shadow-amber-950/10"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    {wp.reportCode ? (
                      <ReportBadge reportCode={wp.reportCode} reportYear={wp.reportYear || undefined} size="sm" />
                    ) : (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        TAM Report
                      </span>
                    )}
                    {wp.readingTime && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500">
                        <Clock size={12} />
                        {wp.readingTime}m
                      </span>
                    )}
                  </div>

                  <h3 className="mb-3 font-display text-lg font-bold leading-snug text-white transition-colors group-hover:text-amber-400">
                    <Link href={`/whitepaper/${wp.slug}`}>
                      {wp.title}
                    </Link>
                  </h3>

                  {wp.subtitle && (
                    <p className="mb-4 line-clamp-2 text-xs sm:text-sm leading-relaxed text-zinc-400">
                      {wp.subtitle}
                    </p>
                  )}

                  {wp.tags && wp.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {wp.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-mono uppercase text-zinc-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                  <span>
                    {wp.publishedAt ? new Date(wp.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Dipublikasikan'}
                  </span>
                  <Link
                    href={`/whitepaper/${wp.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-amber-500 hover:text-amber-400 transition-all group-hover:gap-1.5"
                  >
                    <span>Detail</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* EMPTY STATE */}
      {allReports.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24">
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
              <FileText size={28} className="text-amber-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Belum Ada Laporan Rilis</h3>
            <p className="text-sm text-zinc-400 max-w-md">TAM Report 2026 sedang dalam proses pengolahan data dan penyusunan editorial.</p>
          </div>
        </section>
      )}

      {/* FOOTER METRICS INFO BANNER */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-r from-zinc-950 via-amber-950/10 to-zinc-950 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" /> Transparansi Metodologi Data
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Dibuat Berdasarkan Data Faktual
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Setiap laporan TAM Report menyertakan sumber data yang dapat diverifikasi publik. Kami berkomitmen untuk menyajikan wawasan objektif demi perubahan nyata.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

