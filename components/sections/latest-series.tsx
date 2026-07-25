import Link from 'next/link';
import { ArticleCard } from '@/components/article-card';
import type { PostWithRelations } from '@/lib/db/schema';

interface LatestSeriesProps {
  series: Array<{
    seriesSlug: string;
    seriesTitle: string;
    posts: PostWithRelations[];
  }>;
}

export function LatestSeries({ series }: LatestSeriesProps) {
  if (!series || series.length === 0) return null;

  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="font-display text-sm font-bold text-primary">04</span>
              <div className="h-px w-24 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Seri
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Seri Terbaru
            </h2>
          </div>
          <Link
            href="/seri"
            className="hidden shrink-0 text-sm font-medium text-primary transition-opacity hover:opacity-70 sm:inline-flex sm:items-center sm:gap-2"
          >
            Lihat semua
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {series.map((s) => (
          <div key={s.seriesSlug} className="mb-12 last:mb-0">
            <div className="mb-6 flex items-center gap-3">
              <h3 className="text-xl font-bold tracking-tight">{s.seriesTitle}</h3>
              <span className="text-sm text-muted-foreground">{s.posts.length} bagian</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {s.posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={`/seri/${s.seriesSlug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
              >
                Baca seri lengkap
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        ))}

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/seri"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Lihat semua
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
