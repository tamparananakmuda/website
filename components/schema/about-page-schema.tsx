export function AboutPageSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    url: `${siteUrl}/tentang`,
    inLanguage: 'id-ID',
    mainEntity: {
      '@type': 'Organization',
      name: 'TAMPARAN ANAK MUDA',
      url: siteUrl,
      slogan: 'Menyadarkan Generasi Muda akan Kenyataan',
      description:
        'Editorial media digital Indonesia yang menulis tentang uang, karier, bisnis, teknologi, kehidupan, dan mindset untuk generasi muda.',
      sameAs: [
        'https://instagram.com/tamparananakmuda.id',
        'https://tiktok.com/@tamparananakmuda',
        'https://x.com/tamparananakmuda',
      ],
      publishingPrinciples: `${siteUrl}/tentang#prinsip-editorial`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
