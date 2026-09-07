'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarClock, BookOpen, Clock, ChevronRight, Sparkles, Layers } from 'lucide-react';
import type { PostWithRelations } from '@/lib/db/schema';

export type SeriesState = 'in-progress' | 'upcoming' | 'completed';

export interface UpcomingPartItem {
  slug: string;
  title: string;
  excerpt: string;
  seriesOrder: number | null;
  publishedAt: string;
}

export interface SeriesDisplayItem {
  seriesSlug: string;
  seriesTitle: string;
  description: string | null;
  teaser: string | null;
  state: SeriesState;
  totalParts: number;
  publishedCount: number;
  upcomingCount: number;
  startDate: string | null;
  nextReleaseDate: string | null;
  posts: PostWithRelations[];
  upcomingParts: UpcomingPartItem[];
}

interface LatestSeriesProps {
  series: SeriesDisplayItem[];
  defaultActiveSlug?: string;
}

function formatExpectedDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function LatestSeries({ series, defaultActiveSlug }: LatestSeriesProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    defaultActiveSlug || series[0]?.seriesSlug || ''
  );

  if (!series || series.length === 0) return null;

  const activeSeries = series.find((s) => s.seriesSlug === activeSlug) || series[0];
  const isUpcoming = activeSeries.state === 'upcoming';
  const isInProgress = activeSeries.state === 'in-progress';
  const isCompleted = activeSeries.state === 'completed';

  return (
    <section className="border-y border-border py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <span className="font-display text-sm font-medium text-primary">04</span>
              <div className="h-px w-24 bg-border" />
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
                Seri Investigasi
              </span>
            </div>
            <h2 className="font-display text-3xl font-medium leading-tight tracking-tight md:text-4xl">
              Seri Terbaru &amp; Mendatang
            </h2>
          </div>
          <Link
            href="/seri"
            prefetch={false}
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-primary transition-opacity hover:opacity-70 sm:inline-flex"
          >
            Lihat semua seri
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {/* Tab Switcher: Allows switching between Upcoming, In-Progress, and Completed */}
        {series.length > 1 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            {series.map((item) => {
              const isActive = item.seriesSlug === activeSeries.seriesSlug;
              return (
                <button
                  key={item.seriesSlug}
                  type="button"
                  onClick={() => setActiveSlug(item.seriesSlug)}
                  className={`group inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-xs font-medium transition-all md:text-sm ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20'
                      : 'border border-border/80 bg-secondary/50 text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {item.state === 'upcoming' && (
                    <span className="flex h-2 w-2 rounded-full bg-amber-400" />
                  )}
                  {item.state === 'in-progress' && (
                    <span className="flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  )}
                  {item.state === 'completed' && (
                    <span className="flex h-2 w-2 rounded-full bg-primary/40" />
                  )}
                  <span>
                    {item.state === 'upcoming'
                      ? 'Segera Rilis: '
                      : item.state === 'in-progress'
                        ? 'Sedang Tayang: '
                        : 'Seri Lengkap: '}
                    <strong className="font-semibold">{item.seriesTitle.split(':')[0]}</strong>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Series Box */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary/30 p-6 md:p-8">
          {/* Active Series Header */}
          <div className="mb-8 flex flex-col gap-5 border-b border-border/60 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {isUpcoming && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 dark:text-amber-400">
                    <CalendarClock size={13} />
                    SEGERA RILIS • {activeSeries.startDate ? formatExpectedDate(activeSeries.startDate) : 'Segera Hadir'} • {activeSeries.totalParts} Bagian
                  </span>
                )}
                {isInProgress && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                    SEDANG TAYANG • {activeSeries.publishedCount} dari {activeSeries.totalParts} Bagian Tersedia
                  </span>
                )}
                {isCompleted && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    <BookOpen size={13} />
                    SERI LENGKAP • {activeSeries.totalParts} Bagian Siap Baca
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {activeSeries.seriesTitle}
              </h3>

              {(activeSeries.teaser || activeSeries.description) && (
                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                  {activeSeries.teaser || activeSeries.description}
                </p>
              )}
            </div>

            <Link
              href={`/seri/${activeSeries.seriesSlug}`}
              prefetch={false}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              {isUpcoming ? 'Lihat Jadwal & Detail' : 'Baca Seri Lengkap'}
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {/* Cards Lineup: Published posts and/or Scheduled upcoming parts */}
          <div className="flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] md:gap-6">
            {/* 1. Render Published Posts */}
            {activeSeries.posts.map((post, idx) => {
              const order = post.seriesOrder ?? idx + 1;
              return (
                <Link
                  key={post.id}
                  href={`/artikel/${post.slug}`}
                  prefetch={false}
                  className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md md:w-[320px]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
                    {post.ogCardUrl || post.ogImageUrl ? (
                      <Image
                        src={post.ogCardUrl || post.ogImageUrl || ''}
                        alt={post.title}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 280px, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-sm font-bold text-primary shadow-sm backdrop-blur-sm">
                      {String(order).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    {post.category && (
                      <span
                        className="mb-2 text-xs font-semibold"
                        style={{ color: post.category.color }}
                      >
                        {post.category.title}
                      </span>
                    )}
                    <h4 className="mb-2 line-clamp-2 text-base font-bold leading-snug transition-colors group-hover:text-primary">
                      {post.title}
                    </h4>
                    {post.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Bagian {order} dari {activeSeries.totalParts}</span>
                      <span>&middot;</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={12} />
                        {post.readingTime} menit
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* 2. Render Scheduled Upcoming Parts */}
            {activeSeries.upcomingParts.map((part) => {
              const order = part.seriesOrder ?? (activeSeries.posts.length + 1);
              return (
                <div
                  key={part.slug}
                  className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-xl border border-dashed border-border/90 bg-background/80 transition-all duration-200 hover:border-primary/40 md:w-[320px]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CalendarClock size={36} className="text-muted-foreground/30" />
                    </div>
                    <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-background/90 text-sm font-bold text-muted-foreground shadow-sm backdrop-blur-sm">
                      {String(order).padStart(2, '0')}
                    </div>
                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-black shadow-sm backdrop-blur-sm">
                        <Sparkles size={11} />
                        Segera Rilis
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-500 dark:text-amber-400">
                      Bagian {order} dari {activeSeries.totalParts}
                    </span>
                    <h4 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-foreground">
                      {part.title}
                    </h4>
                    {part.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {part.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <span className="inline-flex items-center gap-1 text-primary">
                        <CalendarClock size={13} />
                        Rilis {formatExpectedDate(part.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* 3. Teaser card if coming soon has no markdown files yet */}
            {activeSeries.posts.length === 0 && activeSeries.upcomingParts.length === 0 && (
              <div className="group flex w-[280px] shrink-0 flex-col justify-center overflow-hidden rounded-xl border border-dashed border-border bg-background p-6 md:w-[380px]">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                    <CalendarClock size={12} />
                    Segera Tayang
                  </span>
                </div>
                {activeSeries.teaser && (
                  <p className="text-base font-bold leading-snug text-foreground">
                    {activeSeries.teaser}
                  </p>
                )}
                {activeSeries.description && (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {activeSeries.description}
                  </p>
                )}
                {activeSeries.startDate && (
                  <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary">
                    <CalendarClock size={14} />
                    Rilis Perdana: {formatExpectedDate(activeSeries.startDate)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/seri"
            prefetch={false}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Lihat semua seri
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
