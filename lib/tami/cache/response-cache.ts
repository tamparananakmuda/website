/**
 * Simple in-memory LRU cache for TAMI responses.
 * Caches by normalized query hash to skip full pipeline on identical queries.
 * Entries expire after TTL to ensure freshness.
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const DEFAULT_MAX_SIZE = 50;

export class LRUCache<K, V> {
  private cache = new Map<K, CacheEntry<V>>();
  private ttlMs: number;
  private maxSize: number;
  private stats: CacheStats = { hits: 0, misses: 0, evictions: 0 };

  constructor(ttlMs: number = DEFAULT_TTL_MS, maxSize: number = DEFAULT_MAX_SIZE) {
    this.ttlMs = ttlMs;
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return undefined;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      this.stats.misses++;
      return undefined;
    }

    // Move to end (most recently used) by re-inserting
    this.cache.delete(key);
    this.cache.set(key, entry);
    this.stats.hits++;
    return entry.value;
  }

  set(key: K, value: V): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
        this.stats.evictions++;
      }
    }
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }

  getStats(): CacheStats & { size: number; hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
    };
  }
}

/**
 * Normalize query for cache key: lowercase, trim, remove punctuation.
 */
export function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[?.!,;:'"]/g, '')
    .replace(/\s+/g, ' ');
}

// Singleton cache instance for TAMI responses
import { TamiCognitiveResponse } from '../cognitive/types';

export const tamiResponseCache = new LRUCache<string, TamiCognitiveResponse>(DEFAULT_TTL_MS, 50);
