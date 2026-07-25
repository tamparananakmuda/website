import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategoryWithSubcategoriesBySlug } from '@/lib/db/queries/categories';
import { getPostsByCategorySlug } from '@/lib/db/queries/posts';
import { ArticleCard } from '@/components/article-card';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { CollectionPageSchema } from '@/components/schema/collection-page-schema';
import { ArrowLeft, FileText } from 'lucide-react';

interface CategoryPageProps {
  params: { slug: string };
}

export const revalidate = 60;

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
    title: category.title,
    description: category.description || undefined,
    keywords: [category.title, `artikel ${category.title.toLowerCase()}`, `${category.title.toLowerCase()} gen z`, 'tamparan anak muda'],
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url,
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
      siteName: 'TAMPARAN ANAK MUDA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.title} - Tamparan Anak Muda`,
      description: category.description || undefined,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryWithSubcategoriesBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const sortedSubs = (category.subcategories || []).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

  const posts = await getPostsByCategorySlug(category.slug, 12);
  const catColor = category.color || '#D13A3A';

  return (
    <main>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Kategori', href: '/kategori' }, { name: category.title, href: `/kategori/${category.slug}` }]} />
      <CollectionPageSchema
        name={category.title}
        slug={category.slug}
        description={category.description || undefined}
        items={posts.map((p) => ({ title: p.title, slug: p.slug }))}
      />

      {/* Hero */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 15%, ${catColor} 0%, transparent 50%), radial-gradient(circle at 85% 85%, ${catColor}30 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
          {/* Back link */}
          <Link
            href="/kategori"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={15} />
            Semua Kategori
          </Link>

          {/* Category badge */}
          <div className="mb-6">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: catColor }}
            >
              {category.title}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-4 max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            {category.title}
          </h1>

          {/* Description */}
          {category.description && (
            <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              {category.description}
            </p>
          )}

          {/* Pillars */}
          {sortedSubs.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wider text-white/40">Pillar:</span>
              {sortedSubs.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/kategori/${category.slug}?pillar=${sub.slug}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
                >
                  {sub.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {posts && posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText size={40} className="mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              Belum ada artikel di kategori ini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
