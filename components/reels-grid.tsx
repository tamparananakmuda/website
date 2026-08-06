'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, X, ExternalLink, Share2, Check } from 'lucide-react';
import type { SocialPost } from '@/lib/db/schema';

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views?: number | null): string {
  if (!views) return '1.2K';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

const platformBadges: Record<string, { label: string; color: string }> = {
  tiktok: { label: 'TikTok', color: 'bg-black/80 text-white border-white/20' },
  instagram: { label: 'Reels', color: 'bg-pink-600/80 text-white border-pink-400/30' },
  youtube: { label: 'Shorts', color: 'bg-red-600/80 text-white border-red-400/30' },
  x: { label: 'X Video', color: 'bg-gray-900/80 text-white border-gray-400/30' },
};

interface Props {
  posts: SocialPost[];
}

export default function ReelsGrid({ posts }: Props) {
  const [activePost, setActivePost] = useState<SocialPost | null>(null);
  const [copied, setCopied] = useState(false);

  if (posts.length === 0) return null;

  const handleShare = (post: SocialPost) => {
    const url = post.sourceUrl || window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {posts.map((post, idx) => {
          const badge = platformBadges[post.platform] || { label: 'Reels', color: 'bg-primary/80 text-primary-foreground' };

          return (
            <motion.div
              key={post.id.toString()}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setActivePost(post)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 aspect-[9/16]"
            >
              {/* Cover Image */}
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title || post.contentText || 'Reels TAM+'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-black p-4 text-center">
                  <span className="text-xs text-muted-foreground line-clamp-4 font-medium">
                    {post.title || post.contentText}
                  </span>
                </div>
              )}

              {/* Dark Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 group-hover:from-black/90 group-hover:via-black/30 transition-colors" />

              {/* Top Badge */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wider backdrop-blur-md ${badge.color}`}>
                  {badge.label}
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 backdrop-blur-md border border-white/30 group-hover:scale-110 transition-transform">
                  <Play className="h-5 w-5 text-white fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Content Info */}
              <div className="absolute bottom-0 inset-x-0 p-3 space-y-1 text-white">
                <p className="text-xs font-semibold leading-tight line-clamp-2 drop-shadow-sm group-hover:text-primary transition-colors">
                  {post.title || post.contentText}
                </p>

                <div className="flex items-center justify-between text-[11px] text-white/80 font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(post.viewCount)}
                  </span>
                  {post.duration && (
                    <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] backdrop-blur-sm">
                      {formatDuration(post.duration)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setActivePost(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col md:flex-row w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-md hover:bg-white hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left: Video / Media Embed Frame */}
              <div className="relative flex-1 aspect-[9/16] md:max-w-[420px] bg-black flex items-center justify-center overflow-hidden">
                {activePost.videoUrl ? (
                  <iframe
                    src={activePost.videoUrl}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : activePost.thumbnailUrl ? (
                  <div className="relative h-full w-full">
                    <Image
                      src={activePost.thumbnailUrl}
                      alt={activePost.title || ''}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <a
                        href={activePost.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Tonton di {activePost.platform.toUpperCase()}
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Media tidak dapat dimuat</p>
                )}
              </div>

              {/* Right: Info & Caption */}
              <div className="flex flex-1 flex-col justify-between p-6 space-y-4 overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/20 text-primary border border-primary/30 px-3 py-1 text-xs font-semibold tracking-wider">
                      {activePost.platform.toUpperCase()} REELS
                    </span>
                    {activePost.publishedAt && (
                      <span className="text-xs text-white/60 font-mono">
                        {new Date(activePost.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold leading-tight">
                    {activePost.title || 'Konten Video TAM+'}
                  </h3>

                  {activePost.contentText && (
                    <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                      {activePost.contentText}
                    </p>
                  )}

                  {activePost.authorName && (
                    <div className="pt-2 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-bold text-xs">
                        {activePost.authorName[0]?.toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {activePost.authorName} {activePost.authorHandle ? `(@${activePost.authorHandle})` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => handleShare(activePost)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold hover:bg-white/10 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                    {copied ? 'Link Tersalin!' : 'Bagikan'}
                  </button>

                  <a
                    href={activePost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka Asli
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
