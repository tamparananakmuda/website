import Link from 'next/link';
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
    <section className="border-y border-border py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
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
          <div
            key={s.seriesSlug}
            className="rounded-2xl border border-border bg-secondary/30 p-6 md:p-8"
          >
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {s.posts.length}
                </span>
                <div>
                  <h3 className="text-xl font-bold tracking-tight md:text-2xl">
                    {s.seriesTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {s.posts.length} bagian seri lengkap
                  </p>
                </div>
              </div>
              <Link
                href={`/seri/${s.seriesSlug}`}
                className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
              >
                Baca seri lengkap
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] md:gap-6">
              {s.posts.map((post, idx) => {
                const order = post.seriesOrder ?? idx + 1;
                return (
                  <Link
                    key={post.id}
                    href={`/artikel/${post.slug}`}
                    className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:border-primary/30 md:w-[320px]"
                  >
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
                      {post.ogCardUrl || post.ogImageUrl ? (
                        <img
                          src={post.ogCardUrl || post.ogImageUrl || ''}
                          alt={post.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-sm font-bold text-primary backdrop-blur-sm">
                        {order}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      {post.category && (
                        <span
                          className="mb-2 text-xs font-medium"
                          style={{ color: post.category.color }}
                        >
                          {post.category.title}
                        </span>
                      )}
                      <h4 className="mb-2 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">
                        {post.title}
                      </h4>
                      {post.excerpt && (
                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Bagian {order} dari {s.posts.length}</span>
                        <span>&middot;</span>
                        <span>{post.readingTime} menit baca</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
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
