import Link from 'next/link';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  reading_time: number;
  category?: { title: string; slug: string; color: string } | { title: string; slug: string; color: string }[] | null;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

function getCategory(article: RelatedArticle): { title: string; slug: string; color: string } | null {
  if (!article.category) return null;
  return Array.isArray(article.category) ? article.category[0] || null : article.category;
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
            <article key={article.id} className="group">
              <Link href={`/artikel/${article.slug}`} className="block">
                <div className="mb-3 flex items-center gap-2 text-sm">
                  {cat && (
                    <span style={{ color: cat.color }}>
                      {cat.title}
                    </span>
                  )}
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{article.reading_time} menit baca</span>
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
