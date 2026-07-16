import { db } from '@/lib/db';
import { whitepapers } from '@/lib/db/schema';
import { eq, desc, and, ne } from 'drizzle-orm';
import type { Whitepaper } from '@/lib/db/schema';

export async function getPublishedWhitepapers(limit = 20): Promise<Whitepaper[]> {
  return db.select().from(whitepapers)
    .where(eq(whitepapers.status, 'published'))
    .orderBy(desc(whitepapers.publishedAt))
    .limit(limit);
}

export async function getWhitepaperBySlug(slug: string): Promise<Whitepaper | undefined> {
  const result = await db.select().from(whitepapers).where(eq(whitepapers.slug, slug)).limit(1);
  return result[0];
}

export async function getPublishedWhitepaperBySlug(slug: string): Promise<Whitepaper | undefined> {
  const result = await db.select().from(whitepapers)
    .where(and(eq(whitepapers.slug, slug), eq(whitepapers.status, 'published')))
    .limit(1);
  return result[0];
}

export async function getRelatedWhitepapers(excludeId: string, limit = 3): Promise<Whitepaper[]> {
  return db.select().from(whitepapers)
    .where(and(eq(whitepapers.status, 'published'), ne(whitepapers.id, excludeId)))
    .orderBy(desc(whitepapers.publishedAt))
    .limit(limit);
}

export async function getPublishedWhitepapersForSitemap(): Promise<{ slug: string; updatedAt: string | null }[]> {
  return db.select({ slug: whitepapers.slug, updatedAt: whitepapers.updatedAt }).from(whitepapers)
    .where(eq(whitepapers.status, 'published'))
    .orderBy(desc(whitepapers.publishedAt));
}
