'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Eye, Clock, X, ExternalLink, Share2, Check } from 'lucide-react';
import type { SocialPost } from '@/lib/db/schema';

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views?: number | null): string {
  if (!views) return '2.5K';
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views.toString();
}

interface Props {
  posts: SocialPost[];
}

export default function VideoLandscapeGrid({ posts }: Props) {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id.toString()}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-card/70 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10"
          >
            {/* Thumbnail Video Aspect 16:9 */}
            <div
              onClick={() => setActivePost(post)}
              className="relative aspect-video bg-black cursor-pointer overflow-hidden"
            >
              {post.thumbnailUrl ? (
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title || ''}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-black">
                  <span className="text-sm font-bold text-white/70">Video TAM+</span>
                </div>
              )}

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="h-5 w-5 text-black fill-black ml-0.5" />
                </div>
              </div>

              {/* Duration Badge */}
              {post.duration && (
                <span className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[11px] font-mono font-medium text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  {formatDuration(post.duration)}
                </span>
              )}

              {/* Platform Badge */}
              <span className="absolute top-2.5 left-2.5 rounded-full bg-red-600/90 border border-red-400/30 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-white backdrop-blur-md uppercase">
                {post.platform}
              </span>
            </div>

            {/* Info Body */}
            <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
              <div>
                <Link href={`/sosial/${post.id}`}>
                  <h3 className="font-bold text-sm sm:text-base leading-snug line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                    {post.title || post.contentText || 'Konten Video TAM+'}
                  </h3>
                </Link>

                {post.excerpt && (
                  <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs text-muted-foreground font-mono">
                <span className="truncate max-w-[120px]">
                  {post.authorName || 'Tamparan Anak Muda'}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {formatViews(post.viewCount)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="relative flex flex-col w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 text-white shadow-2xl"
            >
              <button
                onClick={() => setActivePost(null)}
                className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white/80 backdrop-blur-md hover:bg-white hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-video w-full bg-black">
                {activePost.videoUrl ? (
                  <iframe
                    src={activePost.videoUrl}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="relative h-full w-full">
                    {activePost.thumbnailUrl && (
                      <Image
                        src={activePost.thumbnailUrl}
                        alt={activePost.title || ''}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <a
                        href={activePost.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        Tonton Video Lengkap
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold">{activePost.title}</h3>
                {activePost.contentText && (
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">
                    {activePost.contentText}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-xs text-white/60 font-mono">
                    {activePost.authorName} • {activePost.publishedAt ? new Date(activePost.publishedAt).toLocaleDateString('id-ID') : ''}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleShare(activePost)}
                      className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold hover:bg-white/10 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                      {copied ? 'Link Tersalin!' : 'Bagikan'}
                    </button>
                    <a
                      href={activePost.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Buka Asli
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
