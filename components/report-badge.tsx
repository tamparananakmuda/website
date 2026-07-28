interface ReportBadgeProps {
  reportCode: string;
  reportYear?: number;
  size?: 'sm' | 'md';
}

export function ReportBadge({ reportCode, reportYear, size = 'md' }: ReportBadgeProps) {
  const parts = reportCode.split('-');
  const year = reportYear || (parts.length >= 2 ? parseInt(parts[1]) : null);
  const number = parts.length >= 3 ? parts[2] : null;

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded border border-amber-500/30 bg-amber-500/5 font-mono font-medium uppercase tracking-wider text-amber-500 ${sizeClasses}`}
    >
      <span className="font-bold">TAM Report</span>
      {year && <span className="text-amber-500/70">{year}</span>}
      {number && (
        <>
          <span className="text-amber-500/40">·</span>
          <span className="text-amber-500/90">{number}</span>
        </>
      )}
    </span>
  );
}
