import { db } from '@/lib/db';
import { comments, commentLikes } from '@/lib/db/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import type { Comment } from '@/lib/db/schema';

export async function getApprovedCommentsByPost(postId: string): Promise<Comment[]> {
  return db.select().from(comments)
    .where(and(eq(comments.postId, postId), eq(comments.status, 'approved')))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: {
  postId: string;
  parentId?: string | null;
  authorName: string;
  authorEmail: string;
  body: string;
  readerId?: string | null;
  status?: string;
}): Promise<Comment> {
  const result = await db.insert(comments).values({
    postId: data.postId,
    parentId: data.parentId ?? null,
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    body: data.body,
    readerId: data.readerId ?? null,
    status: data.status ?? 'pending',
  }).returning();
  return result[0];
}

export async function getCommentById(id: string): Promise<Comment | undefined> {
  const result = await db.select().from(comments).where(eq(comments.id, id)).limit(1);
  return result[0];
}

export async function deleteComment(id: string, readerId: string): Promise<void> {
  await db.delete(comments)
    .where(and(eq(comments.id, id), eq(comments.readerId, readerId)));
}

export async function updateCommentStatus(id: string, status: string): Promise<void> {
  await db.update(comments).set({ status, updatedAt: new Date().toISOString() }).where(eq(comments.id, id));
}

export async function incrementCommentLikes(commentId: string): Promise<void> {
  await db.update(comments)
    .set({ likesCount: sql`${comments.likesCount} + 1` })
    .where(eq(comments.id, commentId));
}

export async function decrementCommentLikes(commentId: string): Promise<void> {
  await db.update(comments)
    .set({ likesCount: sql`${comments.likesCount} - 1` })
    .where(eq(comments.id, commentId));
}

export async function toggleCommentLike(commentId: string, readerId: string): Promise<'liked' | 'unliked'> {
  const existing = await db.select().from(commentLikes)
    .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.readerId, readerId)))
    .limit(1);

  if (existing[0]) {
    await db.delete(commentLikes)
      .where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.readerId, readerId)));
    await decrementCommentLikes(commentId);
    return 'unliked';
  }

  await db.insert(commentLikes).values({ commentId, readerId });
  await incrementCommentLikes(commentId);
  return 'liked';
}
