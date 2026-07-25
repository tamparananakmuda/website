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

  return (
    <main>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Kategori', href: '/kategori' }]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(circle at 25% 20%, hsl(0 80% 60%) 0%, transparent 40%), radial-gradient(circle at 75% 80%, hsl(220 80% 60% / 0.3) 0%, transparent 40%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center md:py-28 lg:py-32">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-primary md:text-sm md:tracking-[0.3em]">
            Topik &amp; Pillar
          </p>
          <h1 className="mb-6 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            Kategori
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Pilih topik yang paling relevan dengan apa yang sedang kamu pikirkan.
          </p>
        </div>
      </section>

      {/* Category Cards */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        {categories && categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/kategori/${category.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
              >
                {/* Top accent bar with category color */}
                <div className="h-1.5 w-full" style={{ backgroundColor: category.color }} />

                <div className="flex flex-1 flex-col p-6 md:p-7">
                  {/* Category name */}
                  <h2
                    className="mb-2 font-display text-xl font-bold leading-snug transition-opacity group-hover:opacity-80 md:text-2xl"
                    style={{ color: category.color }}
                  >
                    {category.title}
                  </h2>

                  {/* Description */}
                  {category.description && (
                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
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
                            className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers size={40} className="mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Belum ada kategori.</p>
          </div>
        )}
      </section>
    </main>
  );
}
