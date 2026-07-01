import Link from 'next/link';
import { ArticleCard } from '@/components/article-card';
import { Post, Category } from '@/types/database';

interface LatestArticlesProps {
  posts: (Post & { category?: Category })[];
}

export function LatestArticles({ posts }: LatestArticlesProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-24 md:py-40">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center gap-4">
              <span className="font-display text-sm font-bold text-primary">03</span>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Artikel
              </span>
            </div>
            <h2 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Artikel Terbaru
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              Tulisan pertama sedang dimuat. Bukan konten cepat, kami butuh waktu untuk menulis sesuatu yang layak kamu baca.
            </p>
            <Link
              href="/tentang"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70"
            >
              Kenali TAMPARAN ANAK MUDA
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-40">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <div className="mb-6 flex items-center gap-4">
              <span className="font-display text-sm font-bold text-primary">03</span>
              <div className="h-px w-24 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Artikel
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              Artikel Terbaru
            </h2>
          </div>
          <Link
            href="/artikel"
            className="hidden shrink-0 text-sm font-medium text-primary transition-opacity hover:opacity-70 sm:inline-flex sm:items-center sm:gap-2"
          >
            Lihat semua
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/artikel"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Lihat semua
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
