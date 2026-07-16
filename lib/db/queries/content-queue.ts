import { db } from '@/lib/db';
import { contentQueue, subcategories } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import type { ContentQueue, ContentQueueWithPillar } from '@/lib/db/schema';

export async function getContentQueue(): Promise<ContentQueue[]> {
  return db.select().from(contentQueue).orderBy(desc(contentQueue.createdAt));
}

export async function getContentQueueWithPillars(): Promise<ContentQueueWithPillar[]> {
  const result = await db.query.contentQueue.findMany({
    with: { pillar: true },
    orderBy: desc(contentQueue.createdAt),
  });
  return result as ContentQueueWithPillar[];
}

export async function getContentQueueFiltered(filters: { status?: string; pillarId?: string }): Promise<ContentQueueWithPillar[]> {
  const conditions = [];
  if (filters.status && filters.status !== 'all') {
    conditions.push(eq(contentQueue.status, filters.status));
  }
  if (filters.pillarId && filters.pillarId !== 'all') {
    conditions.push(eq(contentQueue.pillarId, filters.pillarId));
  }
  const result = await db.query.contentQueue.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
    with: { pillar: true },
    orderBy: desc(contentQueue.createdAt),
  });
  return result as ContentQueueWithPillar[];
}

export async function getContentQueueById(id: string): Promise<ContentQueue | undefined> {
  const result = await db.select().from(contentQueue).where(eq(contentQueue.id, id)).limit(1);
  return result[0];
}

export async function createContentQueueItem(data: typeof contentQueue.$inferInsert): Promise<ContentQueue> {
  const result = await db.insert(contentQueue).values(data).returning();
  return result[0];
}

export async function updateContentQueueItem(id: string, data: Partial<typeof contentQueue.$inferInsert>): Promise<void> {
  await db.update(contentQueue).set({ ...data, updatedAt: new Date().toISOString() }).where(eq(contentQueue.id, id));
}

export async function deleteContentQueueItem(id: string): Promise<void> {
  await db.delete(contentQueue).where(eq(contentQueue.id, id));
}

export async function getPillars() {
  return db.select().from(subcategories).orderBy(asc(subcategories.title));
}
