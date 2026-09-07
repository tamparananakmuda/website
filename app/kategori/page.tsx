import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getCategoriesWithSubcategories } from '@/lib/db/queries/categories';
import { getAllPublishedPostsWithRelations } from '@/lib/db/queries/posts';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Compass,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import type { PostWithRelations } from '@/lib/db/schema';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Indeks Kategori',
  description:
    'Jelajahi seluruh arsip investigasi dan esai editorial Tamparan Anak Muda lintas 6 sektor: Bisnis, Teknologi, Karier, Kehidupan, Mindset, dan Uang.',
  keywords: [
    'kategori tamparan anak muda',
    'indeks artikel',
    'jurnalisme kritis',
    'analisis gen z',
    'bisnis riil',
    'teknologi algoritma',
    'karier korporat',
    'kehidupan modern',
    'mindset rasional',
    'keuangan anak muda',
  ],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/kategori`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/kategori`,
    title: 'Indeks Kategori - Tamparan Anak Muda',
    description:
      'Jelajahi seluruh arsip investigasi dan esai editorial Tamparan Anak Muda lintas 6 sektor: Bisnis, Teknologi, Karier, Kehidupan, Mindset, dan Uang.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Indeks Kategori - Tamparan Anak Muda',
    description:
      'Jelajahi seluruh arsip investigasi dan esai editorial Tamparan Anak Muda lintas 6 sektor: Bisnis, Teknologi, Karier, Kehidupan, Mindset, dan Uang.',
  },
};

interface CategoryEditorialMeta {
  sectorNum: string;
  tagline: string;
  scopeSummary: string;
}

const CATEGORY_EDITORIAL_META: Record<string, CategoryEditorialMeta> = {
  bisnis: {
    sectorNum: '01',
    tagline: 'Bangun dari nol, bukan dari mimpi.',
    scopeSummary:
      'Investigasi unit economics, realitas startup lokal, dan dekonstruksi ilusi entrepreneurship instan.',
  },
  teknologi: {
    sectorNum: '02',
    tagline: 'Tools, bukan hype.',
    scopeSummary:
      'Bedah algoritma media sosial, penetrasi AI di tempat kerja, kedaulatan data, dan literasi digital rasional.',
  },
  karier: {
    sectorNum: '03',
    tagline: 'Bukan ikut arus, tapi cari arah.',
    scopeSummary:
      'Navigasi politik kantor, eksploitasi berkedok loyalitas, negosiasi gaji, dan daya tawar profesional.',
  },
  kehidupan: {
    sectorNum: '04',
    tagline: 'Hal-hal yang tidak diajarkan sekolah.',
    scopeSummary:
      'Relasi sosial, dinamika keluarga, krisis kedewasaan (adulting), dan tekanan hidup modern.',
  },
  mindset: {
    sectorNum: '05',
    tagline: 'Cara pikir yang menentukan cara hidup.',
    scopeSummary:
      'Dekonstruksi doomerism, jebakan delulu, ilusi hustle culture, dan ketahanan mental berbasis fakta.',
  },
  uang: {
    sectorNum: '06',
    tagline: 'Kelola, tumbuhkan, pahami.',
    scopeSummary:
      'Bedah inflasi riil, biaya sewa rumah, jebakan utang konsumtif, dan literasi finansial bertahan hidup.',
  },
};

