import { BarChart3 } from 'lucide-react';

interface KeyFindingsProps {
  findings: string[];
  summary?: string | null;
}

export function KeyFindings({ findings, summary }: KeyFindingsProps) {
  if (findings.length === 0 && !summary) return null;

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 md:p-6">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 size={18} className="text-amber-500" />
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.15em] text-amber-500">
          Key Findings
        </h2>
      </div>

      {findings.length > 0 ? (
        <ul className="space-y-3">
          {findings.map((finding, idx) => (
            <li key={idx} className="flex gap-3 text-sm leading-relaxed text-foreground/90 md:text-base">
              <span className="mt-1 flex h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
              <span>{finding}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
          {summary}
        </p>
      )}
    </div>
  );
}
