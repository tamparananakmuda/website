import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { postMetadata } from '@/lib/db/schema';
import type { Post, PostWithRelations } from '@/lib/db/schema';
import {
  getPublishedPosts as fileGetPublishedPosts,
  getPublishedPostsWithRelations as fileGetPublishedPostsWithRelations,
  getPublishedPostsWithPagination as fileGetPublishedPostsWithPagination,
  getAllPublishedPostsWithRelations as fileGetAllPublishedPostsWithRelations,
  getPostBySlug as fileGetPostBySlug,
  getPublishedPostBySlug as fileGetPublishedPostBySlug,
  getPostWithRelationsBySlug as fileGetPostWithRelationsBySlug,
  getPublishedPostWithRelationsBySlug as fileGetPublishedPostWithRelationsBySlug,
  getPostsByCategorySlug as fileGetPostsByCategorySlug,
  getPostsBySeries as fileGetPostsBySeries,
  getFeaturedPosts as fileGetFeaturedPosts,
  searchPosts as fileSearchPosts,
  searchPostsWithCategory as fileSearchPostsWithCategory,
  getScheduledPosts as fileGetScheduledPosts,
  getAllPostsForOG as fileGetAllPostsForOG,
  getRelatedPosts as fileGetRelatedPosts,
  getPublishedPostsForSitemap as fileGetPublishedPostsForSitemap,
  countPublishedPostsInSeries as fileCountPublishedPostsInSeries,
  getAnalyticsOverview as fileGetAnalyticsOverview,
  getNonSeriesPublishedPostsWithRelations as fileGetNonSeriesPublishedPostsWithRelations,
  getLatestSeriesWithPosts as fileGetLatestSeriesWithPosts,
} from '@/lib/articles/loader';

export async function getPublishedPosts(limit = 10): Promise<Post[]> {
  return fileGetPublishedPosts(limit);
}

export async function getPublishedPostsWithRelations(limit = 10): Promise<PostWithRelations[]> {
  return fileGetPublishedPostsWithRelations(limit);
}

export async function getPublishedPostsWithPagination(page: number, perPage: number): Promise<{ posts: PostWithRelations[]; total: number; totalPages: number }> {
  return fileGetPublishedPostsWithPagination(page, perPage);
}

export async function getAllPublishedPostsWithRelations(): Promise<PostWithRelations[]> {
  return fileGetAllPublishedPostsWithRelations();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  return fileGetPostBySlug(slug);
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | undefined> {
  return fileGetPublishedPostBySlug(slug);
}

export async function getPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  return fileGetPostWithRelationsBySlug(slug);
}

export async function getPublishedPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  return fileGetPublishedPostWithRelationsBySlug(slug);
}

export async function getPostsByCategory(categoryId: string, limit = 10): Promise<Post[]> {
  const { getCategoryById } = await import('@/content/config');
  const cat = getCategoryById(categoryId);
  if (!cat) return [];
  const result = await fileGetPostsByCategorySlug(cat.slug, limit);
  return result as unknown as Post[];
}

export async function getPostsByCategorySlug(slug: string, limit = 10): Promise<PostWithRelations[]> {
  return fileGetPostsByCategorySlug(slug, limit);
}

export async function getPostsBySeries(seriesIdOrSlug: string, limit = 10): Promise<Post[]> {
  const { getSeriesById, getSeriesBySlug } = await import('@/content/config');
  const sr = getSeriesBySlug(seriesIdOrSlug) ?? getSeriesById(seriesIdOrSlug);
  if (!sr) return [];
  return fileGetPostsBySeries(sr.slug, limit);
}

export async function getFeaturedPosts(limit = 5): Promise<PostWithRelations[]> {
  return fileGetFeaturedPosts(limit);
}

export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  return fileSearchPosts(query, limit);
}

export async function searchPostsWithCategory(query: string, categorySlug?: string, limit = 10): Promise<PostWithRelations[]> {
  return fileSearchPostsWithCategory(query, categorySlug, limit);
}

export async function getScheduledPosts(): Promise<Post[]> {
  return fileGetScheduledPosts();
}

export async function updatePostStatus(id: string, status: string): Promise<void> {
  // No-op: posts are now file-based. Edit frontmatter directly.
  console.log('[posts] updatePostStatus is deprecated - posts are file-based now');
}

export async function getAllPostsForOG(): Promise<Post[]> {
  return fileGetAllPostsForOG();
}

export async function getPostById(id: string): Promise<Post | undefined> {
  // Try to find by slug (id may be a slug or "file-{slug}" format)
  const slug = id.startsWith('file-') ? id.slice(5) : id;
  return fileGetPostBySlug(slug);
}

export async function updatePostOGUrls(slug: string, urls: { ogCardUrl?: string; ogFeatureUrl?: string; ogImageUrl?: string }): Promise<void> {
  await db.insert(postMetadata)
    .values({
      slug,
      ogCardUrl: urls.ogCardUrl ?? null,
      ogFeatureUrl: urls.ogFeatureUrl ?? null,
      ogImageUrl: urls.ogImageUrl ?? null,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: postMetadata.slug,
      set: {
        ogCardUrl: urls.ogCardUrl ?? null,
        ogFeatureUrl: urls.ogFeatureUrl ?? null,
        ogImageUrl: urls.ogImageUrl ?? null,
        updatedAt: new Date().toISOString(),
      },
    });
}

export async function getRelatedPosts(categoryIdOrSlug: string, excludeIdOrSlug: string, limit = 3): Promise<PostWithRelations[]> {
  const { getCategoryById, getCategoryBySlug } = await import('@/content/config');
  const cat = getCategoryBySlug(categoryIdOrSlug) ?? getCategoryById(categoryIdOrSlug);
  const catSlug = cat?.slug ?? categoryIdOrSlug;
  const excludeSlug = excludeIdOrSlug.startsWith('file-') ? excludeIdOrSlug.slice(5) : excludeIdOrSlug;
  return fileGetRelatedPosts(catSlug, excludeSlug, limit);
}

export async function getPublishedPostsForSitemap(): Promise<{ slug: string; updatedAt: string | null }[]> {
  return fileGetPublishedPostsForSitemap();
}

export async function countPublishedPostsInSeries(seriesIdOrSlug: string): Promise<number> {
  const { getSeriesById, getSeriesBySlug } = await import('@/content/config');
  const sr = getSeriesBySlug(seriesIdOrSlug) ?? getSeriesById(seriesIdOrSlug);
  if (!sr) return 0;
  return fileCountPublishedPostsInSeries(sr.slug);
}

export async function getAnalyticsOverview() {
  return fileGetAnalyticsOverview();
}

export async function getNonSeriesPublishedPostsWithRelations(limit = 10): Promise<PostWithRelations[]> {
  return fileGetNonSeriesPublishedPostsWithRelations(limit);
}

export async function getLatestSeriesWithPosts(maxSeries = 3, postsPerSeries = 3) {
  return fileGetLatestSeriesWithPosts(maxSeries, postsPerSeries);
}

export async function getPostsByAuthorSlug(authorSlug: string, limit = 20): Promise<PostWithRelations[]> {
  const { getPostsByAuthorSlug: fileGetPostsByAuthorSlug } = await import('@/lib/articles/loader');
  return fileGetPostsByAuthorSlug(authorSlug, limit);
}
