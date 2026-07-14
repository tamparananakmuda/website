'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, ExternalLink } from 'lucide-react';

interface SocialPost {
  id: number;
  platform: string;
  source_url: string;
  author_name: string | null;
  author_handle: string | null;
  title: string | null;
  excerpt: string | null;
  content_text: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  media_urls: string[];
  tags: string[];
  published_at: string | null;
}

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

export default function SocialGrid({ posts }: { posts: SocialPost[] }) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.platform === filter);
  const platforms = Array.from(new Set(posts.map((p) => p.platform)));

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Belum ada konten sosial yang dipublikasikan.</p>
        <Link href="/" className="text-primary hover:underline mt-2 inline-block">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors"
          >
            <Link href={`/sosial/${post.id}`}>
              {post.thumbnail_url ? (
                <div className="relative aspect-video overflow-hidden bg-secondary">
                  <Image
                    src={post.thumbnail_url}
                    alt={post.title || ''}
                    width={400}
                    height={225}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  {post.video_url && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={`aspect-video ${platformColors[post.platform] || 'bg-secondary'} flex items-center justify-center`}>
                  <span className="text-white text-sm font-medium">{platformLabels[post.platform]}</span>
                </div>
              )}

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs rounded px-2 py-0.5 text-white ${platformColors[post.platform] || 'bg-gray-500'}`}>
                    {platformLabels[post.platform]}
                  </span>
                  {post.author_name && (
                    <span className="text-xs text-muted-foreground truncate">{post.author_name}</span>
                  )}
                </div>

                {post.title && (
                  <h3 className="font-medium text-foreground line-clamp-2 mb-1">{post.title}</h3>
                )}
                {!post.title && post.content_text && (
                  <p className="text-sm text-foreground line-clamp-2 mb-1">{post.content_text}</p>
                )}
                {post.excerpt && !post.title && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                )}

                {post.tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-primary">#{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
