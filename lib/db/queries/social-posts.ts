import { db } from '@/lib/db';
import { socialPosts } from '@/lib/db/schema';
import { eq, desc, and, inArray, sql } from 'drizzle-orm';
import type { SocialPost } from '@/lib/db/schema';
import { encodeSocialId } from '@/lib/social/encode';

export async function getPublishedSocialPosts(limit = 20): Promise<SocialPost[]> {
  return db.select().from(socialPosts)
    .where(eq(socialPosts.status, 'published'))
    .orderBy(desc(socialPosts.publishedAt))
    .limit(limit);
}

export async function getSocialPostById(id: string): Promise<SocialPost | undefined> {
  const result = await db.select().from(socialPosts).where(eq(socialPosts.id, BigInt(id))).limit(1);
  return result[0];
}

export async function getSocialPostsByPlatform(platform: string, limit = 20): Promise<SocialPost[]> {
  return db.select().from(socialPosts)
    .where(and(eq(socialPosts.platform, platform), eq(socialPosts.status, 'published')))
    .orderBy(desc(socialPosts.publishedAt))
    .limit(limit);
}

export async function createSocialPost(data: typeof socialPosts.$inferInsert): Promise<SocialPost> {
  const result = await db.insert(socialPosts).values(data).returning();
  return result[0];
}

export async function updateSocialPost(id: string, data: Partial<typeof socialPosts.$inferInsert>): Promise<void> {
  await db.update(socialPosts).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(socialPosts.id, BigInt(id)));
}

export async function getPublishedSocialPostsForSitemap(): Promise<{ id: bigint; updatedAt: string | null }[]> {
  return db.select({ id: socialPosts.id, updatedAt: socialPosts.updatedAt }).from(socialPosts)
    .where(eq(socialPosts.status, 'published'))
    .orderBy(desc(socialPosts.createdAt));
}

export async function getPublishedSocialPostById(id: string): Promise<SocialPost | undefined> {
  const result = await db.select().from(socialPosts)
    .where(and(eq(socialPosts.id, BigInt(id)), eq(socialPosts.status, 'published')))
    .limit(1);
  return result[0];
}

export async function getRelatedSocialPosts(platform: string, excludeId: bigint, limit = 4): Promise<SocialPost[]> {
  return db.select().from(socialPosts)
    .where(and(
      eq(socialPosts.status, 'published'),
      eq(socialPosts.platform, platform),
    ))
    .orderBy(desc(socialPosts.publishedAt))
    .limit(limit + 1)
    .then((rows) => rows.filter((r) => r.id !== excludeId).slice(0, limit));
}

export async function getAdminSocialPosts(filters: { status?: string; platform?: string; limit?: number }): Promise<SocialPost[]> {
  const conditions = [];
  if (filters.status && filters.status !== 'all') {
    conditions.push(eq(socialPosts.status, filters.status));
  }
  if (filters.platform && ['x', 'instagram', 'tiktok', 'youtube'].includes(filters.platform)) {
    conditions.push(eq(socialPosts.platform, filters.platform));
  }
  return db.select().from(socialPosts)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(socialPosts.publishedAt))
    .limit(filters.limit ?? 20);
}

export async function deleteSocialPost(id: bigint): Promise<void> {
  await db.delete(socialPosts).where(eq(socialPosts.id, id));
}

export async function getSocialPostBySourceUrl(sourceUrl: string): Promise<SocialPost | undefined> {
  const result = await db.select().from(socialPosts)
    .where(eq(socialPosts.sourceUrl, sourceUrl))
    .limit(1);
  return result[0];
}

export interface SlideViewInput {
  id: string;
  index: number;
  caption: string;
  slides: string[];
  date: string;
}

function slideToSocialPostValues(slide: SlideViewInput) {
  return {
    platform: 'instagram' as const,
    sourceUrl: `https://tamparananakmuda.com/sosial/${encodeSocialId(slide.id)}`,
    sourceId: slide.id,
    contentType: 'carousel' as const,
    status: 'published' as const,
    title: slide.caption ? slide.caption.slice(0, 50) : `Slide ${slide.date}`,
    excerpt: slide.caption ? slide.caption.slice(0, 160) : '',
    contentText: slide.caption,
    mediaUrls: slide.slides,
    viewCount: 100_000 + slide.index * 5_243,
  };
}

export async function getSlideViewCounts(sourceIds: string[]): Promise<Record<string, number>> {
  if (sourceIds.length === 0) return {};
  const rows = await db
    .select({
      sourceId: socialPosts.sourceId,
      viewCount: sql<number>`MAX(${socialPosts.viewCount})::integer`.as('view_count'),
    })
    .from(socialPosts)
    .where(inArray(socialPosts.sourceId, sourceIds))
    .groupBy(socialPosts.sourceId);
  return Object.fromEntries(rows.map(r => [r.sourceId!, r.viewCount ?? 0]));
}

export async function ensureSlideSocialPosts(slides: SlideViewInput[]): Promise<Record<string, number>> {
  const sourceIds = slides.map(s => s.id);
  const existing = await db
    .select({ sourceId: socialPosts.sourceId })
    .from(socialPosts)
    .where(inArray(socialPosts.sourceId, sourceIds))
    .groupBy(socialPosts.sourceId);
  const existingSet = new Set(existing.map(r => r.sourceId!));
  const missing = slides.filter(s => !existingSet.has(s.id));
  if (missing.length > 0) {
    await db.insert(socialPosts).values(missing.map(slideToSocialPostValues));
  }
  return getSlideViewCounts(sourceIds);
}

export async function incrementSlideView(slide: SlideViewInput): Promise<number> {
  const existing = await db
    .select({ id: socialPosts.id, viewCount: socialPosts.viewCount })
    .from(socialPosts)
    .where(eq(socialPosts.sourceId, slide.id))
    .limit(1);

  let postId: bigint;
  let current: number;
  if (existing.length === 0) {
    const result = await db
      .insert(socialPosts)
      .values(slideToSocialPostValues(slide))
      .returning({ id: socialPosts.id, viewCount: socialPosts.viewCount });
    postId = result[0].id;
    current = result[0].viewCount ?? 0;
  } else {
    postId = existing[0].id;
    current = existing[0].viewCount ?? 0;
  }

  const result = await db
    .update(socialPosts)
    .set({ viewCount: sql`${socialPosts.viewCount} + 1`, updatedAt: new Date().toISOString() })
    .where(eq(socialPosts.id, postId))
    .returning({ viewCount: socialPosts.viewCount });

  return result[0].viewCount ?? current + 1;
}
