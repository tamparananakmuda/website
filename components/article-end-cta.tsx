import Link from 'next/link';
import { ArrowRight, ArrowLeft, FolderOpen } from 'lucide-react';

interface ArticleEndCTAProps {
  nextArticle: {
    slug: string;
    title: string;
    excerpt: string | null;
    category?: { title: string; slug: string; color: string } | null;
  } | null;
  categoryLink: { title: string; slug: string } | null;
}

export function ArticleEndCTA({ nextArticle, categoryLink }: ArticleEndCTAProps) {
  return (
    <div className="mx-auto max-w-3xl mt-12 space-y-4">
      {nextArticle && (
        <Link
          href={`/artikel/${nextArticle.slug}`}
          className="group block rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-primary/[0.02]"
        >
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className="h-px w-6 bg-primary" />
            Baca Artikel Berikutnya
          </div>
          <h3 className="mb-2 font-display text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
            {nextArticle.title}
          </h3>
          {nextArticle.excerpt && (
            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {nextArticle.excerpt}
            </p>
          )}
          <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all group-hover:gap-2.5">
            Lanjut baca
            <ArrowRight size={16} />
          </div>
        </Link>
      )}

      {categoryLink && (
        <Link
          href={`/kategori/${categoryLink.slug}`}
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Kembali ke kategori
          <span className="font-semibold text-foreground transition-colors group-hover:text-primary">
            {categoryLink.title}
          </span>
          <FolderOpen size={14} className="text-muted-foreground/50" />
        </Link>
      )}
    </div>
  );
}
