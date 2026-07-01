import Link from 'next/link';
import { Category } from '@/types/database';

interface TopicsProps {
  categories: Category[];
}

export function Topics({ categories }: TopicsProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="bg-card py-20 md:py-32">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-3xl font-bold tracking-tight md:text-4xl">
          Enam topik. Satu pendekatan: jujur dan tajam.
        </h2>
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group bg-card p-8 transition-colors hover:bg-secondary"
            >
              <div
                className="mb-3 h-1 w-12 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h3 className="mb-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-primary">
                {category.title}
              </h3>
              {category.description && (
                <p className="text-muted-foreground">{category.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
