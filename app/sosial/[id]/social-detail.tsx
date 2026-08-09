'use client';

import '@/app/prose.css';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Share2, Play, Clock } from 'lucide-react';
import { useState } from 'react';
import { SocialNewsletterCTA } from '@/components/social/social-newsletter-cta';

import type { SocialPost } from '@/lib/db/schema';

interface RelatedPost {
  id: bigint;
  platform: string;
  title: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
}

const platformLabels: Record<string, string> = {
  x: 'X / Twitter',
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

function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function SocialDetail({
  post,
  related,
}: {
  post: SocialPost;
  related: RelatedPost[];
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || 'Konten TAM',
          url,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <div className="mb-4">
        <Link href="/sosial" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Semua konten sosial
        </Link>
      </div>

      {/* Platform badge + share */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-medium text-white ${platformColors[post.platform] || 'bg-gray-700'}`}>
            {platformLabels[post.platform] || post.platform}
          </span>
          {post.duration && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatDuration(post.duration)}
            </span>
          )}
          {post.publishedAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Link tersalin' : 'Bagikan'}
        </button>
      </div>

      {/* Title */}
      {post.title && (
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{post.title}</h1>
      )}

      {/* Author */}
      {post.authorName && (
        <div className="flex items-center gap-3 mb-6">
          {post.authorAvatarUrl ? (
            <Image
              src={post.authorAvatarUrl}
              alt={post.authorName}
              width={40}
              height={40}
              className="rounded-full"
              unoptimized
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-bold">
              {post.authorName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-foreground">{post.authorName}</p>
            {post.authorHandle && (
              <p className="text-xs text-muted-foreground">@{post.authorHandle}</p>
            )}
          </div>
        </div>
      )}

      {/* Video embed */}
      {post.videoUrl && (post.platform === 'youtube' || post.platform === 'tiktok') && (
        <div className="rounded-xl overflow-hidden bg-black aspect-video mb-6">
          <iframe
            src={post.videoUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      {/* Thumbnail for non-video platforms */}
      {!post.videoUrl && post.thumbnailUrl && (
        <Image
          src={post.thumbnailUrl}
          alt={post.title || ''}
          width={800}
          height={450}
          loading="lazy"
          className="w-full rounded-xl mb-6"
          unoptimized
        />
      )}

      {/* Media gallery */}
      {(post.mediaUrls?.length ?? 0) > 0 && !post.videoUrl && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {post.mediaUrls!.map((url, i) => (
            <Image key={i} src={url} alt={`Media ${i + 1}`} width={400} height={300} loading="lazy" className="rounded-lg w-full" unoptimized />
          ))}
        </div>
      )}

      {/* Content text */}
      {post.contentText && (
        <div className="prose prose-invert max-w-none mb-6">
          <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.contentText}</p>
        </div>
      )}

      {/* Excerpt fallback */}
      {!post.contentText && post.excerpt && (
        <p className="text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
      )}

      {/* Transcript for video content */}
      {post.transcript && (
        <details className="mb-6 rounded-lg border border-border bg-card p-4">
          <summary className="cursor-pointer font-medium text-foreground">
            Transkrip video
          </summary>
          <p className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {post.transcript}
          </p>
        </details>
      )}

      {/* Tags */}
      {(post.tags?.length ?? 0) > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          {post.tags!.map((tag) => (
            <span key={tag} className="text-sm text-primary">#{tag}</span>
          ))}
        </div>
      )}

      {/* Source link */}
      <a
        href={post.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-8"
      >
        <ExternalLink className="w-4 h-4" />
        Lihat post asli di {platformLabels[post.platform] || post.platform}
      </a>

      {/* Newsletter funnel */}
      <SocialNewsletterCTA />

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-border pt-8 mt-8">
          <h2 className="font-semibold text-foreground mb-4">Konten lain dari {platformLabels[post.platform]}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/sosial/${r.id}`}
                className="group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
              >
                <div className="relative aspect-video bg-black overflow-hidden">
                  {r.thumbnailUrl ? (
                    <Image src={r.thumbnailUrl} alt={r.title || 'Thumbnail'} fill loading="lazy" className="object-cover group-hover:scale-105 transition-transform" unoptimized sizes="200px" />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                  {r.duration && (
                    <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1 py-0.5 text-xs font-medium text-white">
                      {formatDuration(r.duration)}
                    </span>
                  )}
                </div>
                <p className="p-2 text-xs text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {r.title || 'Tanpa judul'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
