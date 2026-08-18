import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface ReadAlsoProps {
  articles: {
    slug: string;
    title: string;
    category?: { title: string; slug: string; color: string } | null;
  }[];
}

export function ReadAlso({ articles }: ReadAlsoProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="my-8 rounded-xl border border-border bg-secondary/20 p-5">
      <div className="mb-3 flex items-center gap-2">
        <BookOpen size={14} className="text-primary" />
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Baca Juga</span>
      </div>
      <ul className="space-y-2.5">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/artikel/${article.slug}`}
              className="group flex items-start gap-2 text-sm leading-relaxed text-foreground transition-colors hover:text-primary"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
              <span>
                <span className="font-medium transition-colors group-hover:text-primary">{article.title}</span>
                {article.category && (
                  <span className="ml-2 text-xs text-muted-foreground/60">
                    {article.category.title}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
