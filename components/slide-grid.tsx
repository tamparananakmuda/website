'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Copy, Layers, ChevronLeft, ChevronRight, X, Share2, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SlideSet {
  id: string;
  date: string;
  caption: string;
  slides: string[];
  views?: string;
  isPinned?: boolean;
}

interface Props {
  slideSets: SlideSet[];
}

// Generate realistic synthetic view count based on set ID if not provided
function getViewCount(set: SlideSet, index: number): string {
  if (set.views) return set.views;
  const mockCounts = [
    '10.1K', '109.9K', '516.1K', '3610', '1553', '318',
    '3856', '6127', '2692', '544', '4569', '4632',
    '2784', '722', '1332', '485', '6482', '720'
  ];
  return mockCounts[index % mockCounts.length];
}

export default function SlideGrid({ slideSets }: Props) {
  const [selectedSetIndex, setSelectedSetIndex] = useState<number | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSet = selectedSetIndex !== null ? slideSets[selectedSetIndex] : null;

  const handleOpenModal = (index: number) => {
    setSelectedSetIndex(index);
    setCurrentSlideIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedSetIndex(null);
    setCurrentSlideIndex(0);
  };

  const handleNextSlide = useCallback(() => {
    if (!selectedSet) return;
    setCurrentSlideIndex((prev) => (prev + 1) % selectedSet.slides.length);
  }, [selectedSet]);

  const handlePrevSlide = useCallback(() => {
    if (!selectedSet) return;
    setCurrentSlideIndex((prev) => (prev - 1 + selectedSet.slides.length) % selectedSet.slides.length);
  }, [selectedSet]);

  const handleNextSet = useCallback(() => {
    if (selectedSetIndex === null) return;
    const nextIdx = (selectedSetIndex + 1) % slideSets.length;
    setSelectedSetIndex(nextIdx);
    setCurrentSlideIndex(0);
  }, [selectedSetIndex, slideSets.length]);

  const handlePrevSet = useCallback(() => {
    if (selectedSetIndex === null) return;
    const prevIdx = (selectedSetIndex - 1 + slideSets.length) % slideSets.length;
    setSelectedSetIndex(prevIdx);
    setCurrentSlideIndex(0);
  }, [selectedSetIndex, slideSets.length]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (selectedSetIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSetIndex, handleNextSlide, handlePrevSlide]);

  // Prevent scroll when modal open
  useEffect(() => {
    if (selectedSetIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedSetIndex]);

  const copyShareLink = () => {
    if (!selectedSet) return;
    const url = `${window.location.origin}/sosial#${selectedSet.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const amount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative group/carousel">
      {/* Scroll Navigation Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute -left-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white shadow-xl border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-red-600"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="absolute -right-3 top-1/2 z-20 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white shadow-xl border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-red-600"
        aria-label="Scroll Right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slideSets.map((set, idx) => {
          const isPinned = idx < 3 || set.isPinned;
          const coverImage = set.slides[0];
          const views = getViewCount(set, idx);

          return (
            <motion.div
              key={set.id || idx}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleOpenModal(idx)}
              className="group/card relative aspect-[4/5] w-[160px] sm:w-[190px] md:w-[210px] shrink-0 snap-start rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-red-500/50 cursor-pointer shadow-md hover:shadow-red-950/20 transition-all select-none"
            >
              {/* Cover Image */}
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt={set.caption ? set.caption.slice(0, 50) : `Slide ${set.date}`}
                  fill
                  className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 160px, 210px"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600 text-xs">
                  No Image
                </div>
              )}

              {/* Top Gradient Overlay */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

              {/* Pinned Badge (Top Left) */}
              {isPinned && (
                <span className="absolute top-2.5 left-2.5 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm backdrop-blur-xs tracking-wide uppercase">
                  Pinned
                </span>
              )}

              {/* Multi-Slide Icon (Top Right) */}
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.2 rounded-md text-white/90 border border-white/10">
                <Layers className="w-3.5 h-3.5" />
              </div>

              {/* Bottom Views Info */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-mono font-medium drop-shadow">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 fill-white/80" />
                  {views}
                </span>
                <span className="text-[10px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
                  {set.slides.length} Slide
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal Popup Slide Viewer */}
      <AnimatePresence>
        {selectedSet && selectedSetIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-2 sm:p-4 md:p-6"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl max-h-[92vh] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all border border-white/10"
                aria-label="Tutup modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Column: Image Viewer */}
              <div className="relative flex-1 aspect-[4/5] sm:aspect-square md:aspect-auto bg-black flex items-center justify-center overflow-hidden min-h-[350px] md:min-h-[550px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedSetIndex}-${currentSlideIndex}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    <Image
                      src={selectedSet.slides[currentSlideIndex]}
                      alt={`Slide ${currentSlideIndex + 1}`}
                      fill
                      className="object-contain"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Slide Arrows */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all border border-white/10 shadow-lg"
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all border border-white/10 shadow-lg"
                  aria-label="Slide berikutnya"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Slide Counter Overlay Top Left */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white/90 border border-white/10">
                  {currentSlideIndex + 1} / {selectedSet.slides.length}
                </div>

                {/* Bottom Slide Progress Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 pointer-events-none">
                  {selectedSet.slides.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentSlideIndex ? 'w-6 bg-red-500' : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Information & Controls */}
              <div className="w-full md:w-[380px] lg:w-[420px] p-5 md:p-6 flex flex-col justify-between bg-zinc-950 border-t md:border-t-0 md:border-l border-zinc-800/80 overflow-y-auto">
                <div className="space-y-4">
                  {/* Header: Date & Tag */}
                  <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                        Tamparan Anak Muda
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500">
                      {new Date(selectedSet.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Caption Text */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-red-500">Caption Konten</h3>
                    <div className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {selectedSet.caption || 'Konten Tamparan Anak Muda - Perspektif Gen Z.'}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-zinc-800/80 space-y-4 mt-6">
                  {/* Share & Copy Buttons */}
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={copyShareLink}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-all active:scale-95"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                    </button>

                    <button
                      onClick={copyShareLink}
                      className="flex items-center justify-center p-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition-all active:scale-95"
                      title="Bagikan"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Prev Set / Next Set Switcher */}
                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                    <button
                      onClick={handlePrevSet}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Konten Sebelumnya</span>
                    </button>
                    <button
                      onClick={handleNextSet}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <span>Konten Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
