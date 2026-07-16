import { db } from '@/lib/db';
import { readerProfiles, readingHistory, posts, categories } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { ReaderProfile, Post, Category } from '@/lib/db/schema';

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

export async function getReadingHistory(readerId: string, limit = 10): Promise<(typeof readingHistory.$inferSelect & { post?: Post & { category?: Category } })[]> {
  const result = await db.query.readingHistory.findMany({
    where: eq(readingHistory.readerId, readerId),
    orderBy: desc(readingHistory.readAt),
    limit,
    with: {
      post: { with: { category: true } },
    },
  });
  return result as (typeof readingHistory.$inferSelect & { post?: Post & { category?: Category } })[];
}

export async function upsertReadingHistory(readerId: string, postId: string, progress: number): Promise<void> {
  const existing = await db.select().from(readingHistory)
    .where(and(eq(readingHistory.readerId, readerId), eq(readingHistory.postId, postId)))
    .limit(1);

  if (existing[0]) {
    await db.update(readingHistory)
      .set({ progress, readAt: new Date().toISOString() })
      .where(eq(readingHistory.id, existing[0].id));
  } else {
    await db.insert(readingHistory).values({ readerId, postId, progress });
  }
}
