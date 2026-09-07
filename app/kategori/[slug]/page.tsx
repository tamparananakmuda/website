import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoryWithSubcategoriesBySlug } from '@/lib/db/queries/categories';
import { getPostsByCategorySlug } from '@/lib/db/queries/posts';
import { categories as allCategories } from '@/content/config';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { CollectionPageSchema } from '@/components/schema/collection-page-schema';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  FileText,
  Layers,
  ShieldCheck,
  Compass,
  X,
} from 'lucide-react';
import type { PostWithRelations } from '@/lib/db/schema';

interface CategoryPageProps {
  params: { slug: string };
  searchParams?: { pillar?: string };
}

export const revalidate = 60;

interface CategoryEditorialProfile {
  dossierNum: string;
  scopeSubtitle: string;
  manifestoQuote: string;
  manifestoPrinciple: string;
}

const CATEGORY_EDITORIAL_PROFILES: Record<string, CategoryEditorialProfile> = {
  bisnis: {
    dossierNum: '01',
    scopeSubtitle:
      'Investigasi realita pasar, unit economics riil, dan dekonstruksi ilusi entrepreneurship instan. Kami menulis tentang bagaimana bertahan dan membangun nilai nyata saat 90% bisnis gugur.',
    manifestoQuote:
      'Bisnis riil tidak dibangun di panggung seminar motivasi. Bisnis adalah urusan arus kas yang ketat, margin yang dipertahankan, dan ketahanan mental saat omzet belum tiba.',
    manifestoPrinciple:
      'Membongkar skema bisnis predator, membekali pendiri muda dengan pemahaman finansial riil, dan menghentikan glorifikasi kerja rodi tanpa hasil.',
  },
  teknologi: {
    dossierNum: '02',
    scopeSubtitle:
      'Memahami algoritma, kedaulatan data, penetrasi AI, dan teknologi adiktif tanpa racun marketing Silicon Valley. Tools yang membebaskan, bukan memperbudak perhatianmu.',
    manifestoQuote:
      'Teknologi adalah pengungkit yang luar biasa tajam. Jika kamu tidak belajar mengendalikannya dari sekarang, kamulah produk yang sedang dikonsumsi oleh algoritma orang lain.',
    manifestoPrinciple:
      'Kedaulatan digital, literasi teknis tanpa jargon muluk, serta perlindungan privasi dan kesehatan kognitif generasi muda.',
  },
  karier: {
    dossierNum: '03',
    scopeSubtitle:
      'Navigasi jujur dunia kerja modern: membongkar eksploitasi berkedok loyalitas, politik kantor, dan strategi nyata membangun daya tawar profesional yang tidak bisa digantikan.',
    manifestoQuote:
      'Kantor bukan keluargamu; mereka adalah institusi ekonomi yang menyewa keahlianmu. Bangun reputasi dan portofolio nilaimu sendiri, bukan sekadar menimbun jam lembur.',
    manifestoPrinciple:
      'Menyelamatkan talenta muda dari jebakan hustle culture destruktif, memahami kontrak hukum kerja, dan menavigasi mobilitas karier berbasis skill.',
  },
  kehidupan: {
    dossierNum: '04',
    scopeSubtitle:
      'Eksplorasi hubungan manusiawi, krisis kesepian urban, dinamika keluarga, dan filosofi kedewasaan. Pelajaran-pelajaran krusial yang sengaja dilewatkan oleh kurikulum sekolah.',
    manifestoQuote:
      'Kamu tidak bisa memilih masa kecilmu, tapi kamu bertanggung jawab penuh atas kualitas kedewasaanmu dan lingkungan orang-orang yang kamu izinkan tinggal di hidupmu.',
    manifestoPrinciple:
      'Membantu generasi muda membangun batasan relasi yang sehat, memutus rantai trauma antargenerasi, dan menemukan ketenangan di tengah hiruk pikuk dunia.',
  },
  mindset: {
    dossierNum: '05',
    scopeSubtitle:
      'Dekonstruksi delusi diri, bias kognitif, dan toxic positivity. Melatih kejernihan berpikir rasional dan ketangguhan mental agar tidak mudah diperdaya narasi dunia.',
    manifestoQuote:
      'Kenyataan tidak pernah peduli dengan perasaanmu. Semakin cepat kamu menerima realita sebagaimana adanya, semakin cepat kamu bisa mengambil tindakan yang efektif.',
    manifestoPrinciple:
      'Stoikisme praktis, keberanian mengakui kesalahan, melucuti ego yang rapuh, dan menumbuhkan daya tahan psikologis tingkat tinggi.',
  },
  uang: {
    dossierNum: '06',
    scopeSubtitle:
      'Mengurai sistem keuangan, ilusi konsumerisme, perangkap utang gaya hidup, dan strategi kedaulatan finansial mandiri untuk generasi yang terjepit inflasi struktural.',
    manifestoQuote:
      'Uang bukanlah tujuan akhir, melainkan alat penopang martabat dan kedaulatan pilihan. Jangan biarkan ketidaktahuan finansial mengunci masa mudamu dalam perbudakan utang.',
    manifestoPrinciple:
      'Melek keuangan radikal, membongkar judi terselubung dan investasi bodong, serta merancang arsitektur keamanan finansial yang realistis.',
  },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const category = await getCategoryWithSubcategoriesBySlug(params.slug);

  if (!category) {
    return { title: 'Kategori Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/kategori/${category.slug}`;

  return {
    title: {
      absolute: `${category.title} - Tamparan Anak Muda`,
    },
    description: category.description || undefined,
    keywords: [
      category.title,
      `artikel ${category.title.toLowerCase()}`,
      `${category.title.toLowerCase()} gen z`,
      'tamparan anak muda',
      'investigasi realita',
    ],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
      siteName: 'TAMPARAN ANAK MUDA',
      images: [
        {
          url: 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp',
          width: 1600,
          height: 900,
          alt: `${category.title} - TAMPARAN ANAK MUDA`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
      images: ['https://cdn.tamparananakmuda.com/og/homepage-feature.webp'],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const category = await getCategoryWithSubcategoriesBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const dossier = CATEGORY_EDITORIAL_PROFILES[category.slug] || {
    dossierNum: '00',
    scopeSubtitle: category.description || 'Kumpulan esai dan analisis kritis dari Tamparan Anak Muda.',
    manifestoQuote: 'Melihat kenyataan sebagaimana adanya, bukan sebagaimana yang kita inginkan.',
    manifestoPrinciple: 'Jurnalisme kritis berbasis data dan realita lapangan.',
  };

  const sortedSubs = (category.subcategories || []).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  // Fetch all articles for this category to allow rich exploration
  const allCategoryPosts = await getPostsByCategorySlug(category.slug, 100);
  const catColor = category.color || '#D13A3A';

  // Pillar filter handling
  const activePillarSlug = searchParams?.pillar;
  const activeSubcategory = activePillarSlug
    ? sortedSubs.find((s) => s.slug === activePillarSlug)
    : undefined;

  const displayedPosts = activePillarSlug
    ? allCategoryPosts.filter(
        (p) =>
          p.subcategory?.slug === activePillarSlug ||
          (activeSubcategory && p.subcategoryId === activeSubcategory.id)
      )
    : allCategoryPosts;

  // Post grouping for editorial magazine hierarchy
  const featuredPost = displayedPosts[0] as PostWithRelations | undefined;
  const secondaryPosts = displayedPosts.slice(1, 3);
  const streamPosts = displayedPosts.slice(3);

  // Metrics
  const totalReadMinutes = allCategoryPosts.reduce(
    (sum, p) => sum + (p.readingTime || 5),
    0
  );

  // Other categories for cross-navigation
  const otherCategories = allCategories.filter((c) => c.slug !== category.slug);

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Kategori', href: '/kategori' },
          { name: category.title, href: `/kategori/${category.slug}` },
        ]}
      />
      <CollectionPageSchema
        name={category.title}
        slug={category.slug}
        description={category.description || undefined}
        items={displayedPosts.map((p) => ({ title: p.title, slug: p.slug }))}
      />

      {/* ========================================================================= */}
      {/* 1. DOSSIER MASTHEAD & ARCHITECTURAL HERO                                  */}
      {/* ========================================================================= */}
      <section className="relative w-full overflow-hidden border-b border-border/70">
        {/* Subtle background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Subtle atmospheric tint matching category color */}
          <div
            className="absolute top-0 right-0 w-[650px] h-[650px] opacity-[0.08] blur-[140px]"
            style={{ backgroundColor: catColor }}
          />
          {/* Faint technical grid lines */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          {/* Bottom vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-10 pb-12 sm:px-6 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28">
          {/* Top meta strip */}
          <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/kategori"
              className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft
                size={13}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span>Arsip Kategori TAM</span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] rounded border border-border bg-card/60 px-2 py-0.5 sm:px-2.5 sm:py-1 text-muted-foreground">
                SEKSI {dossier.dossierNum} / DOSIR
              </span>
              <span className="inline-flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                EDISI AKTIF
              </span>
            </div>
          </div>

          {/* Massive Display Title (Responsive & hyphen-safe for long category names on mobile) */}
          <div className="relative mb-5 sm:mb-6">
            <div className="flex items-baseline gap-3 sm:gap-4">
              <h1 className="font-display text-4xl xs:text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold uppercase tracking-tight text-foreground leading-[0.95] break-words">
                {category.title}
              </h1>
              <span
                className="hidden sm:inline-block font-mono text-2xl md:text-3xl font-bold opacity-30"
                style={{ color: catColor }}
              >
                /{dossier.dossierNum}
              </span>
            </div>
            {/* Color signature underline */}
            <div
              className="mt-3 sm:mt-4 h-1 sm:h-1.5 w-16 sm:w-28 rounded-full"
              style={{ backgroundColor: catColor }}
            />
          </div>

          {/* Subtitle & Scope Statement */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start mt-5 sm:mt-6">
            <div className="lg:col-span-8">
              <p className="font-display text-lg xs:text-xl sm:text-2xl font-bold leading-snug text-foreground">
                &ldquo;{category.description}&rdquo;
              </p>
              <p className="mt-2.5 sm:mt-3 text-xs xs:text-sm sm:text-base leading-relaxed text-muted-foreground max-w-3xl">
                {dossier.scopeSubtitle}
              </p>
            </div>

            {/* Quick Metrics Capsule: compact 3-column micro-grid on mobile, vertical stack on desktop */}
            <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-2 sm:gap-3 rounded-2xl border border-border bg-card p-3 sm:p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center text-center sm:text-left gap-1.5 sm:gap-3">
                <div
                  className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-border"
                  style={{ backgroundColor: `${catColor}15`, color: catColor }}
                >
                  <FileText size={16} />
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-bold text-foreground">
                    {allCategoryPosts.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Laporan
                  </div>
                </div>
              </div>

              <div className="hidden sm:block lg:hidden w-px h-8 bg-border self-center" />
              <div className="hidden lg:block h-px w-full bg-border/60" />

              <div className="flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center text-center sm:text-left gap-1.5 sm:gap-3 border-x sm:border-x-0 lg:border-x-0 border-border/60 px-1 sm:px-0">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground/80">
                  <Clock size={16} />
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-bold text-foreground">
                    ~{Math.round(totalReadMinutes / 60)}j
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Waktu Kaji
                  </div>
                </div>
              </div>

              <div className="hidden sm:block lg:hidden w-px h-8 bg-border self-center" />
              <div className="hidden lg:block h-px w-full bg-border/60" />

              <div className="flex flex-col sm:flex-row lg:flex-row items-center sm:items-start lg:items-center text-center sm:text-left gap-1.5 sm:gap-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-foreground/80">
                  <Layers size={16} />
                </div>
                <div>
                  <div className="font-display text-lg sm:text-xl font-bold text-foreground">
                    {sortedSubs.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Pilar
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PILLAR FILTER NAVIGATION BAR (Mobile-friendly horizontal touch swipe)      */}
          {/* ========================================================================= */}
          {sortedSubs.length > 0 && (
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <Compass size={14} className="text-muted-foreground/60" />
                  <span className="font-mono text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground">
                    Filter Pilar Analisis:
                  </span>
                </div>

                {activePillarSlug && (
                  <Link
                    href={`/kategori/${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={13} />
                    <span>Reset filter</span>
                  </Link>
                )}
              </div>

              {/* Touch-friendly horizontal scroll on mobile, wrap on tablet+ */}
              <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-2 scrollbar-none snap-x touch-pan-x">
                {/* "Semua Laporan" button */}
                <Link
                  href={`/kategori/${category.slug}`}
                  className={`shrink-0 snap-start group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                    !activePillarSlug
                      ? 'border-transparent text-white shadow-lg'
                      : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted'
                  }`}
                  style={
                    !activePillarSlug
                      ? {
                          backgroundColor: catColor,
                          boxShadow: `0 4px 20px ${catColor}30`,
                        }
                      : undefined
                  }
                >
                  <span>Semua Laporan</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                      !activePillarSlug
                        ? 'bg-black/25 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {allCategoryPosts.length}
                  </span>
                </Link>

                {/* Subcategory buttons */}
                {sortedSubs.map((sub) => {
                  const isActive = activePillarSlug === sub.slug;
                  const countInPillar = allCategoryPosts.filter(
                    (p) =>
                      p.subcategory?.slug === sub.slug ||
                      p.subcategoryId === sub.id
                  ).length;

                  return (
                    <Link
                      key={sub.id}
                      href={`/kategori/${category.slug}?pillar=${sub.slug}`}
                      className={`shrink-0 snap-start group inline-flex items-center gap-1.5 sm:gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border ${
                        isActive
                          ? 'border-transparent text-white shadow-lg'
                          : 'border-border bg-card text-muted-foreground hover:border-foreground/30 hover:text-foreground hover:bg-muted'
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: catColor,
                              boxShadow: `0 4px 20px ${catColor}30`,
                            }
                          : undefined
                      }
                    >
                      <span>{sub.title}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                          isActive
                            ? 'bg-black/25 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {countInPillar}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Active filter summary pill */}
              {activeSubcategory && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg px-3 py-2">
                  <span className="font-mono text-muted-foreground/70">FOKUS:</span>
                  <span className="font-semibold text-foreground">
                    {activeSubcategory.title}
                  </span>
                  {activeSubcategory.description && (
                    <>
                      <span className="hidden sm:inline text-muted-foreground/40">&middot;</span>
                      <span className="hidden sm:inline">{activeSubcategory.description}</span>
                    </>
                  )}
                  <span className="ml-auto font-mono text-muted-foreground/70">
                    {displayedPosts.length} Dokumen
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ARTICLES CONTENT STREAM & EDITORIAL FLOW                               */}
      {/* ========================================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-20 lg:py-24">
        {displayedPosts && displayedPosts.length > 0 ? (
          <div className="space-y-12 sm:space-y-20">
            {/* ------------------------------------------------------------------- */}
            {/* 2.A LEAD STORY / LAPORAN UTAMA (MAGAZINE SPLIT)                    */}
            {/* ------------------------------------------------------------------- */}
            {featuredPost && (
              <div className="relative group">
                {/* Glow accent */}
                <div
                  className="absolute -inset-1 rounded-3xl opacity-15 blur-xl transition-all duration-500 group-hover:opacity-25"
                  style={{ backgroundColor: `${catColor}` }}
                />

                <article className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-300 group-hover:border-border/80 group-hover:shadow-md">
                  <div className="grid lg:grid-cols-12 gap-0 items-stretch">
                    {/* Left: Featured Image - Strictly 16:9 on mobile for perfect uncropped proportions */}
                    <div className="lg:col-span-7 relative w-full aspect-[16/9] sm:aspect-[16/10] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-muted">
                      <Link
                        href={`/artikel/${featuredPost.slug}`}
                        prefetch={false}
                        className="block h-full w-full relative"
                      >
                        <Image
                          src={
                            featuredPost.ogFeatureUrl ||
                            featuredPost.ogCardUrl ||
                            featuredPost.ogImageUrl ||
                            `/api/og/card?slug=${featuredPost.slug}`
                          }
                          alt={featuredPost.title}
                          fill
                          priority
                          quality={92}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                        />
                        {/* Smooth vignette overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Badges on image */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span
                            className="rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-white shadow-lg"
                            style={{ backgroundColor: catColor }}
                          >
                            LAPORAN UTAMA
                          </span>
                          {featuredPost.subcategory && (
                            <span className="rounded-full border border-white/20 bg-black/60 backdrop-blur-md px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/90">
                              {featuredPost.subcategory.title}
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Right: Editorial Narrative Box */}
                    <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between">
                      <div>
                        {/* Meta header */}
                        <div className="mb-3 sm:mb-4 flex flex-wrap items-center gap-2 text-xs font-mono text-muted-foreground">
                          <span>{formatDate(featuredPost.publishedAt)}</span>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {featuredPost.readingTime} Menit Baca
                          </span>
                          {featuredPost.isPremium && (
                            <>
                              <span>&middot;</span>
                              <span className="rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 text-[10px] font-semibold">
                                PREVIEWS
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-display text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight tracking-tight transition-colors group-hover:text-foreground">
                          <Link
                            href={`/artikel/${featuredPost.slug}`}
                            prefetch={false}
                            className="hover:underline decoration-foreground/30 underline-offset-4"
                          >
                            {featuredPost.title}
                          </Link>
                        </h2>

                        {/* Excerpt */}
                        {featuredPost.excerpt && (
                          <p className="mt-3 sm:mt-4 text-xs xs:text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-4">
                            {featuredPost.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Author byline & CTA (Thumb friendly on mobile) */}
                      <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-bold text-foreground shrink-0">
                            TAM
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-foreground">
                              {featuredPost.author?.name || 'Redaksi TAM'}
                            </div>
                            <div className="text-[10px] sm:text-[11px] font-mono text-muted-foreground">
                              Investigasi Terverifikasi
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/artikel/${featuredPost.slug}`}
                          prefetch={false}
                          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:gap-3 w-full xs:w-auto text-center shadow-md"
                          style={{ backgroundColor: `${catColor}` }}
                        >
                          <span>Baca Laporan</span>
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 2.B SECONDARY HIGHLIGHTS (SOROTAN REDAKSI - 2 COLUMNS)             */}
            {/* ------------------------------------------------------------------- */}
            {secondaryPosts.length > 0 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    SOROTAN REDAKSI // PILIHAN
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                  {secondaryPosts.map((post, idx) => {
                    const postImg =
                      post.ogCardUrl ||
                      post.ogImageUrl ||
                      `/api/og/card?slug=${post.slug}`;
                    const postNum = String(idx + 2).padStart(2, '0');

                    return (
                      <article
                        key={post.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-6 transition-all duration-300 hover:border-border/80 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Top subtle accent line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: catColor }}
                        />

                        <div>
                          {/* Image with strict 16:9 aspect ratio */}
                          <Link
                            href={`/artikel/${post.slug}`}
                            prefetch={false}
                            className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted mb-3.5 sm:mb-5"
                          >
                            <Image
                              src={postImg}
                              alt={post.title}
                              fill
                              quality={90}
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                            />
                            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
                              <span className="rounded-md border border-white/20 bg-black/70 backdrop-blur-md px-2 py-0.5 sm:px-2.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                                #{postNum}
                              </span>
                            </div>
                          </Link>

                          {/* Meta */}
                          <div className="mb-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                            {post.subcategory && (
                              <span
                                className="font-semibold uppercase tracking-wider"
                                style={{ color: catColor }}
                              >
                                {post.subcategory.title}
                              </span>
                            )}
                            {post.subcategory && <span>&middot;</span>}
                            <span>{post.readingTime} Menit</span>
                          </div>

                          {/* Title */}
                          <h3 className="font-display text-lg sm:text-2xl font-bold leading-snug text-foreground group-hover:text-foreground transition-colors">
                            <Link
                              href={`/artikel/${post.slug}`}
                              prefetch={false}
                              className="hover:underline decoration-foreground/30 underline-offset-4"
                            >
                              {post.title}
                            </Link>
                          </h3>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-border flex items-center justify-between text-xs">
                          <span className="font-mono text-muted-foreground">
                            {formatDate(post.publishedAt)}
                          </span>
                          <Link
                            href={`/artikel/${post.slug}`}
                            prefetch={false}
                            className="inline-flex items-center gap-1 font-semibold hover:opacity-80 group-hover:translate-x-0.5 transition-all py-1"
                            style={{ color: catColor }}
                          >
                            <span>Baca esai</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------------- */}
            {/* 2.C EDITORIAL STANDPOINT / CALLOUT BOX                              */}
            {/* ------------------------------------------------------------------- */}
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-10 lg:p-12 shadow-sm">
              <div
                className="absolute left-0 top-0 bottom-0 w-1 sm:w-1.5"
                style={{ backgroundColor: catColor }}
              />
              <div className="relative z-10 max-w-4xl">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <ShieldCheck size={16} style={{ color: catColor }} />
                  <span className="font-mono text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground">
                    STANDAR EDITORIAL // {category.title.toUpperCase()}
                  </span>
                </div>

                <blockquote className="font-display text-base sm:text-2xl font-bold text-foreground leading-relaxed">
                  &ldquo;{dossier.manifestoQuote}&rdquo;
                </blockquote>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  {dossier.manifestoPrinciple}
                </p>

                <div className="mt-4 sm:mt-6 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-muted-foreground pt-3.5 sm:pt-4 border-t border-border">
                  <span>JURNALISME INDEPENDEN</span>
                  <span>&middot;</span>
                  <span>TANPA MOTIVASI KLISE</span>
                  <span>&middot;</span>
                  <span>BERBASIS KENYATAAN RIIL</span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------------- */}
            {/* 2.D COMPLETE DOSSIER ARCHIVE (BENTO / EDITORIAL STREAM GRID)       */}
            {/* ------------------------------------------------------------------- */}
            {streamPosts.length > 0 && (
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-3 sm:pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      ARSIP DOKUMEN // INDEKS LENGKAP
                    </span>
                    <span className="rounded bg-muted border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground font-semibold">
                      {streamPosts.length} DOKUMEN
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {streamPosts.map((post, idx) => {
                    const postImg =
                      post.ogCardUrl ||
                      post.ogImageUrl ||
                      `/api/og/card?slug=${post.slug}`;
                    const postNum = String(idx + 4).padStart(2, '0');

                    return (
                      <article
                        key={post.id}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 transition-all duration-300 hover:border-border/80 hover:-translate-y-1 hover:shadow-md"
                      >
                        {/* Hover line */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: catColor }}
                        />

                        <div>
                          {/* Image with strict 16:9 aspect ratio */}
                          <Link
                            href={`/artikel/${post.slug}`}
                            prefetch={false}
                            className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted mb-3.5 sm:mb-4"
                          >
                            <Image
                              src={postImg}
                              alt={post.title}
                              fill
                              quality={85}
                              loading="lazy"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="rounded-md border border-white/20 bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">
                                #{postNum}
                              </span>
                            </div>
                          </Link>

                          {/* Subcategory & Reading Time */}
                          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground">
                            {post.subcategory ? (
                              <span
                                className="truncate font-semibold uppercase"
                                style={{ color: catColor }}
                              >
                                {post.subcategory.title}
                              </span>
                            ) : (
                              <span className="text-muted-foreground uppercase">
                                {category.title}
                              </span>
                            )}
                            <span className="shrink-0">
                              {post.readingTime} Menit
                            </span>
                          </div>

                          {/* Title */}
                          <h4 className="font-display text-base sm:text-lg font-bold leading-snug text-foreground group-hover:text-foreground transition-colors line-clamp-2">
                            <Link
                              href={`/artikel/${post.slug}`}
                              prefetch={false}
                              className="hover:underline decoration-foreground/30 underline-offset-2"
                            >
                              {post.title}
                            </Link>
                          </h4>

                          {/* Excerpt */}
                          {post.excerpt && (
                            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 sm:mt-5 pt-3 border-t border-border flex items-center justify-between text-xs">
                          <span className="font-mono text-muted-foreground">
                            {formatDate(post.publishedAt)}
                          </span>
                          <Link
                            href={`/artikel/${post.slug}`}
                            prefetch={false}
                            className="inline-flex items-center gap-1 font-semibold hover:opacity-80 group-hover:translate-x-0.5 transition-all py-1"
                            style={{ color: catColor }}
                          >
                            <span>Baca esai</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-muted">
              <FileText size={26} className="text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Belum Ada Laporan Dalam Filter Ini
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Tim redaksi Tamparan Anak Muda sedang merampungkan materi
              investigasi untuk sub-topik ini. Silakan kembali ke katalog lengkap
              kategori {category.title}.
            </p>
            <Link
              href={`/kategori/${category.slug}`}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md"
              style={{ backgroundColor: catColor }}
            >
              <ArrowLeft size={14} />
              <span>Tampilkan Semua Laporan {category.title}</span>
            </Link>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. CROSS-DOSSIER SWITCHER (JELAJAHI DOSIR LAINNYA)                         */}
      {/* ========================================================================= */}
      <section className="border-t border-border bg-muted/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                <Layers size={14} />
                <span>ARSIP LINTAS DOSIR</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Jelajahi Sudut Pandang Lain
              </h2>
            </div>
            <Link
              href="/kategori"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Lihat Indeks Semua Kategori</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {otherCategories.map((other) => {
              const otherDossier = CATEGORY_EDITORIAL_PROFILES[other.slug] || {
                dossierNum: '00',
              };

              return (
                <Link
                  key={other.id}
                  href={`/kategori/${other.slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-border/80 hover:shadow-md hover:-translate-y-1"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: other.color }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs font-mono text-muted-foreground">
                      <span>SEKSI {otherDossier.dossierNum}</span>
                      <ArrowRight
                        size={13}
                        className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1"
                        style={{ color: other.color }}
                      />
                    </div>
                    <h3
                      className="font-display text-lg font-bold transition-colors group-hover:opacity-90 mb-1.5"
                      style={{ color: other.color }}
                    >
                      {other.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {other.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
                    <span>Buka Arsip</span>
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: other.color }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
