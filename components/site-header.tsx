'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { TamiIcon } from '@/components/tami/tami-icon';

const FloatingTamiChat = dynamic(
  () => import('@/components/tami/floating-tami-chat').then((m) => m.FloatingTamiChat),
  { ssr: false, loading: () => null }
);

const navLinks = [
  { name: 'TAM+', href: '/sosial' },
  { name: 'Story', href: '/story' },
  { name: 'Whitepaper', href: '/whitepaper' },
  { name: 'Tentang', href: '/tentang' },
  { name: 'Donasi', href: '/donasi' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTamiOpen, setIsTamiOpen] = useState(false);
  const closeTami = useCallback(() => setIsTamiOpen(false), []);

  useEffect(() => {
    if (!isHome) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 100);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome]);

  const isCompact = isScrolled && !isHovered;

  const TamiButton = () => (
    <button
      onClick={() => {
        setIsTamiOpen(true);
        setIsOpen(false); // Close mobile menu if open
      }}
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-[1.5px] transition-all focus:outline-none"
    >
      <span className="absolute inset-[-1000%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_0deg_at_50%_50%,#ef4444_0%,#18181b_25%,#ef4444_50%,#18181b_75%,#ef4444_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-neutral-950 px-5 py-2 text-sm font-bold text-white backdrop-blur-3xl transition-colors hover:bg-neutral-900">
        <TamiIcon className="h-4 w-4 text-primary" />
        <span>TAMI AI</span>
      </span>
    </button>
  );

  if (isHome) {
    return (
      <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-12 md:pt-6 pointer-events-none">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'pointer-events-auto mx-auto flex w-full items-center justify-between rounded-full border border-border bg-card/95 pl-6 pr-3.5 shadow-xl backdrop-blur-md translate-z-0 transition-[max-width,padding] duration-300 ease-out',
            isCompact ? 'max-w-3xl py-3' : 'max-w-7xl py-4.5 md:py-5'
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
              'hidden items-center whitespace-nowrap overflow-hidden transition-all duration-300 ease-out md:flex',
              isCompact ? 'max-w-0 opacity-0' : 'max-w-none gap-8 opacity-100'
            )}
            aria-label="Navigasi utama"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                prefetch={false}
                className={cn(
                  'text-sm font-semibold transition-colors hover:text-foreground',
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                )}
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
            <TamiButton />
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
          <div className="pointer-events-auto absolute left-4 right-4 top-[80px] z-30 rounded-3xl border border-border bg-card p-6 shadow-2xl md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Navigasi mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={false}
                  className={cn(
                    'rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-secondary',
                    pathname === link.href ? 'text-foreground bg-secondary' : 'text-foreground'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
                <TamiButton />
                <Link
                  href="/cari"
                  className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  onClick={() => setIsOpen(false)}
                >
                  <Search className="w-4 h-4" />
                  Cari
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
      <FloatingTamiChat isOpen={isTamiOpen} onClose={closeTami} />
      </>
    );
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
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
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground',
                  pathname === link.href ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/cari"
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-secondary',
                pathname === '/cari' ? 'text-foreground' : 'text-muted-foreground'
              )}
              aria-label="Cari artikel"
            >
              <Search className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <TamiButton />
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
                className={cn(
                  'rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-secondary',
                  pathname === link.href ? 'text-foreground bg-secondary' : 'text-foreground'
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-border flex items-center justify-between">
              <TamiButton />
              <Link
                href="/cari"
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-secondary"
                onClick={() => setIsOpen(false)}
              >
                <Search className="w-4 h-4" />
                Cari
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>

    {/* Global Floating Chatbot TAMI */}
    <FloatingTamiChat isOpen={isTamiOpen} onClose={closeTami} />
    </>
  );
}
