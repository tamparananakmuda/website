interface ItemListSchemaItem {
  name: string;
  url: string;
  position?: number;
  description?: string;
}

interface ItemListSchemaProps {
  name: string;
  description?: string;
  items: ItemListSchemaItem[];
}

export function ItemListSchema({ name, description, items }: ItemListSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    ...(description ? { description } : {}),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: item.position ?? index + 1,
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
