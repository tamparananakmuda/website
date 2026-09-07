import Link from 'next/link';
import { ArrowUpRight, ChevronRight, FileText } from 'lucide-react';
import type { Category } from '@/lib/db/schema';

export interface TopicCategoryItem extends Category {
  articleCount?: number;
  subcategoriesList?: Array<{ title: string; slug: string }>;
}

interface TopicsProps {
  categories: TopicCategoryItem[];
  articleCounts?: Record<string, number>;
}

interface EditorialSectorMeta {
  sectorNum: string;
  hookQuestion: string;
  scopeSummary: string;
  keyPillars: string[];
}

const SECTOR_EDITORIAL_DATA: Record<string, EditorialSectorMeta> = {
  uang: {
    sectorNum: '06',
    hookQuestion: 'Kenapa makin hemat tetap terasa kalah dari kenaikan harga kebutuhan dasar?',
    scopeSummary:
      'Membedah unit economics kelas menengah, inflasi riil sandang-pangan-papan, jebakan utang konsumtif, dan sistem finansial yang didesain agar anak muda terus membayar bunga.',
    keyPillars: ['Biaya Hidup Riil', 'Jebakan Utang', 'Investasi Rasional', 'Daya Beli'],
  },
  karier: {
    sectorNum: '03',
    hookQuestion: 'Bukan kurang kerja keras, tapi salah membaca posisi tawar dan aturan mainnya.',
    scopeSummary:
      'Dekonstruksi politik kantor, eksploitasi berkedok loyalitas, taktik negosiasi kompensasi, dan cara membangun nilai profesional yang tidak bisa digantikan.',
    keyPillars: ['Negosiasi Gaji', 'Politik Kantor', 'Burnout Struktural', 'Daya Tawar'],
  },
  kehidupan: {
    sectorNum: '04',
    hookQuestion: 'Hal-hal paling menentukan di dunia nyata yang tidak pernah diajarkan di sekolah.',
    scopeSummary:
      'Dinamika pertemanan dewasa, kesepian di era hiper-terhubung, relasi keluarga, dan navigasi krisis kedewasaan (adulting) tanpa kehilangan arah.',
    keyPillars: ['Krisis Adulting', 'Pertemanan Dewasa', 'Koneksi Nyata', 'Ekspektasi Sosial'],
  },
  bisnis: {
    sectorNum: '01',
    hookQuestion: 'Membangun bisnis dari arus kas riil yang berkelanjutan, bukan dari mimpi investor.',
    scopeSummary:
      'Investigasi unit economics, realitas solo founder lokal, jebakan ilusi bakar uang, dan cara menguji produk langsung ke pasar tanpa cerita dongeng startup.',
    keyPillars: ['Unit Economics', 'Solo Founder', 'Cashflow Riil', 'Validasi Pasar'],
  },
  teknologi: {
    sectorNum: '02',
    hookQuestion: 'Kuasai alatnya secara rasional, atau caramu berpikir yang dikendalikan algoritmanya.',
    scopeSummary:
      'Bedah algoritma rekomendasi media sosial, penetrasi AI di dunia kerja, kedaulatan data pribadi, dan mempertahankan fokus di tengah banjir distorsi digital.',
    keyPillars: ['Ekonomi Atensi', 'AI di Dunia Kerja', 'Kedaulatan Data', 'Alat vs Hype'],
  },
  mindset: {
    sectorNum: '05',
    hookQuestion: 'Cara pikir yang jernih menentukan cara hidup yang tahan terhadap guncangan.',
    scopeSummary:
      'Membongkar keputusasaan doomerism, jebakan delulu, dan racun toxic positivity. Membangun fondasi mental tangguh yang berpijak pada fakta objektif.',
    keyPillars: ['Anti-Doomerism', 'Stoikisme Praktis', 'Disiplin Mental', 'Fokus Mendalam'],
  },
};

