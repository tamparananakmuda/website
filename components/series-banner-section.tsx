'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Sparkles } from 'lucide-react';
import type { SocialPost } from '@/lib/db/schema';

interface SeriesData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bgGradient: string;
  accentColor: string;
  tag: string;
}

interface Props {
  seriesInfo: SeriesData;
  posts: SocialPost[];
}

export default function SeriesBannerSection({ seriesInfo, posts }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (posts.length === 0) return null;

  const handleScroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 300;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-6 md:p-8 shadow-2xl backdrop-blur-xl">
      {/* Background Glow */}
      <div className={`absolute -top-24 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl ${seriesInfo.bgGradient}`} />

      <div className="relative z-10 grid lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Left: Series Branding Banner Card */}
        <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>SERI SPESIAL TAM+</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
            {seriesInfo.title}
          </h2>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {seriesInfo.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-mono font-medium text-primary">
              #{seriesInfo.tag}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              • {posts.length} Konten
            </span>
          </div>
        </div>

        {/* Right: Scrollable Posts Carousel */}
        <div className="lg:col-span-8 relative">
          <div className="mb-3 flex justify-end gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card/80 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {posts.map((post) => (
              <Link
                key={post.id.toString()}
                href={`/sosial/${post.id}`}
                className="group relative w-[240px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] bg-black overflow-hidden">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                      sizes="240px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <span className="text-xs text-muted-foreground font-bold">TAM+</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/30 backdrop-blur-md group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-xs font-bold leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {post.title || post.contentText || 'Konten Seri'}
                  </h4>
                  {post.authorName && (
                    <p className="mt-1 text-[11px] text-muted-foreground">{post.authorName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