const DEFAULT_CATEGORY_COLORS: Record<string, string> = {
  bisnis: '#7B2DB0',
  teknologi: '#6040D9',
  karier: '#2563B5',
  kehidupan: '#1A8050',
  mindset: '#D13A3A',
  uang: '#A66315',
};

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default async function KategoriIndexPage() {
  const [categoriesData, allPosts] = await Promise.all([
    getCategoriesWithSubcategories(),
    getAllPublishedPostsWithRelations(),
  ]);

  // Map posts per category
  const postsByCategory = new Map<string, PostWithRelations[]>();
  categoriesData.forEach((cat) => {
    postsByCategory.set(cat.slug, []);
  });

  allPosts.forEach((post) => {
    if (post.category && postsByCategory.has(post.category.slug)) {
      postsByCategory.get(post.category.slug)?.push(post);
    }
  });

  // Sort posts descending by date
  postsByCategory.forEach((postsList) => {
    postsList.sort((a, b) => {
      const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return timeB - timeA;
    });
  });

  // Calculate aggregated stats
  const totalPostsCount = allPosts.length;
  const totalSubcategoriesCount = categoriesData.reduce(
    (acc, cat) => acc + (cat.subcategories?.length || 0),
    0
  );
  const totalEstimatedMinutes = allPosts.reduce(
    (acc, p) => acc + (p.readingTime || 5),
    0
  );
  const totalReadingHours = Math.round(totalEstimatedMinutes / 60);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  return (
    <main className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Schema Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'Kategori', href: '/kategori' },
        ]}
      />
      {/* CollectionPage JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Indeks Kategori - Tamparan Anak Muda',
            description:
              'Jelajahi seluruh arsip investigasi dan esai editorial Tamparan Anak Muda lintas 6 sektor: Bisnis, Teknologi, Karier, Kehidupan, Mindset, dan Uang.',
            url: `${siteUrl}/kategori`,
            inLanguage: 'id-ID',
            isPartOf: {
              '@type': 'WebSite',
              name: 'TAMPARAN ANAK MUDA',
              url: siteUrl,
            },
            hasPart: categoriesData.map((c) => ({
              '@type': 'WebPage',
              name: c.title,
              url: `${siteUrl}/kategori/${c.slug}`,
              description: c.description || undefined,
            })),
          }),
        }}
      />

      {/* AMBIENT TOP LIGHT */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(225,29,72,0.08),transparent_70%)] -z-10"
        aria-hidden="true"
      />

      {/* HERO MASTHEAD */}
      <header className="border-b border-border/70 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl">
            {/* Editorial Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/70 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-foreground/80 mb-5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono uppercase tracking-wider text-[11px]">
                DIREKTORI LIPUTAN • TAMPARAN ANAK MUDA
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.08] mb-4">
              Eksplorasi Berdasarkan Kategori
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
              Jurnalisme kritis, esai mendalam, dan investigasi data yang dikurasi ke dalam enam sektor realitas kehidupan anak muda Indonesia. Tanpa basa-basi motivasi, langsung ke akar persoalan.
            </p>

            {/* Metrics Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground/85">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">6 Sektor Investigasi</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                <FileText className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{totalPostsCount} Laporan Terbit</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">±{totalReadingHours} Jam Bacaan Kritis</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 shadow-sm">
                <Compass className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium">{totalSubcategoriesCount} Sub-Topik Riil</span>
              </div>
            </div>
          </div>

          {/* QUICK CATEGORY JUMP STRIP (Mobile Friendly Horizontal Scroll) */}
          <div className="mt-10 pt-6 border-t border-border/60">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Lompat Cepat ke Sektor:
              </span>
              <span className="text-xs text-muted-foreground sm:hidden">
                Geser ke samping →
              </span>
            </div>
            <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 snap-x">
              {categoriesData.map((cat) => {
                const count = postsByCategory.get(cat.slug)?.length || 0;
                const catColor = cat.color || DEFAULT_CATEGORY_COLORS[cat.slug] || '#E63946';

                return (
                  <a
                    key={cat.id}
                    href={`#sektor-${cat.slug}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-3.5 py-2 text-xs font-display font-semibold text-foreground hover:border-foreground/30 hover:bg-accent/50 transition-all flex-shrink-0 shadow-sm"
                  >
                    <span
                      className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: catColor }}
                    />
                    <span>{cat.title}</span>
                    <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
                      {count}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* TOP 6 CATEGORIES OVERVIEW GRID (High-level cards) */}
      <section className="py-12 sm:py-16 border-b border-border/70 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-1">
                IKHTISAR ENAM PILAR
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                Pilih Sektor Sesuai Kebutuhanmu
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {categoriesData.map((cat) => {
              const posts = postsByCategory.get(cat.slug) || [];
              const catColor = cat.color || DEFAULT_CATEGORY_COLORS[cat.slug] || '#E63946';
              const editorialMeta = CATEGORY_EDITORIAL_META[cat.slug] || {
                sectorNum: '00',
                tagline: cat.description || '',
                scopeSummary: '',
              };

              return (
                <div
                  key={cat.id}
                  className="group relative rounded-2xl border border-border bg-card p-6 flex flex-col justify-between transition-all duration-300 hover:border-foreground/30 hover:shadow-md"
                >
                  {/* Accent Top Line */}
                  <div
                    className="absolute top-0 left-6 right-6 h-[2px] rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4"
                    style={{ backgroundColor: catColor }}
                  />

                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        SEKTOR {editorialMeta.sectorNum}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground rounded-md bg-muted px-2 py-0.5">
                        {posts.length} Laporan
                      </span>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/kategori/${cat.slug}`}
                      className="font-display text-2xl font-extrabold text-foreground group-hover:text-primary transition-colors block"
                    >
                      {cat.title}
                    </Link>

                    {/* Tagline */}
                    <p className="text-xs font-display font-semibold italic text-foreground/80 mt-1 mb-2">
                      &ldquo;{editorialMeta.tagline}&rdquo;
                    </p>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {cat.description || editorialMeta.scopeSummary}
                    </p>

                    {/* Subcategories tags */}
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {cat.subcategories.slice(0, 3).map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/kategori/${cat.slug}?pillar=${sub.slug}`}
                            className="text-[11px] font-mono text-muted-foreground hover:text-foreground bg-muted/60 hover:bg-muted px-2 py-0.5 rounded transition-colors"
                          >
                            #{sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action */}
                  <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                    <Link
                      href={`#sektor-${cat.slug}`}
                      className="text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Lihat Cuplikan</span>
                      <ArrowRight size={12} />
                    </Link>
                    <Link
                      href={`/kategori/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-primary hover:underline"
                    >
                      <span>Buka Sektor</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INDIVIDUAL CATEGORY EDITORIAL SHOWCASES (Open Magazine Flow) */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-20">
        <div className="space-y-20 sm:space-y-28">
          {categoriesData.map((cat, idx) => {
            const posts = postsByCategory.get(cat.slug) || [];
            const featuredPost = posts[0];
            const secondaryPosts = posts.slice(1, 4);
            const catColor = cat.color || DEFAULT_CATEGORY_COLORS[cat.slug] || '#E63946';
            const editorialMeta = CATEGORY_EDITORIAL_META[cat.slug] || {
              sectorNum: `0${idx + 1}`,
              tagline: cat.description || '',
              scopeSummary: '',
            };

            return (
              <section
                key={cat.id}
                id={`sektor-${cat.slug}`}
                className="scroll-mt-24"
              >
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-border/80">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: catColor }}
                      />
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground font-bold">
                        SEKTOR {editorialMeta.sectorNum} • ARSIP REDAKSI
                      </span>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
                        <Link
                          href={`/kategori/${cat.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {cat.title}
                        </Link>
                      </h2>
                      <span className="font-mono text-sm text-muted-foreground">
                        ({posts.length} Laporan)
                      </span>
                    </div>

                    <p className="mt-1.5 text-sm sm:text-base text-muted-foreground max-w-2xl">
                      {editorialMeta.scopeSummary || cat.description}
                    </p>
                  </div>

                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-display font-bold text-primary hover:underline flex-shrink-0 self-start sm:self-auto"
                  >
                    <span>Lihat Semua Laporan {cat.title}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Section Content: Lead Story (Left) + Secondary List (Right) */}
                {posts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-card/40">
                    <p className="text-sm text-muted-foreground">
                      Laporan untuk sektor {cat.title} sedang dalam proses riset dan kurasi redaksi.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEAD STORY (7 Cols Desktop) */}
                    {featuredPost && (
                      <article className="lg:col-span-7 group">
                        <Link
                          href={`/story/${featuredPost.slug}`}
                          className="block overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:border-foreground/30 hover:shadow-md transition-all duration-300"
                        >
                          {/* Image with strictly proportional 16:9 ratio */}
                          <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                            <Image
                              src={
                                featuredPost.coverImageUrl ||
                                featuredPost.ogFeatureUrl ||
                                featuredPost.ogCardUrl ||
                                featuredPost.ogImageUrl ||
                                'https://cdn.tamparananakmuda.com/og/homepage-feature.webp'
                              }
                              alt={featuredPost.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 58vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              priority={idx < 2}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                            {/* Badge Overlay */}
                            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                              {featuredPost.subcategory ? (
                                <span
                                  className="font-mono text-[11px] font-semibold text-white px-2.5 py-1 rounded-full shadow-sm"
                                  style={{ backgroundColor: catColor }}
                                >
                                  {featuredPost.subcategory.title}
                                </span>
                              ) : (
                                <span
                                  className="font-mono text-[11px] font-semibold text-white px-2.5 py-1 rounded-full shadow-sm"
                                  style={{ backgroundColor: catColor }}
                                >
                                  {cat.title}
                                </span>
                              )}
                              <span className="font-mono text-[11px] text-white/90 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                Laporan Utama
                              </span>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 font-mono">
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} />
                                {featuredPost.readingTime || 5} Menit Baca
                              </span>
                              <span>{formatDate(featuredPost.publishedAt)}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5 sm:p-6">
                            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                              {featuredPost.title}
                            </h3>

                            {featuredPost.excerpt && (
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-3">
                                {featuredPost.excerpt}
                              </p>
                            )}

                            <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs">
                              <span className="font-medium text-foreground/70">
                                Oleh {featuredPost.author?.name || 'Redaksi TAM'}
                              </span>
                              <span className="font-display font-semibold text-primary inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                                Baca Laporan Lengkap
                                <ArrowRight size={13} />
                              </span>
                            </div>
                          </div>
                        </Link>
                      </article>
                    )}

                    {/* SECONDARY STORIES LIST (5 Cols Desktop) */}
                    <div className="lg:col-span-5 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-bold">
                          Laporan Terbaru Lainnya
                        </span>
                        <Link
                          href={`/kategori/${cat.slug}`}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors font-mono"
                        >
                          Arsip ({posts.length}) →
                        </Link>
                      </div>

                      {secondaryPosts.length > 0 ? (
                        secondaryPosts.map((post) => (
                          <article key={post.id} className="group">
                            <Link
                              href={`/story/${post.slug}`}
                              className="flex items-start gap-4 p-3.5 sm:p-4 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-sm transition-all duration-200"
                            >
                              {/* Thumbnail (Strict proportional ratio, no distort) */}
                              <div className="relative w-24 h-20 sm:w-28 sm:h-20 aspect-[16/9] rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border/50">
                                <Image
                                  src={
                                    post.coverImageUrl ||
                                    post.ogCardUrl ||
                                    post.ogImageUrl ||
                                    'https://cdn.tamparananakmuda.com/og/homepage-feature.webp'
                                  }
                                  alt={post.title}
                                  fill
                                  sizes="(max-width: 640px) 100px, 120px"
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>

                              {/* Text info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 text-[11px] font-mono text-muted-foreground mb-1">
                                  {post.subcategory ? (
                                    <span className="text-foreground/80 font-medium">
                                      {post.subcategory.title}
                                    </span>
                                  ) : (
                                    <span>{cat.title}</span>
                                  )}
                                  <span>•</span>
                                  <span>{post.readingTime || 5}m baca</span>
                                </div>

                                <h4 className="font-display text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                  {post.title}
                                </h4>

                                <div className="mt-2 text-[11px] text-muted-foreground font-mono">
                                  {formatDate(post.publishedAt)}
                                </div>
                              </div>
                            </Link>
                          </article>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl border border-border bg-card text-xs text-muted-foreground">
                          Belum ada laporan sekunder tambahan di sektor ini.
                        </div>
                      )}

                      {/* Sub-Topics Pills */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pt-3 border-t border-border/60">
                          <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                            Pilar Sub-Topik:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/kategori/${cat.slug}?pillar=${sub.slug}`}
                                className="text-xs font-mono text-muted-foreground hover:text-foreground bg-muted hover:bg-accent px-2.5 py-1 rounded-md transition-colors"
                              >
                                {sub.title} →
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* EDITORIAL INTEGRITY & MANIFESTO CALLOUT (Theme-compliant) */}
      <section className="border-t border-border/80 bg-muted/20 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 lg:p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 font-mono text-xs uppercase tracking-wider text-primary">
              <ShieldCheck className="h-4 w-4" />
              <span>STANDAR INTEGRITAS EDITORIAL TAM</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              Tiga Prinsip di Balik Setiap Kategori
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
              Kami percaya anak muda Indonesia berhak mendapatkan tulisan yang memperlakukan mereka sebagai orang dewasa yang berpikir, bukan sekadar audiens yang dibuai ilusi kenyamanan.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
              <div className="rounded-2xl border border-border/80 bg-background p-4 sm:p-5 shadow-sm">
                <div className="font-mono text-xs text-primary font-bold mb-1.5">
                  01 // NON-SPONSOR BIAS
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground mb-1">
                  Bebas Pemanis Korporat
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tidak ada artikel pesanan atau advertorial terselubung. Semua analisis murni demi kepentingan pembaca muda.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background p-4 sm:p-5 shadow-sm">
                <div className="font-mono text-xs text-primary font-bold mb-1.5">
                  02 // EVIDENCE-BASED
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground mb-1">
                  Realitas Data Lapangan
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Setiap argumen ditopang oleh angka riil, studi lapangan, dan fakta sosio-ekonomi konkret, bukan motivasi kosong.
                </p>
              </div>

              <div className="rounded-2xl border border-border/80 bg-background p-4 sm:p-5 shadow-sm">
                <div className="font-mono text-xs text-primary font-bold mb-1.5">
                  03 // ACTIONABLE ROADMAP
                </div>
                <h3 className="font-display text-sm sm:text-base font-bold text-foreground mb-1">
                  Taktik Bertahan Hidup
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Kritik tanpa solusi adalah keluhan. Setiap artikel TAM dirancang agar pembaca tahu langkah taktis berikutnya.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>Baca Manifesto Redaksi Lengkap</span>
                <ArrowRight size={13} />
              </Link>
              <span className="hidden sm:inline text-border">·</span>
              <Link
                href="/donasi"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary hover:underline font-semibold"
              >
                <span>Dukung Jurnalisme Independen TAM</span>
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
