'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Layers, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import SlideGrid, { SlideSet, getViewCount, formatCount } from '@/components/slide-grid';
import slidesData from '@/files/slides-data.json';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { encodeSocialId } from '@/lib/social/encode';

const ITEMS_PER_PAGE = 20;

export default function AllSlidesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = slidesData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentSlides = (slidesData as SlideSet[]).slice(startIndex, endIndex);

  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const ids = (slidesData as SlideSet[]).slice(start, end).map((s) => s.id).join(',');
    if (!ids) return;
    fetch(`/api/slides/views?ids=${ids}`)
      .then((res) => res.json())
      .then((data: { counts: Record<string, number> }) => {
        setViewCounts((prev) => ({ ...prev, ...data.counts }));
      })
      .catch((err) => console.error('Failed to load slide views:', err));
  }, [currentPage]);

  const handleIncrement = useCallback(async (id: string) => {
    try {
      const res = await fetch('/api/slides/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) return;
      const data = (await res.json()) as { count: number };
      setViewCounts((prev) => ({ ...prev, [id]: data.count }));
    } catch (err) {
      console.error('Failed to increment slide view:', err);
    }
  }, []);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container mx-auto px-4 py-8 md:py-12 space-y-8 min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', href: '/' },
          { name: 'TAM+', href: '/sosial' },
          { name: 'Semua Slide Konten', href: '/sosial/slide' },
        ]}
      />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/sosial" className="hover:text-foreground transition-colors">
            &larr; Kembali ke TAM+
          </Link>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-6 w-1 rounded-full bg-red-600" />
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                Koleksi Slide Konten
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Menampilkan {startIndex + 1} - {Math.min(endIndex, totalItems)} dari total {totalItems} slide infografis.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full w-fit">
            Halaman {currentPage} dari {totalPages}
          </span>
        </div>
      </div>

      {/* Grid Display for 20 items per page */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {currentSlides.map((set, idx) => {
          const globalIdx = startIndex + idx;
          return (
            <SlideGridCardWrapper
              key={set.id || globalIdx}
              set={set}
              globalIdx={globalIdx}
              allSlideSets={slidesData as SlideSet[]}
              viewCount={viewCounts[set.id]}
              onIncrement={handleIncrement}
            />
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 pb-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-border/80 bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <div className="flex items-center gap-1 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`h-9 w-9 text-sm font-medium rounded-lg transition-colors flex items-center justify-center ${
                  currentPage === page
                    ? 'bg-red-600 text-white font-bold shadow-md'
                    : 'bg-card text-muted-foreground hover:text-foreground hover:bg-accent border border-border/50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-border/80 bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </main>
  );
}

// Wrapper card that invokes SlideGrid modal view when clicked
function SlideGridCardWrapper({
  set,
  globalIdx,
  allSlideSets,
  viewCount,
  onIncrement,
}: {
  set: SlideSet;
  globalIdx: number;
  allSlideSets: SlideSet[];
  viewCount: number | undefined;
  onIncrement: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const coverImage = set.slides[0];

  const handleCardClick = () => {
    if (typeof window !== 'undefined' && set.id) {
      window.history.pushState(null, '', `/sosial/${encodeSocialId(set.id)}`);
    }
    setIsOpen(true);
    onIncrement(set.id);
  };

  // Read img_index from URL on mount (for direct links to specific slide)
  useEffect(() => {
    if (!isOpen) return;
    const params = new URLSearchParams(window.location.search);
    const imgIndex = params.get('img_index');
    if (imgIndex) {
      const idx = parseInt(imgIndex, 10) - 1;
      if (idx > 0) {
        // SlideGrid will read from URL
        window.history.replaceState(null, '', `/sosial/${encodeSocialId(set.id)}?img_index=${imgIndex}`);
      }
    }
  }, [isOpen, set.id]);

  const displayViewCount = viewCount != null ? formatCount(viewCount) : getViewCount(set, globalIdx);

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group/card relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/80 hover:border-red-500/50 cursor-pointer shadow-md hover:shadow-red-950/20 transition-all select-none"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={set.caption ? set.caption.slice(0, 50) : `Slide ${set.date}`}
            fill
            className="object-cover group-hover/card:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600 text-xs">
            No Image
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 via-black/30 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md p-1.2 rounded-md text-white/90 border border-white/10">
          <Layers className="w-3.5 h-3.5" />
        </div>

        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-white/90 font-mono font-medium drop-shadow">
          <span className="flex items-center gap-1">
            <Play className="w-3 h-3 fill-white/80" />
            {displayViewCount}
          </span>
          <span className="text-[10px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded backdrop-blur-xs">
            {set.slides.length} Slide
          </span>
        </div>
      </div>

      {isOpen && (
        <SlideGrid slideSets={allSlideSets} initialSelectedId={set.id} mode="modal-only" />
      )}
    </>
  );
}
