interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
  categoryTitle?: string;
  imageUrl?: string;
}

export function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName = 'TAMPARAN ANAK MUDA',
  categoryTitle,
  imageUrl,
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
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/artikel/${slug}`,
    },
    ...(categoryTitle && {
      articleSection: categoryTitle,
    }),
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: 1200,
        height: 630,
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
