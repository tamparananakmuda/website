interface AuthorSchemaProps {
  name: string;
  bio?: string;
  slug?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

export function AuthorSchema({ name, bio, slug, socialLinks }: AuthorSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const sameAs: string[] = [];
  if (socialLinks?.instagram) sameAs.push(socialLinks.instagram);
  if (socialLinks?.twitter) sameAs.push(socialLinks.twitter);
  if (socialLinks?.linkedin) sameAs.push(socialLinks.linkedin);
  if (socialLinks?.website) sameAs.push(socialLinks.website);

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(bio && { description: bio }),
    ...(slug && { url: `${siteUrl}/penulis/${slug}` }),
    ...(sameAs.length > 0 && { sameAs }),
    worksFor: {
      '@type': 'Organization',
      name: 'TAMPARAN ANAK MUDA',
      url: siteUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
