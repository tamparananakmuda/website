import { ExternalLink, FileText } from 'lucide-react';

export interface SourceReferenceItem {
  title?: string;
  label?: string;
  url?: string;
  type?: string;
  date?: string;
  publisher?: string;
}

interface SourceReferencesProps {
  sources: SourceReferenceItem[];
}

export function SourceReferences({ sources }: SourceReferencesProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl mt-12 pt-8 border-t border-border" aria-label="Sumber dan Metodologi">
      <div className="rounded-xl border border-border bg-secondary/20 p-6">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-foreground">Sumber & Metodologi</h2>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Data dalam artikel ini bersumber dari publikasi resmi dan laporan media terverifikasi. Pembaca dapat memeriksa sumber asli melalui tautan berikut.
        </p>
        <ol className="space-y-3">
          {sources.map((source, index) => {
            const label = source.title || source.label || `Sumber ${index + 1}`;
            const hasUrl = source.url && source.url.startsWith('http');
            return (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 font-bold tabular-nums text-muted-foreground">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  {hasUrl ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-foreground transition-colors hover:text-primary"
                    >
                      <span>{label}</span>
                      <ExternalLink size={12} className="mt-0.5 shrink-0 text-muted-foreground" />
                    </a>
                  ) : (
                    <span className="text-foreground">{label}</span>
                  )}
                  {(source.publisher || source.date) && (
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {[source.publisher, source.date].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
