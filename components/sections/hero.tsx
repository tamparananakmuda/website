'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

const navLinks = [
  { name: 'Artikel', href: '/artikel' },
  { name: 'Kategori', href: '/kategori' },
  { name: 'Seri', href: '/seri' },
  { name: 'Tentang', href: '/tentang' },
];

export function Hero({ className }: HeroProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <section className={cn('w-full min-h-screen bg-background flex items-center justify-center p-0 md:p-6', className)}>
      <div className="relative w-full max-w-[1600px] min-h-screen md:min-h-[920px] md:rounded-[48px] shadow-2xl flex flex-col border border-border">

        {/* Background */}
        <div className="absolute inset-0 z-0 overflow-hidden md:rounded-[48px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 30% 20%, hsl(0 63% 52%) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsl(0 63% 52% / 0.3) 0%, transparent 40%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        </div>

        {/* Floating Nav */}
        <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 md:px-12 md:pt-8 pointer-events-none">
          <div className="pointer-events-auto mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-full border border-border bg-card py-3 pl-5 pr-3 shadow-lg md:py-[14px] md:pl-[30px] md:pr-[14px]">
            <Link href="/" className="font-display text-sm font-bold tracking-tight text-foreground md:text-base">
              TAMPARAN ANAK MUDA
            </Link>

            <nav className="hidden items-center gap-10 md:flex">
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
                href="/newsletter"
                className="group flex items-center justify-center gap-1 rounded-full bg-primary px-[26px] py-[14px] font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
              >
                Newsletter
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <button
              className="p-2 text-foreground md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto absolute left-4 right-4 top-[72px] z-30 rounded-3xl border border-border bg-card p-6 shadow-2xl md:hidden"
            >
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="rounded-lg px-4 py-3 text-base font-medium text-foreground hover:bg-secondary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/newsletter"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 font-bold text-primary-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Newsletter
                  <ArrowRight size={18} />
                </Link>
              </nav>
            </motion.div>
          )}
        </header>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-end px-4 pb-16 text-center md:px-6 md:pb-[110px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center"
          >
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-primary md:mb-8 md:text-sm md:tracking-[0.3em]">
              Awakening the youth to reality
            </p>

            <h1 className="mb-6 max-w-[1100px] font-display text-[34px] font-bold leading-[1.08] tracking-tight text-foreground md:mb-8 md:text-[4.5rem] md:leading-[1.05]">
              Melawan Ilusi.
              <br className="hidden md:block" />
              Membangun Realita.
            </h1>

            <p className="mb-8 max-w-3xl text-base leading-relaxed text-muted-foreground md:mb-12 md:text-xl">
              Editorial media untuk anak muda Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, dan kehidupan, bukan untuk membuatmu merasa nyaman, tapi agar kamu melihat kenyataan lebih jelas.
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:w-auto sm:gap-5">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/artikel"
                  className="group flex w-full items-center justify-center gap-1 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 sm:px-[26px] sm:py-[14px]"
                >
                  Mulai Membaca
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 md:size-5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Link
                  href="/tentang"
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-border bg-card px-6 py-3.5 font-semibold text-foreground shadow-xl transition-colors hover:bg-secondary sm:px-[26px] sm:py-[14px]"
                >
                  Tentang Kami
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
