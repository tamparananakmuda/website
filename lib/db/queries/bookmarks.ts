import { db } from '@/lib/db';
import { bookmarks, posts, categories } from '@/lib/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Bookmark, Post, Category } from '@/lib/db/schema';

export async function getBookmarksByUser(userId: string, limit = 10): Promise<(Bookmark & { post?: Post & { category?: Category } })[]> {
  const result = await db.query.bookmarks.findMany({
    where: eq(bookmarks.userId, userId),
    orderBy: desc(bookmarks.createdAt),
    limit,
    with: {
      post: { with: { category: true } },
    },
  });
  return result as (Bookmark & { post?: Post & { category?: Category } })[];
}

export async function createBookmark(userId: string, postId: string): Promise<Bookmark> {
  const result = await db.insert(bookmarks).values({ userId, postId }).returning();
  return result[0];
}

export async function deleteBookmark(userId: string, postId: string): Promise<void> {
  await db.delete(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)));
}

export async function isBookmarked(userId: string, postId: string): Promise<boolean> {
  const result = await db.select().from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
    .limit(1);
  return !!result[0];
}

export async function getBookmarkPostIdsByUser(userId: string): Promise<string[]> {
  const result = await db.select({ postId: bookmarks.postId }).from(bookmarks)
    .where(eq(bookmarks.userId, userId));
  return result.map((b) => b.postId);
}
