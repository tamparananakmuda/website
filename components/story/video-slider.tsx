'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoSliderProps {
  videos: string[];
}

export function VideoSlider({ videos }: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  if (!videos || videos.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold">Dokumentasi Video</h2>
          <p className="text-xs text-muted-foreground">
            Video {currentIndex + 1} dari {videos.length}
          </p>
        </div>

        {videos.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Video sebelumnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Video berikutnya"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition-all hover:bg-accent hover:text-accent-foreground active:scale-95"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-black shadow-lg">
        <div className="relative aspect-[16/9] w-full bg-black">
          <video
            key={videos[currentIndex]}
            src={videos[currentIndex]}
            controls
            preload="metadata"
            className="h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Thumbnails preview strip if multiple videos */}
      {videos.length > 1 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {videos.map((vid, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative flex h-14 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border transition-all ${
                idx === currentIndex
                  ? 'border-primary ring-2 ring-primary/40'
                  : 'border-border opacity-60 hover:opacity-100'
              }`}
            >
              <video src={vid} preload="metadata" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play size={14} className="fill-white text-white" />
              </div>
              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-mono text-white">
                #{idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
