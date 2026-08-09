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
    foundingDate: '2024',
    publishingPrinciples: `${siteUrl}/tentang#prinsip-editorial`,
    knowsAbout: [
      'Keuangan generasi muda Indonesia',
      'Karier dan dunia kerja Gen Z',
      'Bisnis dan kewirausahaan',
      'Teknologi dan dampak sosial AI',
      'Kesehatan mental generasi muda',
      'Sistem pangan Indonesia',
      'Krisis demografis Indonesia',
      'Sistem hukum Indonesia',
      'Infrastruktur kesepian Gen Z',
      'Industri penderitaan Gen Z',
      'Kelas menengah Indonesia',
      'Sistem pendidikan Indonesia',
      'Sistem perumahan Indonesia',
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/logo.png`,
      width: 512,
      height: 512,
    },
    sameAs: [
      'https://instagram.com/tamparananakmuda.id',
      'https://tiktok.com/@tamparananakmuda',
      'https://x.com/tamparananakmuda',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'halo@tamparananakmuda.com',
      contactType: 'editorial',
      availableLanguage: ['Indonesian'],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
