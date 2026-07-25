import { series as seriesConfig, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowRight, Layers, Clock } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
  title: 'Seri Konten',
  description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  keywords: ['seri artikel', 'konten mendalam', 'seri gen z', 'tamparan anak muda seri'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/seri`,
    title: 'Seri Konten - Tamparan Anak Muda',
    description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Seri Konten - Tamparan Anak Muda',
    description: 'Seri artikel mendalam TAMPARAN ANAK MUDA. Topik yang dibahas tuntas dalam beberapa bagian.',
  },
};

export default async function SeriesPage() {
  const seriesWithCounts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 100);
      const category = posts[0]?.categoryId ? getCategoryById(posts[0].categoryId) : null;
      return { ...s, postCount: posts.length, category, posts };
    })
  );
  const series = seriesWithCounts.filter((s) => s.postCount > 0);

  return (
    <main>
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Seri', href: '/seri' },
      ]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.10]"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, hsl(0 63% 52%) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(0 63% 52% / 0.3) 0%, transparent 40%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-primary md:text-sm md:tracking-[0.3em]">
            Investigasi Mendalam
          </p>
          <h1 className="mb-6 max-w-2xl font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl lg:leading-[1.08]">
            Seri Konten
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Kumpulan artikel yang saling berhubungan, membahas satu tema secara mendalam dari berbagai sudut.
          </p>
        </div>
      </section>

      {/* Series Cards */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        {series && series.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {series.map((item) => {
              const categoryColor = item.category?.color || '#D13A3A';
              const firstPost = item.posts[0];

              return (
                <Link
                  key={item.id}
                  href={`/seri/${item.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  {/* Top accent bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: categoryColor }}
                  />

                  <div className="flex flex-1 flex-col p-6 md:p-8">
                    {/* Category + count */}
                    <div className="mb-4 flex items-center gap-3">
                      {item.category && (
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white"
                          style={{ backgroundColor: categoryColor }}
                        >
                          {item.category.title}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Layers size={13} />
                        {item.postCount} bagian
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="mb-3 font-display text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {item.title}
                    </h2>

                    {/* Description */}
                    {item.description && (
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span className="text-xs text-muted-foreground/70">
                        Mulai dari Part 01
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                        Baca Seri
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Layers size={40} className="mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">Belum ada seri konten.</p>
          </div>
        )}
      </section>
    </main>
  );
}
