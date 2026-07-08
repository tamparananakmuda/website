'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Search, Loader2, Filter } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  reading_time: number;
  published_at: string | null;
  category: { title: string; slug: string; color: string } | null;
}

interface Category {
  id: string;
  title: string;
  slug: string;
  color: string;
}

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      fetch(`${supabaseUrl}/rest/v1/categories?select=id,title,slug,color&order=title.asc`, {
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch(() => {});
    }
  }, []);

  const performSearch = useCallback(async (q: string, category: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const params = new URLSearchParams({ q });
      if (category !== 'all') params.set('category', category);
      const res = await fetch(`/api/search?${params}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query, selectedCategory);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedCategory, performSearch]);

  return (
    <div>
      <form onSubmit={(e) => { e.preventDefault(); performSearch(query, selectedCategory); }} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artikel, topik, atau kata kunci..."
          className="w-full rounded-full border border-border bg-card pl-12 pr-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          autoFocus
          aria-label="Cari artikel"
        />
      </form>

      {categories.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Filter className="w-3 h-3" />
            Filter:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-muted-foreground py-8">
          Tidak ada hasil untuk &ldquo;{query}&rdquo;. Coba kata kunci lain.
        </p>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {results.length} hasil ditemukan
          </p>
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/artikel/${result.slug}`}
              className="group block rounded-lg border border-border bg-card p-5 hover:border-primary/50 transition-colors"
            >
              <div className="mb-2 flex items-center gap-2 text-sm">
                {result.category && (
                  <span style={{ color: result.category.color }}>
                    {result.category.title}
                  </span>
                )}
                <span className="text-muted-foreground">&middot;</span>
                <span className="text-muted-foreground">{result.reading_time} menit baca</span>
              </div>
              <h2 className="mb-1 font-semibold text-foreground group-hover:text-primary transition-colors">
                {result.title}
              </h2>
              {result.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {result.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {!loading && !searched && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            Coba kata kunci seperti &ldquo;karier&rdquo;, &ldquo;uang&rdquo;, atau &ldquo;mindset&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
