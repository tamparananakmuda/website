import { ListChecks } from 'lucide-react';

interface ArticleSummaryProps {
  items: string[];
}

export function ArticleSummary({ items }: ArticleSummaryProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-secondary/20 p-5">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks size={16} className="text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Ringkasan</h2>
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
