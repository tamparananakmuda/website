import Link from 'next/link';
import { CalendarClock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface SeriesPart {
  slug: string;
  title: string;
  seriesOrder: number | null;
  status: string;
  publishedAt: string;
}

interface SeriesNavigationProps {
  seriesSlug: string;
  seriesTitle: string;
  currentOrder: number;
  totalParts: number;
  allParts: SeriesPart[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function SeriesNavigation({
  seriesSlug,
  seriesTitle,
  currentOrder,
  totalParts,
  allParts,
}: SeriesNavigationProps) {
  const currentTime = new Date().toISOString();

  const sorted = [...allParts].sort(
    (a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0)
  );

  const prevPart = sorted.find((p) => p.seriesOrder === currentOrder - 1);
  const nextPart = sorted.find((p) => p.seriesOrder === currentOrder + 1);

  if (!prevPart && !nextPart) return null;

  const isPartPublished = (p: SeriesPart) => {
    return p.status === 'published' || (p.status === 'scheduled' && p.publishedAt <= currentTime);
  };

  return (
    <nav className="mx-auto max-w-3xl mt-12 border-t border-border pt-8">
      <div className="mb-4 text-center">
        <Link
          href={`/seri/${seriesSlug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
        >
          <span className="font-display">{seriesTitle}</span>
          <span className="text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">Bagian {currentOrder} dari {totalParts}</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Previous part */}
        <div>
          {prevPart && isPartPublished(prevPart) ? (
            <Link
              href={`/artikel/${prevPart.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
            >
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft size={12} />
                Bagian {prevPart.seriesOrder}
              </span>
              <span className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                {prevPart.title}
              </span>
            </Link>
          ) : prevPart ? (
            <div className="flex flex-col gap-1 rounded-xl border border-dashed border-border bg-card/50 p-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft size={12} />
                Bagian {prevPart.seriesOrder}
              </span>
              <span className="line-clamp-2 text-sm font-medium text-muted-foreground/60">
                {prevPart.title}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-transparent p-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground/40">
                <CheckCircle2 size={12} />
                Awal seri
              </span>
              <span className="text-sm text-muted-foreground/40">Ini bagian pertama</span>
            </div>
          )}
        </div>

        {/* Next part */}
        <div className="text-right">
          {nextPart && isPartPublished(nextPart) ? (
            <Link
              href={`/artikel/${nextPart.slug}`}
              className="group flex flex-col gap-1 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30"
            >
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                Bagian {nextPart.seriesOrder}
                <ArrowRight size={12} />
              </span>
              <span className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
                {nextPart.title}
              </span>
            </Link>
          ) : nextPart ? (
            <div className="flex flex-col gap-1 rounded-xl border border-dashed border-primary/20 bg-primary/[0.03] p-4">
              <span className="flex items-center justify-end gap-1.5 text-xs font-medium text-primary/70">
                <CalendarClock size={12} />
                Bagian {nextPart.seriesOrder} &middot; Coming Soon
              </span>
              <span className="line-clamp-2 text-sm font-semibold leading-snug text-foreground/70">
                {nextPart.title}
              </span>
              <span className="text-xs text-muted-foreground/60">
                Rilis {formatDate(nextPart.publishedAt)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-1 rounded-xl border border-border/50 bg-transparent p-4">
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground/40">
                <CheckCircle2 size={12} />
                Tamat seri
              </span>
              <span className="text-sm text-muted-foreground/40">Ini bagian terakhir</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
