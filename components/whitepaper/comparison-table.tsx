interface ComparisonRow {
  metric: string;
  values: (string | number)[];
  lowerIsBetter?: boolean;
  unit?: string;
  isText?: boolean;
}

interface ComparisonConfig {
  title?: string;
  subtitle?: string;
  source?: string;
  highlightColumn?: string;
  columns: string[];
  rows: ComparisonRow[];
}

function getCellColor(
  value: string | number,
  allValues: (string | number)[],
  lowerIsBetter: boolean,
  isText: boolean
): string {
  if (isText || typeof value === 'string') return 'text-foreground/80';

  const nums = allValues.filter((v): v is number => typeof v === 'number');
  if (nums.length < 2) return 'text-foreground';

  const min = Math.min(...nums);
  const max = Math.max(...nums);

  if (value === min) return lowerIsBetter ? 'text-green-400 font-bold' : 'text-red-400';
  if (value === max) return lowerIsBetter ? 'text-red-400' : 'text-green-400 font-bold';
  return 'text-foreground';
}

function getIndicator(
  value: string | number,
  allValues: (string | number)[],
  lowerIsBetter: boolean,
  isText: boolean
): string {
  if (isText || typeof value === 'string') return '';
  const nums = allValues.filter((v): v is number => typeof v === 'number');
  if (nums.length < 2) return '';
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  if (value === min) return lowerIsBetter ? 'best' : 'worst';
  if (value === max) return lowerIsBetter ? 'worst' : 'best';
  return '';
}

export function ComparisonTable({ config }: { config: ComparisonConfig }) {
  const { title, subtitle, source, highlightColumn, columns, rows } = config;
  const highlightIdx = highlightColumn ? columns.indexOf(highlightColumn) : -1;

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
      {title && (
        <div className="border-b border-border px-5 py-4 md:px-6 md:py-5">
          <h3 className="font-display text-lg font-bold text-foreground md:text-xl">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left font-display text-xs font-bold uppercase tracking-wider text-muted-foreground md:px-5">
                Metric
              </th>
              {columns.map((col, i) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-center font-display text-xs font-bold uppercase tracking-wider md:px-5 ${
                    i === highlightIdx
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'text-muted-foreground'
                  }`}
                >
                  {col}
                  {i === highlightIdx && (
                    <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500 align-middle" />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const isTextRow = row.isText || row.values.every((v) => typeof v === 'string');
              return (
                <tr
                  key={ri}
                  className={`border-b border-border/50 last:border-0 ${ri % 2 === 1 ? 'bg-background/20' : ''}`}
                >
                  <td className="px-4 py-3 text-left text-sm font-medium text-foreground/90 md:px-5">
                    {row.metric}
                    {row.unit && (
                      <span className="ml-1 text-xs text-muted-foreground">({row.unit})</span>
                    )}
                  </td>
                  {row.values.map((val, ci) => {
                    const indicator = getIndicator(
                      val,
                      row.values,
                      row.lowerIsBetter ?? false,
                      isTextRow
                    );
                    const colorClass = getCellColor(
                      val,
                      row.values,
                      row.lowerIsBetter ?? false,
                      isTextRow
                    );
                    return (
                      <td
                        key={ci}
                        className={`px-4 py-3 text-center md:px-5 ${
                          ci === highlightIdx ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {indicator === 'best' && (
                            <span className="text-xs text-green-400" title="Terbaik">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          )}
                          {indicator === 'worst' && (
                            <span className="text-xs text-red-400" title="Terburuk">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </span>
                          )}
                          <span className={`text-sm ${colorClass}`}>
                            {typeof val === 'number' ? val.toLocaleString('id-ID') : val}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 border-t border-border px-5 py-3 md:px-6">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Terbaik</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span>Terburuk</span>
        </div>
        {highlightColumn && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span>{highlightColumn}</span>
          </div>
        )}
        {source && (
          <span className="ml-auto text-xs text-muted-foreground/60">Sumber: {source}</span>
        )}
      </div>
    </div>
  );
}
