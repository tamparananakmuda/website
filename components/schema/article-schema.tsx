interface Citation {
  title?: string;
  url?: string;
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  modifiedAt?: string;
  authorName?: string;
  authorBio?: string;
  authorSlug?: string;
  authorSocialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  categoryTitle?: string;
  categorySlug?: string;
  imageUrl?: string;
  readingTime?: number;
  isPremium?: boolean;
  isSponsored?: boolean;
  sponsorName?: string;
  citations?: Citation[];
  keywords?: string[];
  wordCount?: number;
  humanReviewed?: boolean;
}

export function ArticleSchema({
  title,
  description,
  slug,
  publishedAt,
  modifiedAt,
  authorName = 'TAMPARAN ANAK MUDA',
  authorBio,
  authorSlug,
  authorSocialLinks,
  categoryTitle,
  categorySlug,
  imageUrl,
  readingTime,
  isPremium,
  isSponsored,
  sponsorName,
  citations,
  keywords,
  wordCount,
  humanReviewed,
}: ArticleSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const articleUrl = `${siteUrl}/artikel/${slug}`;
  const ogImageUrl = `${siteUrl}/artikel/${slug}/opengraph-image`;

  const hasIndividualAuthor = authorName && authorName !== 'TAMPARAN ANAK MUDA';

  const authorEntity: Record<string, unknown> = hasIndividualAuthor
    ? {
        '@type': 'Person',
        name: authorName,
        ...(authorBio && { description: authorBio }),
        ...(authorSlug && { url: `${siteUrl}/penulis/${authorSlug}` }),
      }
    : {
        '@type': 'Organization',
        name: 'TAMPARAN ANAK MUDA',
      };

  if (hasIndividualAuthor && authorSocialLinks) {
    const sameAs: string[] = [];
    if (authorSocialLinks.instagram) sameAs.push(authorSocialLinks.instagram);
    if (authorSocialLinks.twitter) sameAs.push(authorSocialLinks.twitter);
    if (authorSocialLinks.linkedin) sameAs.push(authorSocialLinks.linkedin);
    if (authorSocialLinks.website) sameAs.push(authorSocialLinks.website);
    if (sameAs.length > 0) authorEntity.sameAs = sameAs;
  }

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: articleUrl,
    datePublished: publishedAt,
    dateModified: modifiedAt || publishedAt,
    author: authorEntity,
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
      '@id': articleUrl,
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl || ogImageUrl,
      width: 1600,
      height: 900,
    },
    inLanguage: 'id-ID',
    isAccessibleForFree: !isPremium,
    publishingPrinciples: `${siteUrl}/tentang#prinsip-editorial`,
  };

  if (categoryTitle) {
    schema.articleSection = categoryTitle;
    schema.about = {
      '@type': 'Thing',
      name: categoryTitle,
      ...(categorySlug && { url: `${siteUrl}/kategori/${categorySlug}` }),
    };
  }

  if (keywords && keywords.length > 0) {
    schema.keywords = keywords.join(', ');
    schema.mentions = keywords.map((k) => ({ '@type': 'Thing', name: k }));
  }

  if (wordCount) {
    schema.wordCount = wordCount;
  }

  if (readingTime) {
    schema.timeRequired = `PT${readingTime}M`;
  }

  if (humanReviewed) {
    schema.credentialStatus = 'verified';
  }

  if (citations) {
    const parsedCitations = typeof citations === 'string' ? JSON.parse(citations) : citations;
    if (Array.isArray(parsedCitations) && parsedCitations.length > 0) {
      schema.citation = parsedCitations.map((c) => ({
        '@type': 'CreativeWork',
        ...((c.title || c.label) && { name: c.title || c.label }),
        ...(c.url && { url: c.url }),
      }));
    }
  }

  if (isSponsored && sponsorName) {
    schema.sponsor = {
      '@type': 'Organization',
      name: sponsorName,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
