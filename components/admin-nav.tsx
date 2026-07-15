'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Planner', href: '/admin/planner' },
  { name: 'Kalender', href: '/admin/planner/calendar' },
  { name: 'Analytics', href: '/admin/analytics' },
  { name: 'Import Sosial', href: '/admin/import' },
  { name: 'Kelola Posts', href: '/admin/posts' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-4 text-sm">
      {navItems.map((item) => {
        const isActive =
          item.href === '/admin/planner'
            ? pathname === '/admin/planner' || (pathname.startsWith('/admin/planner/') && !pathname.includes('calendar'))
            : pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.name}
            href={item.href}
            className={
              isActive
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
