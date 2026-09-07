import { FileText } from 'lucide-react';

interface ArticleSummaryProps {
  items: string[];
}

export function ArticleSummary({ items }: ArticleSummaryProps) {
  if (!items || items.length === 0) return null;

  return (
    <aside
      aria-label="Ringkasan Eksekutif Temuan Riset"
      className="my-10 rounded-sm border border-border/80 bg-secondary/20 p-6 md:p-8 backdrop-blur-sm relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 h-full w-1 bg-primary" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-4">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-primary" />
          <span className="font-mono text-xs font-bold tracking-wider uppercase text-foreground">
            POKOK TEMUAN // BERKAS INVESTIGASI
          </span>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest">
          {items.length} POIN KRITIS
        </span>
      </div>
      <ol className="space-y-3.5">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90">
            <span className="font-mono text-xs font-semibold text-primary/80 mt-0.5 shrink-0 select-none">
              {String(index + 1).padStart(2, '0')}.
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
