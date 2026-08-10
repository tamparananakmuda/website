import React from 'react';
import Link from 'next/link';
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
          {/* Base 4-layer gradient with soft burgundy tail: Red (#A51E2D) -> Burgundy (#5C2118) -> Deep Brown (#231514) -> Soft Burgundy Dusk (#140B0B) */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, #A51E2D 0%, #5C2118 20%, #231514 45%, #140B0B 75%, #0A0606 100%)'
            }}
          />

          {/* Heavy Vignette & Dark Edge Masking: Kiri-atas fokus, kanan dan pinggir gelap pekat */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 35% 35%, transparent 20%, rgba(5, 5, 5, 0.65) 60%, rgba(0, 0, 0, 0.95) 100%)'
            }}
          />

          {/* Smooth bottom transition preserving subtle #140B0B burgundy tone */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#140B0B]/30 to-[#0A0606]/90 pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex max-w-5xl flex-1 flex-col items-center justify-end px-4 pt-16 pb-20 text-center md:px-6 md:pt-24 md:pb-28">
          <div className="flex flex-col items-center">
            {/* Tagline label with lower opacity (65-70%) & reduced bottom margin to raise headline (~20px closer) */}
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-primary/70 md:mb-4 md:text-sm md:tracking-[0.3em]">
              Awakening the youth to reality
            </p>

            <h1 className="mb-6 max-w-[980px] font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:mb-8 md:text-[4.5rem] md:leading-[1.05]">
              <span className="block">Melawan Ilusi.</span>
              <span className="block text-white/90">Membangun Realita.</span>
            </h1>

            <p className="mb-8 max-w-2xl text-[1.125rem] leading-[1.75] text-white/75 md:mb-12 md:text-[1.125rem] md:leading-[1.75]">
              Editorial media untuk anak muda Indonesia. Kami menulis tentang uang, karier, bisnis, teknologi, dan kehidupan, bukan untuk membuatmu merasa nyaman, tapi agar kamu melihat kenyataan lebih jelas.
            </p>

            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:w-auto sm:gap-5">
              <div className="w-full sm:w-auto hero-btn-hover">
                <Link
                  href="/artikel"
                  prefetch={false}
                  className="group flex w-full items-center justify-center gap-1 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 sm:px-[26px] sm:py-[14px]"
                >
                  Mulai Membaca
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1 md:size-5" />
                </Link>
              </div>

              <div className="w-full sm:w-auto hero-btn-hover">
                <Link
                  href="/tentang"
                  prefetch={false}
                  className="flex w-full items-center justify-center gap-1 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white shadow-xl backdrop-blur-sm transition-colors hover:bg-white/20 sm:px-[26px] sm:py-[14px]"
                >
                  Tentang Kami
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
