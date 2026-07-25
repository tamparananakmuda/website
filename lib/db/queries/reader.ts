import { db } from '@/lib/db';
import { readerProfiles, readingHistory } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { ReaderProfile } from '@/lib/db/schema';
import { getPostBySlug } from '@/lib/articles/loader';
import type { PostWithRelations } from '@/lib/db/schema';

export async function getReaderProfile(userId: string): Promise<ReaderProfile | undefined> {
  const result = await db.select().from(readerProfiles).where(eq(readerProfiles.userId, userId)).limit(1);
  return result[0];
}

export async function updateReaderProfile(userId: string, data: Partial<typeof readerProfiles.$inferInsert>): Promise<void> {
  await db.update(readerProfiles)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(readerProfiles.userId, userId));
}

export async function isReaderAdmin(userId: string): Promise<boolean> {
  const result = await db.select().from(readerProfiles)
    .where(eq(readerProfiles.userId, userId))
    .limit(1);
  return result[0]?.isAdmin ?? false;
}

export async function getReadingHistory(readerId: string, limit = 10): Promise<(typeof readingHistory.$inferSelect & { post?: PostWithRelations })[]> {
  const result = await db.select().from(readingHistory)
    .where(eq(readingHistory.readerId, readerId))
    .orderBy(desc(readingHistory.readAt))
    .limit(limit);

  const enriched = await Promise.all(
    result.map(async (r) => {
      const post = r.postSlug ? await getPostBySlug(r.postSlug) : undefined;
      return { ...r, post: post as PostWithRelations | undefined };
    })
  );
  return enriched;
}

export async function upsertReadingHistory(readerId: string, postSlug: string, progress: number): Promise<void> {
  const existing = await db.select().from(readingHistory)
    .where(and(eq(readingHistory.readerId, readerId), eq(readingHistory.postSlug, postSlug)))
    .limit(1);

  if (existing[0]) {
    await db.update(readingHistory)
      .set({ progress, readAt: new Date().toISOString() })
      .where(eq(readingHistory.id, existing[0].id));
  } else {
    await db.insert(readingHistory).values({ readerId, postSlug, progress });
  }
}
