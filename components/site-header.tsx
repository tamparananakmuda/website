'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

const navLinks = [
  { name: 'Artikel', href: '/artikel' },
  { name: 'Whitepaper', href: '/whitepaper' },
  { name: 'Sosial', href: '/sosial' },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Seri', href: '/seri' },
  { name: 'Tentang', href: '/tentang' },
  { name: 'Donasi', href: '/donasi' },
];

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
    });
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-base font-bold tracking-tight text-foreground"
            onClick={() => setIsOpen(false)}
          >
            TAMPARAN ANAK MUDA
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Navigasi utama">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/cari"
              className="flex items-center justify-center w-9 h-9 rounded-full text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary"
              aria-label="Cari artikel"
            >
              <Search className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <Link
              href={loggedIn ? '/akun' : '/masuk'}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <User className="w-4 h-4" />
              {loggedIn ? 'Akun' : 'Masuk'}
            </Link>
            <Link
              href="/newsletter"
              className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Newsletter
            </Link>
          </div>

          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4" aria-label="Navigasi mobile">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/cari"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              <Search className="w-4 h-4" />
              Cari
            </Link>
            <Link
              href={loggedIn ? '/akun' : '/masuk'}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4" />
              {loggedIn ? 'Akun Saya' : 'Masuk'}
            </Link>
            <Link
              href="/newsletter"
              className="mt-2 flex items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground"
              onClick={() => setIsOpen(false)}
            >
              Newsletter
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
