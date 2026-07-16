import { db } from '@/lib/db';
import { posts, categories } from '@/lib/db/schema';
import { eq, desc, asc, and, ilike, or } from 'drizzle-orm';
import type { Post, PostWithRelations, Tag } from '@/lib/db/schema';

function mapToPostWithRelations(p: Record<string, unknown> & { postTags?: { tag: Tag }[] }): PostWithRelations {
  const tags: Tag[] = (p.postTags ?? []).map((pt: { tag: Tag }) => pt.tag);
  return {
    ...p,
    tags,
  } as PostWithRelations;
}

export async function getPublishedPosts(limit = 10): Promise<Post[]> {
  return db.select().from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPublishedPostsWithRelations(limit = 10): Promise<PostWithRelations[]> {
  const result = await db.query.posts.findMany({
    where: eq(posts.status, 'published'),
    orderBy: desc(posts.publishedAt),
    limit,
    with: {
      category: true,
      subcategory: true,
      series: true,
      author: true,
      postTags: { with: { tag: true } },
    },
  });
  return result.map(mapToPostWithRelations);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const result = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return result[0];
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | undefined> {
  const result = await db.select().from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, 'published')))
    .limit(1);
  return result[0];
}

export async function getPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  const result = await db.query.posts.findFirst({
    where: eq(posts.slug, slug),
    with: {
      category: true,
      subcategory: true,
      series: true,
      author: true,
      postTags: { with: { tag: true } },
    },
  });
  if (!result) return undefined;
  return mapToPostWithRelations(result);
}

export async function getPublishedPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  const result = await db.query.posts.findFirst({
    where: and(eq(posts.slug, slug), eq(posts.status, 'published')),
    with: {
      category: true,
      subcategory: true,
      series: true,
      author: true,
      postTags: { with: { tag: true } },
    },
  });
  if (!result) return undefined;
  return mapToPostWithRelations(result);
}

export async function getPostsByCategory(categoryId: string, limit = 10): Promise<Post[]> {
  return db.select().from(posts)
    .where(and(eq(posts.categoryId, categoryId), eq(posts.status, 'published')))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getPostsByCategorySlug(slug: string, limit = 10): Promise<PostWithRelations[]> {
  const category = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  if (!category[0]) return [];
  const result = await db.query.posts.findMany({
    where: and(eq(posts.categoryId, category[0].id), eq(posts.status, 'published')),
    orderBy: desc(posts.publishedAt),
    limit,
    with: {
      category: true,
      subcategory: true,
      series: true,
      author: true,
      postTags: { with: { tag: true } },
    },
  });
  return result.map(mapToPostWithRelations);
}

export async function getPostsBySeries(seriesId: string, limit = 10): Promise<Post[]> {
  return db.select().from(posts)
    .where(and(eq(posts.seriesId, seriesId), eq(posts.status, 'published')))
    .orderBy(asc(posts.seriesOrder))
    .limit(limit);
}

export async function getFeaturedPosts(limit = 5): Promise<PostWithRelations[]> {
  const result = await db.query.posts.findMany({
    where: and(eq(posts.status, 'published'), eq(posts.featured, true)),
    orderBy: desc(posts.publishedAt),
    limit,
    with: {
      category: true,
      subcategory: true,
      series: true,
      author: true,
      postTags: { with: { tag: true } },
    },
  });
  return result.map(mapToPostWithRelations);
}

export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  return db.select().from(posts)
    .where(and(
      eq(posts.status, 'published'),
      or(
        ilike(posts.title, `%${query}%`),
        ilike(posts.excerpt, `%${query}%`),
        ilike(posts.body, `%${query}%`),
      )
    ))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}

export async function getScheduledPosts(): Promise<Post[]> {
  return db.select().from(posts)
    .where(eq(posts.status, 'scheduled'))
    .orderBy(asc(posts.publishedAt));
}

export async function updatePostStatus(id: string, status: string): Promise<void> {
  await db.update(posts).set({ status, updatedAt: new Date().toISOString() }).where(eq(posts.id, id));
}

export async function getAllPostsForOG(): Promise<Post[]> {
  return db.select().from(posts)
    .where(eq(posts.status, 'published'))
    .orderBy(desc(posts.publishedAt));
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0];
}

export async function updatePostOGUrls(id: string, urls: { ogCardUrl?: string; ogFeatureUrl?: string; ogImageUrl?: string }): Promise<void> {
  await db.update(posts).set({ ...urls, updatedAt: new Date().toISOString() }).where(eq(posts.id, id));
}
