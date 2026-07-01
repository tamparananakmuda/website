import Link from 'next/link';
import { ArticleCard } from '@/components/article-card';
import { Post, Category } from '@/types/database';

interface LatestArticlesProps {
  posts: (Post & { category?: Category })[];
}

export function LatestArticles({ posts }: LatestArticlesProps) {
  if (!posts || posts.length === 0) {
    return (
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Artikel Terbaru
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Artikel pertama sedang dalam perjalanan. Sementara itu, kenalan dulu dengan kami.
            </p>
            <Link
              href="/tentang"
              className="text-sm font-medium text-primary hover:underline"
            >
              Kenali TAMPARAN ANAK MUDA &rarr;
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Artikel Terbaru
          </h2>
          <Link
            href="/artikel"
            className="text-sm font-medium text-primary hover:underline"
          >
            Lihat semua artikel &rarr;
          </Link>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
