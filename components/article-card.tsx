import Link from 'next/link';
import { Category, Post } from '@/types/database';

interface ArticleCardProps {
  post: Post & { category?: Category };
}

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group">
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
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{post.reading_time} menit baca</span>
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
        )}
        <span className="text-sm font-medium text-primary">Baca selengkapnya</span>
      </Link>
    </article>
  );
}
