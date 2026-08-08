'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

interface PhotoGalleryProps {
  gallery?: string[];
  title: string;
}

export function PhotoGallery({ gallery, title }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const prevImage = useCallback(() => {
    if (selectedIndex === null || !gallery) return;
    setSelectedIndex((prev) => (prev === 0 ? gallery.length - 1 : (prev as number) - 1));
  }, [selectedIndex, gallery]);

  const nextImage = useCallback(() => {
    if (selectedIndex === null || !gallery) return;
    setSelectedIndex((prev) => (prev === gallery.length - 1 ? 0 : (prev as number) + 1));
  }, [selectedIndex, gallery]);

  // Keyboard navigation & Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedIndex, prevImage, nextImage]);

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-xl font-bold">Dokumentasi Foto</h2>

      {gallery && gallery.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((img, i) => (
            <div
              key={i}
              onClick={() => openLightbox(i)}
              className="group relative aspect-[3/2] cursor-pointer overflow-hidden rounded-xl bg-card border border-border shadow-sm"
            >
              <Image
                src={img}
                alt={`${title} - Foto ${i + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex aspect-[3/2] items-center justify-center rounded-xl border border-dashed border-border bg-muted/20"
            >
              <Heart size={24} className="text-muted-foreground/20" />
            </div>
          ))}
        </div>
      )}

      {(!gallery || gallery.length === 0) && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Foto akan tersedia setelah kegiatan berlangsung
        </p>
      )}

      {/* Lightbox / Gallery Modal Popup */}
      {selectedIndex !== null && gallery && gallery.length > 0 && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-all animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Header Bar inside Lightbox */}
          <div 
            className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-sm font-medium text-white/80">
              {title} <span className="text-white/40">•</span> {selectedIndex + 1} / {gallery.length}
            </div>
            <button
              onClick={closeLightbox}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Tutup foto"
            >
              <X size={20} />
            </button>
          </div>

          {/* Prev Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95 md:left-8"
            aria-label="Foto sebelumnya"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Active Image Display */}
          <div 
            className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[selectedIndex]}
              alt={`${title} - Foto ${selectedIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95 md:right-8"
            aria-label="Foto berikutnya"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </section>
  );
}
