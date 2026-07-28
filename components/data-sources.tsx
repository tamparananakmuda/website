import { Database } from 'lucide-react';

interface DataSourcesProps {
  sources: string[];
}

export function DataSources({ sources }: DataSourcesProps) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-4 flex items-center gap-2">
        <Database size={18} className="text-amber-500/70" />
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Sumber Data
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((source, idx) => (
          <span
            key={idx}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground"
          >
            {source}
          </span>
        ))}
      </div>
    </section>
  );
}
