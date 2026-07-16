import { db } from '@/lib/db';
import { socialPosts } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { SocialPost } from '@/lib/db/schema';

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
