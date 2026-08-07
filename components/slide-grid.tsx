'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Copy, Layers, ChevronLeft, ChevronRight, X, Share2, Play, Check, ChevronDown } from 'lucide-react';
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
  const [isCaptionExpanded, setIsCaptionExpanded] = useState<boolean>(false);
  
  // Touch / Swipe handling for mobile slide viewer
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSet = selectedSetIndex !== null ? slideSets[selectedSetIndex] : null;

  const handleOpenModal = (index: number) => {
    setSelectedSetIndex(index);
    setCurrentSlideIndex(0);
    setIsCaptionExpanded(false);
  };

  const handleCloseModal = () => {
    setSelectedSetIndex(null);
    setCurrentSlideIndex(0);
    setIsCaptionExpanded(false);
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
    setIsCaptionExpanded(false);
  }, [selectedSetIndex, slideSets.length]);

  const handlePrevSet = useCallback(() => {
    if (selectedSetIndex === null) return;
    const prevIdx = (selectedSetIndex - 1 + slideSets.length) % slideSets.length;
    setSelectedSetIndex(prevIdx);
    setCurrentSlideIndex(0);
    setIsCaptionExpanded(false);
  }, [selectedSetIndex, slideSets.length]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextSlide();
    } else if (isRightSwipe) {
      handlePrevSlide();
    }
  };

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
      {/* Scroll Navigation Buttons (Desktop) */}
      <button
        onClick={() => scroll('left')}
        className="hidden md:flex absolute -left-3 top-1/2 z-20 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white shadow-xl border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-red-600"
        aria-label="Scroll Left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <button
        onClick={() => scroll('right')}
        className="hidden md:flex absolute -right-3 top-1/2 z-20 -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-black/80 text-white shadow-xl border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 hover:bg-red-600"
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

      {/* Mobile-First Fullscreen Instagram-Style Modal Viewer */}
      <AnimatePresence>
        {selectedSet && selectedSetIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 md:bg-black/90 md:backdrop-blur-lg p-0 md:p-6"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[92vh] bg-black md:bg-zinc-950 md:border md:border-zinc-800 md:rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Top Header (Mobile Instagram Style) */}
              <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent pointer-events-auto">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-md">
                    TAM
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">tamparananakmuda</span>
                      <span className="text-[10px] text-red-500 font-semibold uppercase bg-red-500/10 border border-red-500/20 px-1.5 py-0.2 rounded">
                        Original
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">
                      {new Date(selectedSet.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Share button in header for mobile quick share */}
                  <button
                    onClick={copyShareLink}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all border border-white/10"
                    aria-label="Bagikan"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/80 hover:text-white hover:bg-black/90 transition-all border border-white/10"
                    aria-label="Tutup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Main Media View Area (Native Mobile Swipe + Aspect Ratio Preserved) */}
              <div 
                className="relative flex-1 bg-black flex items-center justify-center overflow-hidden touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedSetIndex}-${currentSlideIndex}`}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className="relative w-full h-full flex items-center justify-center py-14 md:py-0"
                  >
                    <Image
                      src={selectedSet.slides[currentSlideIndex]}
                      alt={`Slide ${currentSlideIndex + 1}`}
                      fill
                      className="object-contain max-h-[72vh] md:max-h-[85vh]"
                      priority
                      unoptimized
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows (Desktop / Tablet) */}
                <button
                  onClick={handlePrevSlide}
                  className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all border border-white/10 shadow-lg"
                  aria-label="Slide sebelumnya"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={handleNextSlide}
                  className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white/90 hover:bg-black/90 hover:scale-110 active:scale-95 transition-all border border-white/10 shadow-lg"
                  aria-label="Slide berikutnya"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>

                {/* Top Center Slide Pill (Instagram Style: 1/10) */}
                <div className="absolute top-16 md:top-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold font-mono text-white/90 border border-white/10 z-20">
                  {currentSlideIndex + 1} / {selectedSet.slides.length}
                </div>

                {/* Bottom Story-style Progress Bars (Top of image overlay) */}
                <div className="absolute top-14 left-3 right-3 flex gap-1 z-20 pointer-events-none">
                  {selectedSet.slides.map((_, idx) => (
                    <div
                      key={idx}
                      className="h-1 flex-1 rounded-full bg-white/20 overflow-hidden"
                    >
                      <div
                        className={`h-full bg-red-500 transition-all duration-300 ${
                          idx === currentSlideIndex
                            ? 'w-full'
                            : idx < currentSlideIndex
                            ? 'w-full bg-white/60'
                            : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram-Style Expandable Caption Sheet (Bottom Docked on Mobile, Right Column on Desktop) */}
              <div className="w-full md:w-[380px] lg:w-[420px] bg-zinc-950/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-zinc-800/80 flex flex-col justify-between max-h-[35vh] md:max-h-none overflow-y-auto">
                <div className="p-4 md:p-6 space-y-3">
                  {/* Caption Title & Instagram "...selengkapnya" Expand Trigger */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-500">
                        Caption & Penjelasan
                      </span>
                      <button
                        onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                        className="md:hidden text-xs text-red-400 font-semibold flex items-center gap-1 hover:text-red-300"
                      >
                        <span>{isCaptionExpanded ? 'Sembunyikan' : 'Selengkapnya...'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCaptionExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div className={`text-xs md:text-sm text-zinc-200 whitespace-pre-line leading-relaxed transition-all duration-300 ${
                      isCaptionExpanded 
                        ? 'max-h-[50vh] overflow-y-auto pr-1' 
                        : 'line-clamp-2 md:line-clamp-none md:max-h-[320px] md:overflow-y-auto'
                    }`}>
                      {selectedSet.caption || 'Konten Tamparan Anak Muda - Perspektif Gen Z.'}
                    </div>
                  </div>
                </div>

                {/* Footer Controls (Desktop & Mobile Nav Switcher) */}
                <div className="p-3 md:p-6 border-t border-zinc-800/80 bg-zinc-950">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={copyShareLink}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 md:py-2.5 md:px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-all active:scale-95"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Link Tersalin!' : 'Salin Link'}</span>
                    </button>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <button
                        onClick={handlePrevSet}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800"
                        title="Set Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextSet}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-all border border-zinc-800"
                        title="Set Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
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
