'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlideSet {
  id: string;
  date: string;
  caption: string;
  slides: string[];
}

interface Props {
  slideSets: SlideSet[];
}

export default function SlideCarousel({ slideSets }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const currentSet = slideSets[currentIndex] || null;

  const nextSet = () => {
    setCurrentIndex((prev) => (prev + 1) % slideSets.length);
    setCurrentSlide(0);
  };

  const prevSet = () => {
    setCurrentIndex((prev) => (prev - 1 + slideSets.length) % slideSets.length);
    setCurrentSlide(0);
  };

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (!currentSet || currentSet.slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % currentSet.slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSet]);

  if (!currentSet || slideSets.length === 0) {
    return null;
  }

  const slideUrl = currentSet.slides[currentSlide];
  const totalSlides = currentSet.slides.length;

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="relative aspect-[4/5] sm:aspect-[16/9] md:aspect-[21/9] bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentIndex}-${currentSlide}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 300 }}
            className="absolute inset-0 flex items-center justify-center bg-zinc-950"
          >
            <Image
              src={slideUrl}
              alt={`Slide ${currentSlide + 1} of ${totalSlides}`}
              fill
              className="object-contain"
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay gradient for caption readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

        {/* Caption overlay & Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <p className="text-sm md:text-base font-medium line-clamp-2 md:line-clamp-3 mb-3 text-zinc-100 max-w-4xl">
            {currentSet.caption}
          </p>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/20 border border-primary/30">
                {new Date(currentSet.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Slide {currentSlide + 1} / {totalSlides}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prevSet}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 border border-white/10"
                aria-label="Set sebelumnya"
                title="Set sebelumnya"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextSet}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-95 border border-white/10"
                aria-label="Set berikutnya"
                title="Set berikutnya"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Slide navigation dots */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {currentSet.slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentSlide ? 'w-6 bg-primary' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-xs text-zinc-300">
            <Play className="h-3 w-3 text-primary fill-primary animate-pulse" />
            <span>Set {currentIndex + 1}/{slideSets.length}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
