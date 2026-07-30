import { getCategoriesWithSubcategories } from '@/lib/db/queries/categories';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowRight, Layers } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Kategori',
  description: 'Jelajahi semua topik TAMPARAN ANAK MUDA: mindset, karier, keuangan, teknologi, kehidupan, dan bisnis.',
  keywords: ['kategori artikel', 'topik gen z', 'mindset', 'karier', 'keuangan', 'teknologi', 'kehidupan', 'bisnis', 'tamparan anak muda'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/kategori`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/kategori`,
    title: 'Kategori - Tamparan Anak Muda',
    description: 'Jelajahi semua topik TAMPARAN ANAK MUDA: mindset, karier, keuangan, teknologi, kehidupan, dan bisnis.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kategori - Tamparan Anak Muda',
    description: 'Jelajahi semua topik TAMPARAN ANAK MUDA: mindset, karier, keuangan, teknologi, kehidupan, dan bisnis.',
  },
};

export default async function CategoriesPage() {
  const categories = await getCategoriesWithSubcategories();
  const totalSubcategories = categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);

  return (
    <main className="bg-background dark:bg-[#0A0A0A]">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Kategori', href: '/kategori' }]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background dark:bg-[#0A0A0A]" />
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: 'radial-gradient(ellipse 80% 50% at 15% 0%, hsl(0 80% 60%) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 85% 100%, hsl(220 80% 60% / 0.25) 0%, transparent 50%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'linear-gradient(hsl(0 80% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 80% 60%) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background dark:to-[#0A0A0A]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28 lg:py-36">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border dark:border-white/10 bg-muted/50 dark:bg-white/[0.03] px-4 py-1.5">
            <Layers size={14} className="text-muted-foreground dark:text-white/50" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground dark:text-white/60">Topik &amp; Pillar</span>
          </div>

          <h1 className="mb-8 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground dark:text-white md:text-5xl lg:text-6xl lg:leading-[1.02]">
            Kategori
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground dark:text-white/50 md:text-xl">
            Pilih topik yang paling relevan dengan apa yang sedang kamu pikirkan.
          </p>

          {categories.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-muted-foreground dark:text-white/40" />
                <div>
                  <div className="font-display text-2xl font-bold text-foreground dark:text-white">{categories.length}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 dark:text-white/30">Kategori</div>
                </div>
              </div>
              <div className="h-8 w-px bg-border dark:bg-white/10" />
              <div className="flex items-center gap-3">
                <ArrowRight size={18} className="text-muted-foreground dark:text-white/40" />
                <div>
                  <div className="font-display text-2xl font-bold text-foreground dark:text-white">{totalSubcategories}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70 dark:text-white/30">Sub-topik</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Category Cards */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        {categories && categories.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border dark:border-white/[0.06] bg-card dark:bg-white/[0.015] p-6 transition-all hover:border-foreground/20 dark:hover:border-white/[0.12] hover:bg-muted/50 dark:hover:bg-white/[0.03] md:p-7"
              >
                {/* Accent bar */}
                <div
                  className="absolute left-0 top-0 h-full w-0.5 opacity-0 transition-all group-hover:opacity-100"
                  style={{ backgroundColor: category.color }}
                />

                {/* Category name */}
                <h2
                  className="mb-2 font-display text-xl font-bold leading-snug transition-opacity group-hover:opacity-90 md:text-2xl"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h2>

                {/* Description */}
                {category.description && (
                  <p className="mb-5 text-sm leading-relaxed text-muted-foreground dark:text-white/40">
                    {category.description}
                  </p>
                )}

                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {category.subcategories
                      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                      .map((sub) => (
                        <span
                          key={sub.id}
                          className="rounded border border-border dark:border-white/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70 dark:text-white/30"
                        >
                          {sub.title}
                        </span>
                      ))}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-auto flex items-center pt-4">
                  <span
                    className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2"
                    style={{ color: category.color }}
                  >
                    Jelajahi
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border dark:border-white/[0.06] bg-muted/30 dark:bg-white/[0.02]">
              <Layers size={28} className="text-muted-foreground/50 dark:text-white/30" />
            </div>
            <p className="font-display text-lg text-muted-foreground dark:text-white/40">Belum ada kategori.</p>
          </div>
        )}
      </section>
    </main>
  );
}