export function Topics({ categories, articleCounts = {} }: TopicsProps) {
  if (!categories || categories.length === 0) return null;

  // Ensure categories are ordered by editorial sector priority: Uang, Karier, Kehidupan, Bisnis, Teknologi, Mindset
  const preferredOrder = ['uang', 'karier', 'kehidupan', 'bisnis', 'teknologi', 'mindset'];
  const sortedCategories = [...categories].sort((a, b) => {
    const idxA = preferredOrder.indexOf(a.slug);
    const idxB = preferredOrder.indexOf(b.slug);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  const uangCategory = sortedCategories.find((c) => c.slug === 'uang');
  const karierCategory = sortedCategories.find((c) => c.slug === 'karier');
  const kehidupanCategory = sortedCategories.find((c) => c.slug === 'kehidupan');
  const bisnisCategory = sortedCategories.find((c) => c.slug === 'bisnis');
  const teknologiCategory = sortedCategories.find((c) => c.slug === 'teknologi');
  const mindsetCategory = sortedCategories.find((c) => c.slug === 'mindset');

  return (
    <section className="border-t border-border bg-card/40 py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-16">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">02</span>
              <div className="h-px w-20 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Sektor Investigasi
              </span>
            </div>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
              Enam Sektor. Menjawab &ldquo;Kenapa&rdquo;, Bukan Sekadar &ldquo;Apa&rdquo;.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Kami tidak menulis tips generik 5 menit. Kami membedah realitas ekonomi, psikologi
              sosial, dan struktur sistemik yang menuntut kamu hidup di dalamnya.
            </p>
          </div>
          <Link
            href="/kategori"
            prefetch={false}
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-80 sm:inline-flex"
          >
            <span>Buka seluruh indeks sektor</span>
            <ChevronRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12 lg:gap-6">
          {/* 1. UANG - Dominant Large Feature Bento (col-span-12 lg:col-span-8) */}
          {uangCategory && (
            <BentoCard
              category={uangCategory}
              count={articleCounts[uangCategory.slug] ?? 0}
              className="md:col-span-12 lg:col-span-8"
              isFeatured
            />
          )}

          {/* 2. KARIER - Tall Bento Card (col-span-12 lg:col-span-4) */}
          {karierCategory && (
            <BentoCard
              category={karierCategory}
              count={articleCounts[karierCategory.slug] ?? 0}
              className="md:col-span-12 lg:col-span-4"
            />
          )}

          {/* 3. KEHIDUPAN - Standard Bento (col-span-12 sm:col-span-6 lg:col-span-4) */}
          {kehidupanCategory && (
            <BentoCard
              category={kehidupanCategory}
              count={articleCounts[kehidupanCategory.slug] ?? 0}
              className="md:col-span-6 lg:col-span-4"
            />
          )}

          {/* 4. BISNIS - Standard Bento (col-span-12 sm:col-span-6 lg:col-span-4) */}
          {bisnisCategory && (
            <BentoCard
              category={bisnisCategory}
              count={articleCounts[bisnisCategory.slug] ?? 0}
              className="md:col-span-6 lg:col-span-4"
            />
          )}

          {/* 5. TEKNOLOGI - Standard Bento (col-span-12 sm:col-span-12 lg:col-span-4) */}
          {teknologiCategory && (
            <BentoCard
              category={teknologiCategory}
              count={articleCounts[teknologiCategory.slug] ?? 0}
              className="md:col-span-12 lg:col-span-4"
            />
          )}

          {/* 6. MINDSET - Full-Width Panoramic Bento (col-span-12) */}
          {mindsetCategory && (
            <BentoCard
              category={mindsetCategory}
              count={articleCounts[mindsetCategory.slug] ?? 0}
              className="md:col-span-12"
              isPanoramic
            />
          )}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/kategori"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <span>Buka seluruh indeks 6 sektor</span>
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

interface BentoCardProps {
  category: TopicCategoryItem;
  count: number;
  className?: string;
  isFeatured?: boolean;
  isPanoramic?: boolean;
}

function BentoCard({
  category,
  count,
  className = '',
  isFeatured = false,
  isPanoramic = false,
}: BentoCardProps) {
  const editorial = SECTOR_EDITORIAL_DATA[category.slug] ?? {
    sectorNum: '00',
    hookQuestion: category.description || 'Analisis kritis dan investigasi mendalam.',
    scopeSummary: category.description || '',
    keyPillars: [],
  };

  return (
    <Link
      href={`/kategori/${category.slug}`}
      prefetch={false}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/90 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl md:p-8 ${className}`}
    >
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20 md:h-64 md:w-64"
        style={{ backgroundColor: category.color }}
        aria-hidden="true"
      />

      {/* Top Meta Bar */}
      <div>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-6 items-center rounded-md px-2 font-display text-xs font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              DOSIR {editorial.sectorNum}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs font-medium text-muted-foreground">
              {category.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-125"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-border/80 bg-secondary/50 text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>

        {/* Title & Tagline */}
        <div className={isPanoramic ? 'max-w-4xl' : ''}>
          <h3 className="font-display text-2xl font-medium tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-3xl">
            {category.title}
          </h3>
          <p
            className={`mt-2 font-display font-medium leading-snug tracking-tight text-foreground/90 ${
              isFeatured ? 'text-lg md:text-xl' : 'text-base md:text-lg'
            }`}
          >
            &ldquo;{editorial.hookQuestion}&rdquo;
          </p>
        </div>

        {/* Scope Description */}
        <p
          className={`mt-3 text-sm leading-relaxed text-muted-foreground ${
            isPanoramic ? 'max-w-3xl' : ''
          }`}
        >
          {editorial.scopeSummary}
        </p>

        {/* Key Topic Pillars */}
        {editorial.keyPillars.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5 pt-2">
            {editorial.keyPillars.map((pillar) => (
              <span
                key={pillar}
                className="inline-flex items-center rounded-full border border-border/60 bg-secondary/40 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors group-hover:border-border group-hover:text-foreground"
              >
                {pillar}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FileText size={13} aria-hidden="true" />
          <span>
            {count > 0 ? (
              <>
                <strong className="font-semibold text-foreground">{count}</strong> Laporan Tersedia
              </>
            ) : (
              'Arsip Terbuka'
            )}
          </span>
        </div>

        <span className="font-medium text-primary transition-opacity group-hover:underline">
          Akses Sektor &rarr;
        </span>
      </div>
    </Link>
  );
}
