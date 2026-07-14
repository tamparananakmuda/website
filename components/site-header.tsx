'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Search, Menu, X, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

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
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setLoggedIn(!!user);
    });
  }, []);

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const isCompact = isScrolled && !isHovered;

  if (isHome) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-12 md:pt-6 pointer-events-none">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'pointer-events-auto mx-auto flex w-full items-center justify-between rounded-full border border-border bg-card/95 pl-5 pr-3 shadow-lg backdrop-blur-md transition-all duration-500 ease-in-out',
            isCompact ? 'max-w-2xl py-2' : 'max-w-7xl py-3.5'
          )}
        >
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-tight text-foreground md:text-base"
            onClick={() => setIsOpen(false)}
          >
            TAMPARAN ANAK MUDA
          </Link>

          <nav
            className={cn(
              'hidden items-center gap-8 overflow-hidden whitespace-nowrap transition-all duration-500 ease-in-out md:flex',
              isCompact ? 'opacity-0 max-w-0' : 'opacity-100 max-w-[600px]'
            )}
            aria-label="Navigasi utama"
          >
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

          <div className="hidden items-center gap-2 md:flex">
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
              className={cn(
                'group flex items-center justify-center gap-1 rounded-full bg-primary font-semibold text-primary-foreground transition-all duration-300 ease-in-out hover:bg-primary/90 active:scale-95',
                isCompact ? 'px-5 py-2 text-sm' : 'px-6 py-2.5 text-sm'
              )}
            >
              Newsletter
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <button
            className="p-2 text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="pointer-events-auto absolute left-4 right-4 top-[72px] z-30 rounded-3xl border border-border bg-card p-6 shadow-2xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/cari"
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-4 h-4" />
                Cari
              </Link>
              <Link
                href={loggedIn ? '/akun' : '/masuk'}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4" />
                {loggedIn ? 'Akun Saya' : 'Masuk'}
              </Link>
              <Link
                href="/newsletter"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Newsletter
                <ArrowRight size={18} />
              </Link>
            </nav>
          </div>
        )}
      </header>
    );
  }

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
            {isOpen ? <X size={22} /> : <Menu size={22} />}
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
