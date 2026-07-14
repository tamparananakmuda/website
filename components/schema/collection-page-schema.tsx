interface CollectionPageSchemaProps {
  name: string;
  slug: string;
  description?: string;
  items: { title: string; slug: string }[];
}

export function CollectionPageSchema({
  name,
  slug,
  description,
  items,
}: CollectionPageSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/kategori/${slug}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description: description || `${name} - TAMPARAN ANAK MUDA`,
    url,
    inLanguage: 'id-ID',
    isPartOf: {
      '@type': 'WebSite',
      name: 'TAMPARAN ANAK MUDA',
      url: siteUrl,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `${siteUrl}/artikel/${item.slug}`,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
