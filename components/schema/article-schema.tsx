interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
  categoryTitle?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName = 'TAMPARAN ANAK MUDA',
  categoryTitle,
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${siteUrl}/artikel/${slug}`,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: {
      '@type': 'Organization',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TAMPARAN ANAK MUDA',
      url: siteUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/artikel/${slug}`,
    },
    ...(categoryTitle && {
      articleSection: categoryTitle,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
