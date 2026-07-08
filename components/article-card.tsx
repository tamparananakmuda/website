import Link from 'next/link';
import { Category, Post } from '@/types/database';

interface ArticleCardProps {
  post: Post & { category?: Category };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group rounded-xl p-4 transition-all duration-200 hover:bg-secondary/50">
      <Link href={`/artikel/${post.slug}`} className="block">
        <div className="mb-3 flex items-center gap-2 text-sm">
          {post.category && (
            <span
              className="font-medium"
              style={{ color: post.category.color }}
            >
              {post.category.title}
            </span>
          )}
          {post.is_sponsored && (
            <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-600">
              Sponsored
            </span>
          )}
          {post.is_premium && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Premium
            </span>
          )}
          <span className="text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">{post.reading_time} menit baca</span>
        </div>
        <h2 className="mb-2 text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
        )}
        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-1">
          Baca selengkapnya
        </span>
      </Link>
    </article>
  );
}
