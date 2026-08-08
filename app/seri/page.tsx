import { series as seriesConfig, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowRight, Layers, Sparkles, BookOpen, Clock, Flame, Calendar, CheckCircle2, ChevronRight, Bookmark } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Seri Konten & Investigasi Mendalam',
  description: 'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  keywords: ['seri artikel', 'konten mendalam', 'investigasi gen z', 'tamparan anak muda seri', 'artikel bersambung'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
    title: 'Seri Konten & Investigasi Mendalam - Tamparan Anak Muda',
    description: 'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seri Konten & Investigasi Mendalam - Tamparan Anak Muda',
    description: 'Seri artikel investigatif mendalam TAMPARAN ANAK MUDA. Membongkar isu sistemik generasi muda dari berbagai sudut pandang.',
  },
};

export default async function SeriesPage() {
  const seriesWithCounts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 100);
      const category = posts[0]?.categoryId ? getCategoryById(posts[0].categoryId) : null;
      const totalReadingMinutes = posts.reduce((acc, p) => acc + (p.readingTime || 5), 0);

      return { 
        ...s, 
        postCount: posts.length, 
        category, 
        posts,
        totalReadingMinutes 
      };
    })
  );

  const publishedSeries = seriesWithCounts.filter((s) => s.postCount > 0);
  const comingSoonSeries = seriesWithCounts.filter((s) => s.status === 'coming-soon' || s.postCount === 0);
  
  const totalArticlesInSeries = publishedSeries.reduce((sum, s) => sum + s.postCount, 0);
  const featuredSeries = publishedSeries[0];

  return (
    <main className="min-h-screen bg-[#080809] text-white selection:bg-red-600 selection:text-white">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Seri', href: '/seri' },
      ]} />

      {/* HERO SECTION WITH GLASSMORPHISM & NEON ACCENTS */}
      <section className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-[#0A0A0C] pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[800px] rounded-full bg-gradient-to-tr from-red-900/30 via-red-600/10 to-transparent blur-[120px] opacity-70" />
        <div className="pointer-events-none absolute top-1/3 -right-20 h-[300px] w-[300px] rounded-full bg-emerald-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-10 -left-20 h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px]" />
        
        {/* Grid pattern overlay */}
        <div 
          className="pointer-events-none absolute inset-0 opacity-[0.03]" 
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            {/* Top Pill Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 backdrop-blur-md shadow-lg shadow-red-950/20">
              <Sparkles className="h-3.5 w-3.5 text-red-400 animate-pulse" />
              <span className="font-mono text-xs font-bold tracking-widest text-red-300 uppercase">
                INVESTIGASI MULTI-PART
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl lg:leading-[1.08]">
              Seri Konten <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-300 bg-clip-text text-transparent font-semibold">&amp; Dokumen</span>
            </h1>

            <p className="mb-8 text-base text-zinc-400 md:text-lg leading-relaxed max-w-2xl">
              Kumpulan pembahasan yang disusun bertahap untuk membongkar akar masalah sistemik, bukan sekadar opini di permukaan.
            </p>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full max-w-lg rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3 sm:p-4 backdrop-blur-md shadow-2xl">
              <div className="text-center border-r border-zinc-800/80 last:border-0">
                <p className="font-display text-xl sm:text-2xl font-bold text-white">{publishedSeries.length}</p>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Seri Aktif</p>
              </div>
              <div className="text-center border-r border-zinc-800/80 last:border-0">
                <p className="font-display text-xl sm:text-2xl font-bold text-red-500">{totalArticlesInSeries}</p>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Total Part</p>
              </div>
              <div className="text-center">
                <p className="font-display text-xl sm:text-2xl font-bold text-amber-400">{comingSoonSeries.length}</p>
                <p className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Rencana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SPOTLIGHT SECTION */}
      {featuredSeries && (
        <section className="relative mx-auto max-w-6xl px-4 sm:px-6 -mt-8 z-20">
          <div className="group relative overflow-hidden rounded-3xl border border-red-500/30 bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-red-950/20 p-6 sm:p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-red-500/60">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-600/10 blur-3xl group-hover:bg-red-600/20 transition-all duration-500" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md shadow-red-900/40">
                    <Flame className="h-3.5 w-3.5 fill-white" /> Featured Series
                  </span>
                  {featuredSeries.category && (
                    <span 
                      className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 border border-white/10"
                      style={{ backgroundColor: `${featuredSeries.category.color}33` }}
                    >
                      {featuredSeries.category.title}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
                    <Layers className="h-3.5 w-3.5 text-red-400" /> {featuredSeries.postCount} Part
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white group-hover:text-red-400 transition-colors leading-tight">
                  <Link href={`/seri/${featuredSeries.slug}`}>
                    {featuredSeries.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed line-clamp-3">
                  {featuredSeries.description}
                </p>

                {/* Article preview pill list */}
                {featuredSeries.posts.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {featuredSeries.posts.slice(0, 3).map((post, idx) => (
                      <span key={post.id || idx} className="text-xs text-zinc-400 bg-zinc-950/80 border border-zinc-800/80 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                        <span className="text-red-500 font-mono font-bold">0{idx + 1}.</span> 
                        <span className="truncate max-w-[200px] sm:max-w-[280px]">{post.title}</span>
                      </span>
                    ))}
                    {featuredSeries.posts.length > 3 && (
                      <span className="text-xs text-zinc-500 self-center font-mono">
                        +{featuredSeries.posts.length - 3} artikel lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0 pt-4 md:pt-0">
                <Link
                  href={`/seri/${featuredSeries.slug}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-red-950/50 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all duration-200 w-full sm:w-auto"
                >
                  <span>Mulai Baca Seri</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL PUBLISHED SERIES GRID */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-24">
        <div className="mb-10 flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-6 w-1 rounded-full bg-red-600" />
            <h2 className="font-display text-2xl font-bold text-white tracking-tight">
              Daftar Seri Rilis
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            {publishedSeries.length} Koleksi Seri
          </span>
        </div>

        {publishedSeries && publishedSeries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {publishedSeries.map((item, idx) => {
              const categoryColor = item.category?.color || '#D13A3A';

              return (
                <article
                  key={item.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-6 md:p-8 backdrop-blur-sm transition-all duration-300 hover:border-red-500/40 hover:bg-zinc-900/40 hover:shadow-xl hover:shadow-red-950/10"
                >
                  {/* Color Accent Bar */}
                  <div
                    className="absolute top-0 inset-x-0 h-1 transition-all duration-300 group-hover:h-1.5"
                    style={{ backgroundColor: categoryColor }}
                  />

                  <div>
                    {/* Header Badges */}
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.category && (
                          <span
                            className="inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                            style={{ backgroundColor: `${categoryColor}DD` }}
                          >
                            {item.category.title}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          <Layers className="h-3 w-3 text-red-500" />
                          {item.postCount} Part
                        </span>
                      </div>

                      <span className="text-xs font-mono text-zinc-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{item.totalReadingMinutes} mnt total
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 font-display text-xl sm:text-2xl font-bold leading-snug text-white transition-colors group-hover:text-red-400">
                      <Link href={`/seri/${item.slug}`}>
                        {item.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Article List Preview */}
                  <div className="space-y-3 pt-4 border-t border-zinc-900">
                    <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Daftar Artikel dalam Seri</span>
                      <span>Part 01 - 0{item.postCount}</span>
                    </div>

                    <div className="space-y-1.5">
                      {item.posts.slice(0, 3).map((post, pIdx) => (
                        <Link 
                          key={post.id || pIdx} 
                          href={`/artikel/${post.slug}`}
                          className="flex items-center justify-between text-xs text-zinc-300 hover:text-red-400 py-1 transition-colors group/item"
                        >
                          <span className="truncate pr-2 font-medium flex items-center gap-2">
                            <span className="text-red-500/80 font-mono text-[11px]">0{pIdx + 1}.</span>
                            <span className="truncate">{post.title}</span>
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 text-zinc-600 group-hover/item:text-red-400 group-hover/item:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500 font-mono">
                        Dimulai dari Part 01
                      </span>
                      <Link
                        href={`/seri/${item.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-red-500 transition-all group-hover:gap-2 group-hover:text-red-400"
                      >
                        <span>Jelajahi Seri</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40">
            <Layers className="mb-4 h-10 w-10 text-zinc-600" />
            <p className="text-zinc-400 font-medium">Belum ada seri konten aktif.</p>
          </div>
        )}
      </section>

      {/* COMING SOON ROADMAP SECTION */}
      {comingSoonSeries.length > 0 && (
        <section className="border-t border-zinc-800/80 bg-[#09090B] py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center max-w-2xl mx-auto">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 font-mono uppercase">
                <Calendar className="h-3.5 w-3.5" /> SEGERA HADIR
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                Rencana Seri &amp; Investigasi Berikutnya
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Topik mendalam yang sedang dalam tahap riset dan penyusunan oleh tim editorial.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {comingSoonSeries.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-zinc-950 via-zinc-950 to-amber-950/10 p-6 md:p-8 backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400 font-mono uppercase">
                        Coming Soon
                      </span>
                      {item.expectedDate && (
                        <span className="text-xs font-mono text-zinc-400">
                          Target Rilis: {new Date(item.expectedDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-white">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                    )}

                    {item.teaser && (
                      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-xs italic text-amber-300/90">
                        &ldquo;{item.teaser}&rdquo;
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span>{item.expectedParts ? `${item.expectedParts} Part Direncana` : 'Dalam Penyusunan'}</span>
                    <span className="text-amber-500/80 font-semibold">TAMPARAN ANAK MUDA</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA BANNER */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-12 md:py-20">
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1)_0,transparent_100%)]" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              Punya Usulan Topik Seri Investigasi?
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Kami membahas realita yang sengaja diabaikan. Kirimkan ide atau isu sistemik yang menurut kamu layak dibongkar secara mendalam.
            </p>
            <div className="pt-2">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 rounded-xl bg-zinc-800 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-700 transition-colors"
              >
                <span>Hubungi Redaksi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

