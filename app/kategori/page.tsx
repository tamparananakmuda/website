import { getCategoriesWithSubcategories } from '@/lib/db/queries/categories';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

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
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Kategori', href: '/kategori' }]} />
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">
          Kategori
        </h1>
        <p className="text-lg text-muted-foreground">
          Pilih topik yang paling relevan dengan apa yang sedang kamu pikirkan.
        </p>
      </header>

      {categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent"
            >
              <Link href={`/kategori/${category.slug}`}>
                <h2
                  className="mb-2 text-xl font-bold transition-colors group-hover:text-primary"
                  style={{ color: category.color }}
                >
                  {category.title}
                </h2>
              </Link>
              {category.description && (
                <p className="mb-4 text-sm text-muted-foreground">{category.description}</p>
              )}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category.subcategories
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/kategori/${category.slug}?pillar=${sub.slug}`}
                        className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {sub.title}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Belum ada kategori.</p>
      )}
    </main>
  );
}
