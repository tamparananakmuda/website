'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import type { Category, PostWithRelations } from '@/lib/db/schema';

interface ArticleCardProps {
  post: PostWithRelations;
}

export function ArticleCard({ post }: ArticleCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <article className="group overflow-hidden rounded-xl transition-all duration-200 hover:bg-secondary/50">
      <Link href={`/artikel/${post.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted/40 to-muted/10" />
          )}
          <Image
            src={post.ogCardUrl || post.ogImageUrl || `/api/og/card?slug=${post.slug}`}
            alt={post.title}
            fill
            unoptimized
            loading="lazy"
            className={`
              object-cover transition-all duration-500
              ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              group-hover:scale-105
            `}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImgLoaded(true)}
          />
        </div>
        <div className="p-4">
        <div className="mb-3 flex items-center gap-2 text-sm">
          {post.category && (
            <span
              className="font-medium"
              style={{ color: post.category.color }}
            >
              {post.category.title}
            </span>
          )}
          {post.isSponsored && (
            <span className="rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-600">
              Sponsored
            </span>
          )}
          {post.isPremium && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              Premium
            </span>
          )}
          <span className="text-muted-foreground">&middot;</span>
          <span className="text-muted-foreground">{post.readingTime} menit baca</span>
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
        </div>
      </Link>
    </article>
  );
}
