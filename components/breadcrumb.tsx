import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-3xl mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span className="font-medium text-foreground line-clamp-1" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <ChevronRight size={14} className="shrink-0 text-muted-foreground/50" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
