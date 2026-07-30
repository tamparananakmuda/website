import { series as seriesConfig, getCategoryById } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowRight, Layers, Clock, CalendarClock, Sparkles } from 'lucide-react';

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

function formatExpectedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function SeriesPage() {
  const seriesWithCounts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 100);
      const category = posts[0]?.categoryId ? getCategoryById(posts[0].categoryId) : null;
      return { ...s, postCount: posts.length, category, posts };
    })
  );
  // Published: has at least 1 published article (regardless of config status)
  const publishedSeries = seriesWithCounts.filter((s) => s.postCount > 0);
  // Coming soon: config says coming-soon AND no published articles yet
  const comingSoonSeries = seriesWithCounts.filter((s) => s.status === 'coming-soon' && s.postCount === 0);

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

      {/* Published Series */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        {publishedSeries && publishedSeries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {publishedSeries.map((item) => {
              const categoryColor = item.category?.color || '#D13A3A';

              return (
                <Link
                  key={item.id}
                  href={`/seri/${item.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-foreground/20 hover:shadow-lg"
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ backgroundColor: categoryColor }}
                  />

                  <div className="flex flex-1 flex-col p-6 md:p-8">
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

                    <h2 className="mb-3 font-display text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-2xl">
                      {item.title}
                    </h2>

                    {item.description && (
                      <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}

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

      {/* Coming Soon Series */}
      {comingSoonSeries.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 md:pb-24">
          <div className="mb-8 flex items-center gap-3">
            <Sparkles size={20} className="text-primary" />
            <h2 className="font-display text-xl font-bold text-foreground md:text-2xl">
              Seri Berikutnya
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {comingSoonSeries.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-card/50 transition-all hover:border-primary/30"
              >
                {/* Coming soon badge */}
                <div className="flex items-center justify-between px-6 pt-5 md:px-8 md:pt-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                    <CalendarClock size={12} />
                    Coming Soon
                  </span>
                  {item.expectedParts && (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Layers size={13} />
                      ~{item.expectedParts} bagian
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8 md:pt-6">
                  <h3 className="mb-3 font-display text-xl font-bold leading-snug text-foreground/90 md:text-2xl">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}

                  {item.teaser && (
                    <p className="mb-5 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-medium italic text-primary/90">
                      &ldquo;{item.teaser}&rdquo;
                    </p>
                  )}

                  <div className="mt-auto flex items-center gap-2 pt-4">
                    {item.expectedDate && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarClock size={14} />
                        Rilis {formatExpectedDate(item.expectedDate)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter nudge */}
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center md:p-8">
            <p className="text-sm text-muted-foreground">
              Mau jadi yang pertama tahu saat seri baru rilis?
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe Newsletter
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
