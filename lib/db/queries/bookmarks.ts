import { db } from '@/lib/db';
import { bookmarks } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Bookmark } from '@/lib/db/schema';
import { getPostBySlug } from '@/lib/articles/loader';
import type { PostWithRelations } from '@/lib/db/schema';

export async function getBookmarksByUser(userId: string, limit = 10): Promise<(Bookmark & { post?: PostWithRelations })[]> {
  const result = await db.select().from(bookmarks)
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt))
    .limit(limit);

  const enriched = await Promise.all(
    result.map(async (b) => {
      const post = b.postSlug ? await getPostBySlug(b.postSlug) : undefined;
      return { ...b, post: post as PostWithRelations | undefined };
    })
  );
  return enriched;
}

export async function createBookmark(userId: string, postSlug: string): Promise<Bookmark> {
  const result = await db.insert(bookmarks).values({ userId, postSlug }).returning();
  return result[0];
}

export async function deleteBookmark(userId: string, postSlug: string): Promise<void> {
  await db.delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postSlug, postSlug)));
}

export async function isBookmarked(userId: string, postSlug: string): Promise<boolean> {
  const result = await db.select().from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postSlug, postSlug)))
    .limit(1);
  return !!result[0];
}

export async function getBookmarkPostSlugsByUser(userId: string): Promise<string[]> {
  const result = await db.select({ postSlug: bookmarks.postSlug }).from(bookmarks)
    .where(eq(bookmarks.userId, userId));
  return result.map((b) => b.postSlug).filter(Boolean) as string[];
}
