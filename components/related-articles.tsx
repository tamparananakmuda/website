'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  ogCardUrl: string | null;
  readingTime: number;
  category?: { title: string; slug: string; color: string } | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

function getCategory(article: RelatedArticle): { title: string; slug: string; color: string } | null {
  if (!article.category) return null;
  return article.category;
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl mt-16 pt-12 border-t border-border">
      <h2 className="mb-6 text-2xl font-bold text-foreground">
        Baca juga
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {articles.map((article) => {
          const cat = getCategory(article);
          return (
            <RelatedArticleCard key={article.id} article={article} cat={cat} />
          );
        })}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/artikel"
          className="text-sm font-medium text-primary hover:underline"
        >
          Lihat semua artikel
        </Link>
      </div>
    </section>
  );
}

function RelatedArticleCard({ article, cat }: { article: RelatedArticle; cat: ReturnType<typeof getCategory> }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(article.ogCardUrl || `/api/og/card?slug=${article.slug}`);
  const [usedFallback, setUsedFallback] = useState(false);

  const handleError = () => {
    if (!usedFallback) {
      setImgSrc(`/api/og/card?slug=${article.slug}`);
      setUsedFallback(true);
      setImgLoaded(false);
    }
  };

  return (
    <article className="group">
      <Link href={`/artikel/${article.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg mb-4 bg-muted/20">
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-1.5 animate-pulse">
                <div className="h-8 w-1.5 rounded-full bg-primary" />
                <div className="h-8 w-1.5 rounded-full bg-primary" />
              </div>
            </div>
          )}
          <Image
            src={imgSrc}
            alt={article.title}
            fill
            loading="lazy"
            quality={90}
            className={`
              object-cover transition-all duration-500
              ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              group-hover:scale-105
            `}
            sizes="(max-width: 768px) 100vw, 33vw"
            onLoad={() => setImgLoaded(true)}
            onError={handleError}
          />
        </div>
        <div className="mb-3 flex items-center gap-2 text-sm">
          {cat && (
            <span style={{ color: cat.color }}>
              {cat.title}
            </span>
          )}
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{article.readingTime} menit baca</span>
        </div>
        <h3 className="mb-2 text-xl font-bold leading-tight transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-4 line-clamp-2 text-muted-foreground">{article.excerpt}</p>
        )}
        <span className="text-sm font-medium text-primary">Baca selengkapnya</span>
      </Link>
    </article>
  );
}
