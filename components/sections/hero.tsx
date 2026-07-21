'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export function Hero({ className }: HeroProps) {
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

            <h1 className="mb-6 max-w-[1100px] font-display text-[34px] font-bold leading-[1.08] tracking-tight text-white md:mb-8 md:text-[4.5rem] md:leading-[1.05]">
              Melawan Ilusi.
              <br className="hidden md:block" />
              Membangun Realita.
            </h1>

            <p className="mb-8 max-w-3xl text-base leading-relaxed text-white/70 md:mb-12 md:text-xl">
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
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white shadow-xl backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-[26px] sm:py-[14px]"
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
