import Link from 'next/link';
import { FileText, Clock } from 'lucide-react';

interface WhitepaperCardProps {
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  reading_time: number;
  tags: string[];
  cover_image_url: string | null;
}

export function WhitepaperCard({
  slug,
  title,
  subtitle,
  summary,
  reading_time,
  tags,
  cover_image_url,
}: WhitepaperCardProps) {
  return (
    <Link
      href={`/whitepaper/${slug}`}
      className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
    >
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <FileText className="w-4 h-4" />
        <span>Whitepaper</span>
        <span>&middot;</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {reading_time} menit baca
        </span>
      </div>

      <h2 className="mb-2 text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
        {title}
      </h2>

      {subtitle && (
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          {subtitle}
        </p>
      )}

      {summary && (
        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
          {summary}
        </p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
