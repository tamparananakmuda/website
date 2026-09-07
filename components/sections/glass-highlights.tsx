'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, CheckCircle2 } from 'lucide-react';

interface HighlightItem {
  id: string;
  category: string;
  quote: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  initials: string;
  rating: string;
  rotationDesktop: string;
  rotationMobile: string;
  zIndexBase: number;
  glassBg: string;
}

const readerHighlights: HighlightItem[] = [
  {
    id: 'highlight-1',
    category: 'Finansial & Karier',
    quote:
      'Tulisan TAM soal jebakan lifestyle inflation dan realitas gaji dua digit di kota besar benar-benar menampar saya. Bukan bikin minder, tapi memaksa saya berhenti gengsi dan mulai bangun dana darurat nyata.',
    author: 'Faris Danuarta',
    role: 'Lead Frontend Engineer',
    location: 'Jakarta',
    avatar: '/images/avatars/faris.jpg',
    initials: 'FD',
    rating: '5.0',
    rotationDesktop: 'md:-rotate-[10deg]',
    rotationMobile: '-rotate-[1.5deg]',
    zIndexBase: 10,
    glassBg:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(230, 57, 70, 0.08) 100%)',
  },
  {
    id: 'highlight-2',
    category: 'Mindset & Realitas',
    quote:
      'Di saat media lain sibuk jualan tips sukses 30 detik di TikTok yang nihil substansi, TAM konsisten menyajikan data riil dan analisis kritis. Baca satu esai TAM memberi kejelasan yang tidak ada di seminar manapun.',
    author: 'Nadia Salsabila',
    role: 'Product Strategist & Peneliti',
    location: 'Surabaya',
    avatar: '/images/avatars/kurator-esai.jpg',
    initials: 'NS',
    rating: '5.0',
    rotationDesktop: 'md:-rotate-[6deg]',
    rotationMobile: 'rotate-[1deg]',
    zIndexBase: 20,
    glassBg:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(230, 57, 70, 0.05) 100%)',
  },
  {
    id: 'highlight-3',
    category: 'Riset & Integritas',
    quote:
      'Sikap editorial TAM yang menolak clickbait sensasional dan selalu menyertakan rujukan terbuka adalah standar baru yang langka. Ini ruang baca independen wajib buat siapa saja yang ingin berpikir jernih.',
    author: 'Bagas Wicaksono',
    role: 'Founder Studio & Patron',
    location: 'Bandung',
    avatar: '/images/avatars/pembaca-aktif.jpg',
    initials: 'BW',
    rating: '5.0',
    rotationDesktop: 'md:rotate-[0deg]',
    rotationMobile: 'rotate-0',
    zIndexBase: 30,
    glassBg:
      'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, rgba(230, 57, 70, 0.03) 100%)',
  },
];

export function GlassHighlightsSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-10 sm:py-16 md:py-20 overflow-visible min-h-[460px] sm:min-h-[500px]">
      {/* Background Soft Glow Radial Aura */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[380px] w-[90%] max-w-[750px] rounded-full bg-[radial-gradient(circle,rgba(230,57,70,0.14)_0%,rgba(165,30,45,0.06)_45%,transparent_70%)] blur-[80px]"
        aria-hidden="true"
      />

      {/* Card Deck Wrapper */}
      <div className="container max-w-full relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 h-full px-4">
        {readerHighlights.map((item, index) => {
          const isHoveredOrActive = activeCard === index;

          return (
            <div
              key={item.id}
              tabIndex={0}
              role="button"
              aria-label={`Sorotan ulasan dari ${item.author}`}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              onFocus={() => setActiveCard(index)}
              onBlur={() => setActiveCard(null)}
              onClick={() => setActiveCard(isHoveredOrActive ? null : index)}
              className={`glass group relative w-[310px] sm:w-[340px] h-[350px] sm:h-[360px] rounded-2xl flex items-center justify-center transition-all duration-300 ease-out outline-none cursor-pointer select-none
                ${item.rotationMobile} ${item.rotationDesktop}
                md:-mx-9 lg:-mx-12
                ${
                  isHoveredOrActive
                    ? '!rotate-0 !scale-105 md:!scale-110 !z-40 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7),0_0_30px_rgba(230,57,70,0.3)] !border-primary/50'
                    : 'hover:!rotate-0 hover:!scale-105 hover:!z-30'
                }`}
              style={{
                zIndex: isHoveredOrActive ? 40 : item.zIndexBase,
                background: item.glassBg,
                border: isHoveredOrActive
                  ? '1px solid rgba(230, 57, 70, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: isHoveredOrActive
                  ? 'rgba(0, 0, 0, 0.6) 0px 30px 40px, rgba(230, 57, 70, 0.25) 0px 0px 25px'
                  : 'rgba(0, 0, 0, 0.35) 0px 25px 30px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Inner Floating Card */}
              <div className="absolute inset-3 sm:inset-4 rounded-xl bg-card/95 dark:bg-[#121214]/95 text-foreground shadow-2xl ring-1 ring-border/80 dark:ring-white/10 overflow-hidden flex flex-col justify-between p-5 sm:p-6 transition-colors duration-200">
                
                {/* Subtle top indicator bar on active/hover */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent transition-opacity duration-300 ${
                    isHoveredOrActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Card Top: Quote Icon & Category Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 text-primary transition-transform group-hover:scale-110">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                      <path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z" />
                    </svg>
                  </div>

                  <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground bg-muted/60 dark:bg-white/[0.05] px-2.5 py-0.5 rounded-full border border-border/50">
                    {item.category}
                  </span>
                </div>

                {/* Card Body: Quote text */}
                <p className="text-xs sm:text-sm leading-relaxed text-foreground/90 font-sans my-3 line-clamp-4 sm:line-clamp-none">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Card Bottom: Author Info & Rating */}
                <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Avatar with fallback */}
                    <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0 border border-border bg-muted flex items-center justify-center font-display text-xs font-bold text-foreground">
                      {!imageErrors[item.id] ? (
                        <Image
                          src={item.avatar}
                          alt={`Foto profil ${item.author}`}
                          width={32}
                          height={32}
                          unoptimized
                          onError={() => handleImageError(item.id)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{item.initials}</span>
                      )}
                    </div>

                    {/* Author Details */}
                    <div className="min-w-0">
                      <div className="text-xs font-display font-bold text-foreground truncate flex items-center gap-1">
                        <span>{item.author}</span>
                        <CheckCircle2 className="h-3 w-3 text-primary shrink-0" aria-label="Terverifikasi" />
                      </div>
                      <div className="text-[11px] text-muted-foreground font-sans truncate">
                        {item.role}, {item.location}
                      </div>
                    </div>
                  </div>

                  {/* Rating / Badge */}
                  <div className="flex items-center gap-1 shrink-0 bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                    <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-mono font-bold text-foreground">{item.rating}</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile Interactive Hint / Indicator */}
      <div className="mt-8 flex md:hidden items-center justify-center gap-2">
        {readerHighlights.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveCard(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeCard === idx ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30'
            }`}
            aria-label={`Lihat ulasan ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
