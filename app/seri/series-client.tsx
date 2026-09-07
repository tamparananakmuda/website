'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Layers,
  Sparkles,
  Clock,
  Flame,
  Calendar,
  ChevronRight,
  ArrowRight,
  Search,
  X,
  FileText,
  Compass,
  CheckCircle2,
} from 'lucide-react';

export interface SeriesPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readingTime: number;
  seriesOrder: number | null;
  coverImageUrl?: string | null;
}

export interface PublishedSeriesItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  postCount: number;
  totalReadingMinutes: number;
  category: {
    id: string;
    title: string;
    slug: string;
    color: string;
  } | null;
  posts: SeriesPostItem[];
  coverImageSrc: string;
}

export interface ComingSoonSeriesItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status?: 'published' | 'coming-soon' | 'scheduled';
  expectedDate?: string;
  expectedParts?: number;
  teaser?: string;
}

interface SeriesClientProps {
  publishedSeries: PublishedSeriesItem[];
  comingSoonSeries: ComingSoonSeriesItem[];
  stats: {
    totalPublished: number;
    totalArticles: number;
    totalMinutes: number;
    totalRoadmap: number;
  };
}

export function SeriesClient({
  publishedSeries,
  comingSoonSeries,
  stats,
}: SeriesClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'roadmap'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter series based on search query
  const filteredPublished = useMemo(() => {
    if (!searchQuery.trim()) return publishedSeries;
    const q = searchQuery.toLowerCase();
    return publishedSeries.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.category && s.category.title.toLowerCase().includes(q)) ||
        s.posts.some((p) => p.title.toLowerCase().includes(q))
    );
  }, [publishedSeries, searchQuery]);

  const filteredComingSoon = useMemo(() => {
    if (!searchQuery.trim()) return comingSoonSeries;
    const q = searchQuery.toLowerCase();
    return comingSoonSeries.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q)) ||
        (s.teaser && s.teaser.toLowerCase().includes(q))
    );
  }, [comingSoonSeries, searchQuery]);

  const featured = publishedSeries[0];
  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <div className="space-y-12 sm:space-y-16 pb-20">
      {/* MACRO STATS ROW */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 rounded-2xl border border-border bg-card/95 p-3 sm:p-5 backdrop-blur-md shadow-sm">
          <div className="flex flex-col items-center justify-center p-2 text-center border-r border-border last:border-0">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.totalPublished}
            </span>
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Seri Terbit Aktif
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center sm:border-r border-border last:border-0">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-primary">
              {stats.totalArticles}+
            </span>
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Total Bab / Part
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center border-r border-border last:border-0">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              ~{stats.totalMinutes}
            </span>
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Menit Investigasi
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {stats.totalRoadmap}
            </span>
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-muted-foreground mt-0.5">
              Agenda Riset
            </span>
          </div>
        </div>
      </section>

      {/* FILTER TABS & SEARCH BAR (Sticky or Flow) */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-border pb-4">
          {/* Touch-first Horizontal Scrollable Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Semua Seri</span>
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                {publishedSeries.length + comingSoonSeries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('published')}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'published'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Seri Rilis Aktif</span>
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                {publishedSeries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                activeTab === 'roadmap'
                  ? 'bg-amber-600 text-white dark:bg-amber-500 dark:text-zinc-950 shadow-sm'
                  : 'bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Agenda Riset</span>
              <span className="ml-1 rounded-full bg-background/20 px-1.5 py-0.2 text-[10px] font-mono font-bold">
                {comingSoonSeries.length}
              </span>
            </button>
          </div>

          {/* Quick Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau seri..."
              className="w-full rounded-full border border-border bg-background py-2 pl-9.5 pr-8 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Hapus pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* SPOTLIGHT / FEATURED SERIES (Only if tab === 'all' or 'published', and not filtering search heavily) */}
      {featured && activeTab !== 'roadmap' && !isSearchActive && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md">
            {/* Subtle background glow */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Left Column: Editorial Manifesto & Quick Links */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground uppercase tracking-wider shadow-sm">
                    <Flame className="h-3.5 w-3.5 fill-current" /> Investigasi Utama
                  </span>
                  {featured.category && (
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: featured.category.color }}
                    >
                      {featured.category.title}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                    <Layers className="h-3 w-3 text-primary" /> {featured.postCount} Part
                  </span>
                  <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> ~{featured.totalReadingMinutes} mnt total
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground transition-colors group-hover:text-primary leading-tight">
                  <Link href={`/seri/${featured.slug}`}>{featured.title}</Link>
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                  {featured.description}
                </p>

                {/* 3-Part Chapter Preview Pills */}
                {featured.posts.length > 0 && (
                  <div className="pt-2 space-y-2">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Bab Pilihan Dalam Seri Ini:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {featured.posts.slice(0, 3).map((post, idx) => (
                        <Link
                          key={post.id || idx}
                          href={`/artikel/${post.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-xs text-foreground hover:border-primary/40 hover:text-primary hover:bg-muted transition-all"
                        >
                          <span className="font-mono font-bold text-primary">0{idx + 1}.</span>
                          <span className="truncate max-w-[200px] sm:max-w-[260px]">
                            {post.title}
                          </span>
                        </Link>
                      ))}
                      {featured.posts.length > 3 && (
                        <span className="self-center text-xs font-mono text-muted-foreground px-1">
                          +{featured.posts.length - 3} bab lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Action Button */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/seri/${featured.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow transition-all duration-200 w-full sm:w-auto"
                  >
                    <span>Buka Seluruh Berkas Seri</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  {featured.posts[0] && (
                    <Link
                      href={`/artikel/${featured.posts[0].slug}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-all duration-200 w-full sm:w-auto"
                    >
                      <span>Mulai dari Part 01</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column: Proportional 16:9 Image Visual */}
              <div className="lg:col-span-5">
                <Link
                  href={`/seri/${featured.slug}`}
                  className="block relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border bg-muted shadow-sm group/img"
                >
                  <Image
                    src={featured.coverImageSrc}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                    priority
                    unoptimized={featured.coverImageSrc.startsWith('/api/og/')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Arsip Investigasi Lengkap
                    </span>
                    <span className="text-xs font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                      {featured.postCount} Part
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ALL PUBLISHED SERIES GRID */}
      {activeTab !== 'roadmap' && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-1 rounded-full bg-primary" />
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Daftar Seri Rilis Aktif
                </h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Koleksi artikel mendalam yang telah terbit lengkap dan siap dibaca berurutan.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full self-start sm:self-auto">
              {filteredPublished.length} Seri Tersedia
            </span>
          </div>

          {filteredPublished.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {filteredPublished.map((item, idx) => {
                const categoryColor = item.category?.color || '#D13A3A';

                return (
                  <article
                    key={item.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md"
                  >
                    {/* Top Color Accent Line */}
                    <div
                      className="h-1.5 w-full transition-all duration-300 group-hover:h-2"
                      style={{ backgroundColor: categoryColor }}
                    />

                    {/* Proportional 16:9 Image Cover */}
                    <Link
                      href={`/seri/${item.slug}`}
                      className="relative aspect-[16/9] w-full overflow-hidden bg-muted border-b border-border block"
                    >
                      <Image
                        src={item.coverImageSrc}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized={item.coverImageSrc.startsWith('/api/og/')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Floating Badges on Image */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        {item.category && (
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white shadow"
                            style={{ backgroundColor: categoryColor }}
                          >
                            {item.category.title}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="inline-flex items-center gap-1 font-mono font-bold bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
                          <Layers className="h-3 w-3 text-primary" /> {item.postCount} Part
                        </span>
                        <span className="font-mono bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> ~{item.totalReadingMinutes} mnt
                        </span>
                      </div>
                    </Link>

                    {/* Card Body */}
                    <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 className="mb-2.5 font-display text-xl sm:text-2xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                          <Link href={`/seri/${item.slug}`}>{item.title}</Link>
                        </h3>

                        {/* Description */}
                        {item.description && (
                          <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Chapter Preview / Mini Index */}
                      <div className="space-y-3 pt-4 border-t border-border mt-auto">
                        <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider flex items-center justify-between font-semibold">
                          <span>Daftar Bab Seri</span>
                          <span>Part 01 - 0{item.postCount}</span>
                        </div>

                        <div className="space-y-1.5">
                          {item.posts.slice(0, 3).map((post, pIdx) => (
                            <Link
                              key={post.id || pIdx}
                              href={`/artikel/${post.slug}`}
                              className="flex items-center justify-between text-xs text-foreground/80 hover:text-primary py-1 px-2 rounded-lg hover:bg-muted transition-all group/item"
                            >
                              <span className="truncate pr-2 font-medium flex items-center gap-2">
                                <span className="text-primary font-mono font-bold text-[11px]">
                                  0{pIdx + 1}.
                                </span>
                                <span className="truncate">{post.title}</span>
                              </span>
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover/item:text-primary group-hover/item:translate-x-0.5 transition-all shrink-0" />
                            </Link>
                          ))}
                        </div>

                        {/* Action Footer */}
                        <div className="pt-3 flex items-center justify-between border-t border-border/60">
                          {item.posts[0] && (
                            <Link
                              href={`/artikel/${item.posts[0].slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <span>Mulai dari Part 01</span>
                            </Link>
                          )}
                          <Link
                            href={`/seri/${item.slug}`}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-primary/80 transition-all group-hover:gap-2"
                          >
                            <span>Buka Seri</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-card p-6">
              <Layers className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Tidak ada seri terbit yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-primary hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </section>
      )}

      {/* EDITORIAL ROADMAP SECTION ("Papan Agenda Riset Redaksi") */}
      {activeTab !== 'published' && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-1 rounded-full bg-amber-500" />
                <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Papan Agenda Riset Redaksi
                </h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Dossier investigasi mendatang yang sedang dalam proses audit data, riset lapangan, dan penyusunan naskah.
              </p>
            </div>
            <span className="font-mono text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full self-start sm:self-auto">
              {filteredComingSoon.length} Topik Dalam Antrean
            </span>
          </div>

          {filteredComingSoon.length > 0 ? (
            <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
              {filteredComingSoon.map((item) => (
                <div
                  key={item.id}
                  className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-500/30 bg-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-500/60 hover:shadow-md"
                >
                  <div className="space-y-4">
                    {/* Top Status & Date Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-300 font-mono uppercase">
                        <Calendar className="h-3 w-3" />
                        {item.status === 'scheduled' ? 'Terjadwal' : 'Dalam Riset'}
                      </span>

                      {item.expectedDate && (
                        <span className="text-xs font-mono text-muted-foreground">
                          Target:{' '}
                          {new Date(item.expectedDate).toLocaleDateString('id-ID', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-xl sm:text-2xl font-bold leading-snug text-foreground">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}

                    {/* Provocative Teaser Box */}
                    {item.teaser && (
                      <div className="rounded-xl border-l-4 border-amber-500 bg-muted/60 p-4 text-xs italic text-foreground/90 leading-relaxed font-medium">
                        &ldquo;{item.teaser}&rdquo;
                      </div>
                    )}
                  </div>

                  {/* Footer Info */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>
                      {item.expectedParts
                        ? `${item.expectedParts} Bagian Direncanakan`
                        : 'Penyusunan Multi-Part'}
                    </span>
                    <span className="text-primary font-bold">REDAKSI TAM</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-card p-6">
              <Calendar className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Tidak ada agenda riset yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 text-xs font-bold text-primary hover:underline"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </section>
      )}

      {/* WHISTLEBLOWER & EDITORIAL SUBMISSIONS BANNER */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-6">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-muted/40 to-card p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3.5 py-1 text-xs font-mono font-bold text-primary uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Kolaborasi Redaksi
            </span>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              Punya Bukti atau Isu Sistemik yang Layak Dibongkar?
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Tamparan Anak Muda didedikasikan untuk membahas realitas keras yang sering disembunyikan.
              Jika kamu memiliki temuan lapangan, data industri, atau rekomendasi investigasi penting,
              sampaikan ke meja redaksi kami.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tentang"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-wider text-background hover:opacity-90 transition-opacity"
              >
                <span>Kirim Usulan Investigasi</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/donasi"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-colors"
              >
                <span>Dukung Jurnalisme Independen</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
