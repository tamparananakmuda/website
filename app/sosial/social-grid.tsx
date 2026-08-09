'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { encodeSocialId } from '@/lib/social/encode';

import type { SocialPost } from '@/lib/db/schema';

const platformLabels: Record<string, string> = {
  x: 'X',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

const platformColors: Record<string, string> = {
  x: 'bg-gray-900',
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
};

const platformTextColors: Record<string, string> = {
  x: 'text-gray-400',
  instagram: 'text-pink-400',
  tiktok: 'text-white',
  youtube: 'text-red-400',
};

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface Props {
  posts: SocialPost[];
  heroPost: SocialPost | null;
  spotlightPosts: SocialPost[];
}

export default function SocialGrid({ posts, heroPost, spotlightPosts }: Props) {
  const [filter, setFilter] = useState<string>('all');
  const carouselRef = useRef<HTMLDivElement>(null);

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.platform === filter);
  const platforms = Array.from(new Set(posts.map((p) => p.platform)));

  const scrollCarousel = (dir: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const amount = 320;
    carouselRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Play className="h-7 w-7 text-muted-foreground" />
          </div>
        </div>
        <p className="text-muted-foreground mb-2">Belum ada konten sosial yang dipublikasikan.</p>
        <p className="text-sm text-muted-foreground/60">Konten video dan reels dari TAM akan muncul di sini.</p>
        <Link href="/" className="text-primary hover:underline mt-4 inline-block">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Hero Featured Video */}
      {heroPost && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid lg:grid-cols-2">
            {/* Video / Thumbnail */}
            <Link href={`/sosial/${encodeSocialId(heroPost.id.toString())}`} className="relative aspect-video bg-black overflow-hidden group">
              {heroPost.thumbnailUrl ? (
                <Image
                  src={heroPost.thumbnailUrl}
                  alt={heroPost.title || ''}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className={`flex h-full items-center justify-center ${platformColors[heroPost.platform] || 'bg-secondary'}`}>
                  <span className="text-white text-lg font-bold">{platformLabels[heroPost.platform]}</span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 group-hover:scale-110 transition-transform">
                  <Play className="h-7 w-7 text-black fill-black ml-1" />
                </div>
              </div>
              {heroPost.duration && (
                <span className="absolute bottom-3 right-3 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                  {formatDuration(heroPost.duration)}
                </span>
              )}
              <span className={`absolute top-3 left-3 rounded px-2 py-1 text-xs font-medium text-white ${platformColors[heroPost.platform] || 'bg-gray-700'}`}>
                {platformLabels[heroPost.platform]}
              </span>
            </Link>

            {/* Info */}
            <div className="flex flex-col justify-center p-6 md:p-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">Featured</span>
                {heroPost.publishedAt && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(heroPost.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              <Link href={`/sosial/${encodeSocialId(heroPost.id.toString())}`}>
                <h2 className="mb-3 text-xl font-bold text-foreground leading-tight hover:text-primary transition-colors md:text-2xl">
                  {heroPost.title || heroPost.contentText?.slice(0, 80) || 'Konten Sosial TAM'}
                </h2>
              </Link>
              {heroPost.excerpt && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{heroPost.excerpt}</p>
              )}
              {heroPost.authorName && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                    {heroPost.authorName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{heroPost.authorName}</p>
                    {heroPost.authorHandle && (
                      <p className="text-xs text-muted-foreground">@{heroPost.authorHandle}</p>
                    )}
                  </div>
                </div>
              )}
              <Link
                href={`/sosial/${encodeSocialId(heroPost.id.toString())}`}
                className="mt-5 inline-flex items-center gap-2 self-start rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Play className="h-4 w-4 fill-current" />
                Tonton Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Spotlight Carousel */}
      {spotlightPosts.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-primary" />
              <h3 className="font-display text-lg font-bold text-foreground">Spotlight</h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {spotlightPosts.map((post) => (
              <Link
                key={post.id}
                href={`/sosial/${encodeSocialId(post.id.toString())}`}
                className="group relative w-[280px] shrink-0 overflow-hidden rounded-xl border border-border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title || ''}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      sizes="280px"
                    />
                  ) : (
                    <div className={`flex h-full items-center justify-center ${platformColors[post.platform] || 'bg-secondary'}`}>
                      <span className="text-white text-sm font-medium">{platformLabels[post.platform]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                  {post.duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                      {formatDuration(post.duration)}
                    </span>
                  )}
                  <span className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-xs font-medium text-white ${platformColors[post.platform] || 'bg-gray-700'}`}>
                    {platformLabels[post.platform]}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title || post.contentText?.slice(0, 60) || 'Konten TAM'}
                  </p>
                  {post.authorName && (
                    <p className="mt-1.5 text-xs text-muted-foreground">{post.authorName}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Filter Tabs */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-8 bg-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">Semua Konten</h3>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua
          </button>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                filter === p
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {platformLabels[p] || p}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
            >
              <Link href={`/sosial/${encodeSocialId(post.id.toString())}`}>
                <div className="relative aspect-video bg-black overflow-hidden">
                  {post.thumbnailUrl ? (
                    <Image
                      src={post.thumbnailUrl}
                      alt={post.title || ''}
                      fill
                      loading="lazy"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className={`flex h-full items-center justify-center ${platformColors[post.platform] || 'bg-secondary'}`}>
                      <span className="text-white text-sm font-medium">{platformLabels[post.platform]}</span>
                    </div>
                  )}
                  {post.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 group-hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 text-black fill-black ml-0.5" />
                      </div>
                    </div>
                  )}
                  {post.duration && (
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
                      {formatDuration(post.duration)}
                    </span>
                  )}
                  <span className={`absolute top-2 left-2 rounded px-1.5 py-0.5 text-xs font-medium text-white ${platformColors[post.platform] || 'bg-gray-700'}`}>
                    {platformLabels[post.platform]}
                  </span>
                </div>

                <div className="p-3">
                  {post.title && (
                    <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </h4>
                  )}
                  {!post.title && post.contentText && (
                    <p className="text-sm text-foreground line-clamp-2 mb-1">{post.contentText}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {post.authorName && <span className="truncate">{post.authorName}</span>}
                    {post.publishedAt && (
                      <>
                        <span>&bull;</span>
                        <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </>
                    )}
                  </div>
                  {(post.tags?.length ?? 0) > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {post.tags!.slice(0, 2).map((tag) => (
                        <span key={tag} className={`text-xs ${platformTextColors[post.platform] || 'text-primary'}`}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
