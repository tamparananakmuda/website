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
    <section className={cn('w-full min-h-screen bg-background flex items-center justify-center p-2 md:p-6', className)}>
      <div className="relative w-full max-w-[1600px] min-h-[600px] md:min-h-[920px] rounded-[36px] md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col border border-border">

        {/* Background */}
        <div className="absolute inset-0 z-0">
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
        <header className="relative z-20 w-full px-6 md:px-12 pt-8">
          <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between rounded-full border border-border bg-card py-[14px] pl-[30px] pr-[14px] shadow-lg">
            <Link href="/" className="font-display text-base font-bold tracking-tight text-foreground">
              TAMPARAN ANAK MUDA
            </Link>

            <nav className="hidden items-center gap-10 lg:flex">
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
              className="p-2 text-foreground lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-6 right-6 top-[88px] z-30 rounded-[32px] border border-border bg-card p-8 shadow-2xl lg:hidden"
            >
              <nav className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <hr className="my-2 border-border" />
                <Link
                  href="/newsletter"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-bold text-primary-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Newsletter
                  <ArrowRight size={20} />
                </Link>
              </nav>
            </motion.div>
          )}
        </header>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-end px-6 pb-[80px] text-center md:pb-[110px]">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center"
          >
            <p className="mb-8 text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Awakening the youth to reality
            </p>

            <h1 className="mb-8 max-w-[1100px] font-display text-[42px] font-bold leading-[1.05] tracking-tight text-foreground md:text-[4.5rem]">
              Melawan Ilusi.
              <br className="hidden md:block" />
              Membangun Realita.
            </h1>

            <p className="mb-12 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Editorial media untuk anak muda Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, dan kehidupan — bukan untuk dikonsumsi lalu dilupakan, tapi untuk dipahami dan dijalankan.
            </p>

            <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/artikel"
                  className="group flex w-full items-center justify-center gap-1 rounded-full bg-primary px-[26px] py-[14px] font-semibold text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 sm:w-auto"
                >
                  Mulai Membaca
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/tentang"
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-border bg-card px-[26px] py-[14px] font-semibold text-foreground shadow-xl transition-colors hover:bg-secondary sm:w-auto"
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
