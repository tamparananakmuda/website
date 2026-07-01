export function WebsiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TAMPARAN ANAK MUDA',
    url: siteUrl,
    description:
      'Media digital Indonesia yang membahas mindset, bisnis, keuangan, teknologi, dan pengembangan diri untuk generasi muda.',
    inLanguage: 'id-ID',
    publisher: {
      '@type': 'Organization',
      name: 'TAMPARAN ANAK MUDA',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
