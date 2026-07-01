export function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TAMPARAN ANAK MUDA',
    url: siteUrl,
    description:
      'Media digital Indonesia yang membahas mindset, bisnis, keuangan, teknologi, dan pengembangan diri untuk generasi muda.',
    slogan: 'Awakening the youth to reality',
    sameAs: [
      'https://instagram.com/tamparananakmuda.id',
      'https://tiktok.com/@tamparananakmuda',
      'https://x.com/tamparananakmuda',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
