import Link from 'next/link';
import { CalendarClock, Sparkles, ArrowRight } from 'lucide-react';
import type { SeriesConfig } from '@/content/config';

interface ComingSoonSeriesProps {
  series: Array<SeriesConfig & { hasPosts: boolean }>;
}

function formatExpectedDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ComingSoonSeries({ series }: ComingSoonSeriesProps) {
  if (!series || series.length === 0) return null;

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="font-display text-sm font-bold text-primary">05</span>
              <div className="h-px w-24 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Coming Soon
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Seri Berikutnya
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

        <div className="grid gap-6 md:grid-cols-2">
          {series.map((item) => (
            <Link
              key={item.id}
              href={`/seri/${item.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-secondary/30 p-6 transition-all hover:border-primary/30 md:p-8"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <CalendarClock size={12} />
                  Coming Soon
                </span>
                {item.expectedParts && (
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    ~{item.expectedParts} bagian
                  </span>
                )}
              </div>

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

              <div className="mt-auto flex items-center justify-between pt-4">
                {item.expectedDate && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarClock size={14} />
                    Rilis {formatExpectedDate(item.expectedDate)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all group-hover:gap-2">
                  Lihat detail
                  <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>

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
