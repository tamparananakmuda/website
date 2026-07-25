import { readdirSync, readFileSync, existsSync, writeFileSync, statSync } from 'fs';
import { join } from 'path';
import { unstable_cache } from 'next/cache';
import {
  getCategoryBySlug,
  getSubcategoryBySlug,
  getAuthorBySlug,
  getSeriesBySlug,
  categories as categoriesConfig,
  subcategories as subcategoriesConfig,
} from '@/content/config';
import { parseFrontmatter, markdownToHtml, stringifyFrontmatter } from './parser';
import type { Post, PostWithRelations, Tag } from '@/lib/db/schema';
import { db } from '@/lib/db';
import { postMetadata } from '@/lib/db/schema';
import { eq, inArray } from 'drizzle-orm';

const ARTICLES_DIR = join(process.cwd(), 'content', 'articles');
const SERIES_DIR = join(process.cwd(), 'content', 'seri');

function readDirRecursive(dir: string): string[] {
  const results: string[] = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...readDirRecursive(fullPath));
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

interface RawArticle {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
  status: string;
  categorySlug: string;
  subcategorySlug: string | null;
  authorSlug: string;
  seriesSlug: string | null;
  seriesOrder: number | null;
  povTag: string | null;
  tags: string[];
  ogHeadline: string | null;
  seoMetaTitle: string | null;
  seoMetaDescription: string | null;
  seoKeywords: string[];
  sourceReferences: Array<{ type: string; url: string; label: string }> | null;
  featured: boolean;
  readingTime: number;
  humanSignature: boolean;
  factCheckStatus: string;
  reviewStatus: string;
  isSponsored: boolean;
  sponsorName: string | null;
  sponsorUrl: string | null;
  sponsorDisclosure: string | null;
  isPremium: boolean;
  premiumExcerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  fileName: string;
  updatedAt: string;
  fileMtime: string;
}

function readAllFiles(): RawArticle[] {
  const articles: RawArticle[] = [];

  const articleFiles = existsSync(ARTICLES_DIR)
    ? readdirSync(ARTICLES_DIR).filter((f) => f.endsWith('.md')).map((f) => join(ARTICLES_DIR, f))
    : [];
  const seriesFiles = readDirRecursive(SERIES_DIR);
  const allFiles = [...articleFiles, ...seriesFiles];

  for (const filePath of allFiles) {
    const file = filePath.split('/').pop() || '';
    const content = readFileSync(filePath, 'utf8');
    const parsed = parseFrontmatter(content, file);
    if (!parsed) continue;

    const fm = parsed.frontmatter;
    articles.push({
      slug: fm.slug,
      title: fm.title,
      excerpt: fm.excerpt,
      body: parsed.body,
      publishedAt: fm.publishedAt,
      status: fm.status,
      categorySlug: fm.category,
      subcategorySlug: fm.subcategory,
      authorSlug: fm.author,
      seriesSlug: fm.series,
      seriesOrder: fm.seriesOrder,
      povTag: fm.povTag,
      tags: fm.tags,
      ogHeadline: fm.ogHeadline,
      seoMetaTitle: fm.seoMetaTitle,
      seoMetaDescription: fm.seoMetaDescription,
      seoKeywords: fm.seoKeywords,
      sourceReferences: fm.sourceReferences,
      featured: fm.featured,
      readingTime: fm.readingTime,
      humanSignature: fm.humanSignature,
      factCheckStatus: fm.factCheckStatus,
      reviewStatus: fm.reviewStatus,
      isSponsored: fm.isSponsored,
      sponsorName: fm.sponsorName,
      sponsorUrl: fm.sponsorUrl,
      sponsorDisclosure: fm.sponsorDisclosure,
      isPremium: fm.isPremium,
      premiumExcerpt: fm.premiumExcerpt,
      coverImageUrl: fm.coverImageUrl,
      coverImageAlt: fm.coverImageAlt,
      fileName: file,
      updatedAt: fm.publishedAt,
      fileMtime: statSync(filePath).mtime.toISOString(),
    });
  }

  return articles;
}

function rawToPost(raw: RawArticle): Post {
  const cat = getCategoryBySlug(raw.categorySlug);
  const sub = raw.subcategorySlug ? getSubcategoryBySlug(raw.subcategorySlug) : undefined;
  const author = getAuthorBySlug(raw.authorSlug);
  const sr = raw.seriesSlug ? getSeriesBySlug(raw.seriesSlug) : undefined;

  return {
    id: `file-${raw.slug}` as unknown as string,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt,
    body: raw.body,
    coverImageUrl: raw.coverImageUrl,
    coverImageAlt: raw.coverImageAlt,
    categoryId: cat?.id ?? null,
    seriesId: sr?.id ?? null,
    seriesOrder: raw.seriesOrder ?? null,
    authorId: author?.id ?? null,
    status: raw.status,
    povTag: raw.povTag,
    humanSignature: raw.humanSignature,
    factCheckStatus: raw.factCheckStatus,
    reviewStatus: raw.reviewStatus,
    sourceReferences: raw.sourceReferences,
    readingTime: raw.readingTime,
    publishedAt: raw.publishedAt,
    featured: raw.featured,
    seoMetaTitle: raw.seoMetaTitle,
    seoMetaDescription: raw.seoMetaDescription,
    seoOgImageUrl: null,
    createdAt: raw.publishedAt,
    updatedAt: raw.fileMtime,
    isSponsored: raw.isSponsored,
    sponsorName: raw.sponsorName,
    sponsorUrl: raw.sponsorUrl,
    sponsorDisclosure: raw.sponsorDisclosure,
    isPremium: raw.isPremium,
    premiumExcerpt: raw.premiumExcerpt,
    ogHeadline: raw.ogHeadline,
    subcategoryId: sub?.id ?? null,
    ogCardUrl: null,
    ogFeatureUrl: null,
    ogImageUrl: null,
    seoKeywords: raw.seoKeywords,
  };
}

function rawToPostWithRelations(raw: RawArticle, ogMeta?: { ogCardUrl: string | null; ogFeatureUrl: string | null; ogImageUrl: string | null }): PostWithRelations {
  const post = rawToPost(raw);
  const cat = getCategoryBySlug(raw.categorySlug);
  const sub = raw.subcategorySlug ? getSubcategoryBySlug(raw.subcategorySlug) : undefined;
  const author = getAuthorBySlug(raw.authorSlug);
  const sr = raw.seriesSlug ? getSeriesBySlug(raw.seriesSlug) : undefined;

  const tags: Tag[] = raw.tags.map((t, i) => ({
    id: `tag-${i}-${raw.slug}` as unknown as string,
    name: t,
    slug: t.toLowerCase().replace(/\s+/g, '-'),
    createdAt: raw.publishedAt,
  }));

  return {
    ...post,
    ogCardUrl: ogMeta?.ogCardUrl ?? null,
    ogFeatureUrl: ogMeta?.ogFeatureUrl ?? null,
    ogImageUrl: ogMeta?.ogImageUrl ?? null,
    category: cat as unknown as PostWithRelations['category'],
    subcategory: sub as unknown as PostWithRelations['subcategory'],
    series: sr as unknown as PostWithRelations['series'],
    author: author as unknown as PostWithRelations['author'],
    tags,
  };
}

async function getOgMetadataMap(slugs: string[]): Promise<Map<string, { ogCardUrl: string | null; ogFeatureUrl: string | null; ogImageUrl: string | null }>> {
  if (slugs.length === 0) return new Map();
  try {
    const rows = await db.select().from(postMetadata).where(inArray(postMetadata.slug, slugs));
    const map = new Map<string, { ogCardUrl: string | null; ogFeatureUrl: string | null; ogImageUrl: string | null }>();
    for (const row of rows) {
      map.set(row.slug, { ogCardUrl: row.ogCardUrl, ogFeatureUrl: row.ogFeatureUrl, ogImageUrl: row.ogImageUrl });
    }
    return map;
  } catch {
    return new Map();
  }
}

async function getOgMetadataForSlug(slug: string): Promise<{ ogCardUrl: string | null; ogFeatureUrl: string | null; ogImageUrl: string | null } | undefined> {
  try {
    const rows = await db.select().from(postMetadata).where(eq(postMetadata.slug, slug)).limit(1);
    if (rows.length === 0) return undefined;
    const row = rows[0];
    return { ogCardUrl: row.ogCardUrl, ogFeatureUrl: row.ogFeatureUrl, ogImageUrl: row.ogImageUrl };
  } catch {
    return undefined;
  }
}

const now = () => new Date().toISOString();

export const getAllArticles = unstable_cache(
  async (): Promise<RawArticle[]> => readAllFiles(),
  ['all-articles'],
  { revalidate: 60, tags: ['articles'] }
);

export function getAllArticlesUncached(): RawArticle[] {
  return readAllFiles();
}

async function getPublishedArticles(): Promise<RawArticle[]> {
  const all = await getAllArticles();
  return all
    .filter((a) => a.status === 'published' && a.publishedAt <= now())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

async function getAllArticlesSorted(): Promise<RawArticle[]> {
  const all = await getAllArticles();
  return all.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPublishedPosts(limit = 10): Promise<Post[]> {
  const articles = await getPublishedArticles();
  return articles.slice(0, limit).map(rawToPost);
}

export async function getPublishedPostsWithRelations(limit = 10): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const sliced = articles.slice(0, limit);
  const ogMap = await getOgMetadataMap(sliced.map((a) => a.slug));
  return sliced.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getAllPublishedPostsWithRelations(): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const ogMap = await getOgMetadataMap(articles.map((a) => a.slug));
  return articles.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getNonSeriesPublishedPostsWithRelations(limit = 10): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const filtered = articles.filter((a) => !a.seriesSlug).slice(0, limit);
  const ogMap = await getOgMetadataMap(filtered.map((a) => a.slug));
  return filtered.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getLatestSeriesWithPosts(maxSeries = 3, postsPerSeries = 3): Promise<Array<{ seriesSlug: string; seriesTitle: string; totalParts: number; posts: PostWithRelations[] }>> {
  const articles = await getPublishedArticles();
  const seriesMap = new Map<string, RawArticle[]>();
  for (const a of articles) {
    if (a.seriesSlug) {
      if (!seriesMap.has(a.seriesSlug)) seriesMap.set(a.seriesSlug, []);
      seriesMap.get(a.seriesSlug)!.push(a);
    }
  }
  const result: Array<{ seriesSlug: string; seriesTitle: string; totalParts: number; posts: PostWithRelations[] }> = [];
  const entries = Array.from(seriesMap.entries());
  for (const [seriesSlug, seriesPosts] of entries) {
    const sorted = seriesPosts.sort((a: RawArticle, b: RawArticle) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
    const latest = sorted.slice(-postsPerSeries);
    const ogMap = await getOgMetadataMap(latest.map((a: RawArticle) => a.slug));
    const seriesConfig = getSeriesBySlug(seriesSlug);
    result.push({
      seriesSlug,
      seriesTitle: seriesConfig?.title || seriesSlug,
      totalParts: sorted.length,
      posts: latest.map((a: RawArticle) => rawToPostWithRelations(a, ogMap.get(a.slug))),
    });
  }
  return result.slice(0, maxSeries);
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const all = await getAllArticles();
  const found = all.find((a) => a.slug === slug);
  return found ? rawToPost(found) : undefined;
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | undefined> {
  const articles = await getPublishedArticles();
  const found = articles.find((a) => a.slug === slug);
  return found ? rawToPost(found) : undefined;
}

export async function getPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  const all = await getAllArticles();
  const found = all.find((a) => a.slug === slug);
  if (!found) return undefined;
  const ogMeta = await getOgMetadataForSlug(slug);
  return rawToPostWithRelations(found, ogMeta);
}

export async function getPublishedPostWithRelationsBySlug(slug: string): Promise<PostWithRelations | undefined> {
  const articles = await getPublishedArticles();
  const found = articles.find((a) => a.slug === slug);
  if (!found) return undefined;
  const ogMeta = await getOgMetadataForSlug(slug);
  return rawToPostWithRelations(found, ogMeta);
}

export async function getPostsByCategorySlug(slug: string, limit = 10): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const filtered = articles.filter((a) => a.categorySlug === slug).slice(0, limit);
  const ogMap = await getOgMetadataMap(filtered.map((a) => a.slug));
  return filtered.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getPostsBySeries(seriesSlug: string, limit = 10): Promise<Post[]> {
  const articles = await getPublishedArticles();
  return articles
    .filter((a) => a.seriesSlug === seriesSlug)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
    .slice(0, limit)
    .map(rawToPost);
}

export async function getFeaturedPosts(limit = 5): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const filtered = articles.filter((a) => a.featured).slice(0, limit);
  const ogMap = await getOgMetadataMap(filtered.map((a) => a.slug));
  return filtered.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function searchPosts(query: string, limit = 10): Promise<Post[]> {
  const articles = await getPublishedArticles();
  const q = query.toLowerCase();
  return articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q)
    )
    .slice(0, limit)
    .map(rawToPost);
}

export async function searchPostsWithCategory(
  query: string,
  categorySlug?: string,
  limit = 10
): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const q = query.toLowerCase();
  let filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.body.toLowerCase().includes(q)
  );
  if (categorySlug && categorySlug !== 'all') {
    filtered = filtered.filter((a) => a.categorySlug === categorySlug);
  }
  const sliced = filtered.slice(0, limit);
  const ogMap = await getOgMetadataMap(sliced.map((a) => a.slug));
  return sliced.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeSlug: string,
  limit = 3
): Promise<PostWithRelations[]> {
  const articles = await getPublishedArticles();
  const related = articles
    .filter((a) => a.categorySlug === categorySlug && a.slug !== excludeSlug)
    .slice(0, limit);
  const ogMap = await getOgMetadataMap(related.map((a) => a.slug));
  return related.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getScheduledPosts(): Promise<Post[]> {
  const all = await getAllArticlesSorted();
  return all.filter((a) => a.status === 'scheduled').map(rawToPost);
}

export async function getAllPostsForOG(): Promise<Post[]> {
  const articles = await getPublishedArticles();
  return articles.map(rawToPost);
}

export async function getPublishedPostsForSitemap(): Promise<{ slug: string; updatedAt: string | null }[]> {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug, updatedAt: a.fileMtime }));
}

export async function countPublishedPostsInSeries(seriesSlug: string): Promise<number> {
  const articles = await getPublishedArticles();
  return articles.filter((a) => a.seriesSlug === seriesSlug).length;
}

export async function getAnalyticsOverview() {
  const all = await getAllArticles();
  const published = all.filter((a) => a.status === 'published' && a.publishedAt <= now());
  const drafts = all.filter((a) => a.status === 'draft');

  const postsByCategoryResult = published.map((a) => {
    const cat = getCategoryBySlug(a.categorySlug);
    return { categoryId: cat?.id ?? null, title: cat?.title ?? null, color: cat?.color ?? null };
  });

  const postsByPovTagResult = published
    .filter((a) => a.povTag)
    .map((a) => ({ povTag: a.povTag }));

  const postsByMonthResult = published
    .filter((a) => a.publishedAt)
    .map((a) => ({ publishedAt: a.publishedAt }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 100);

  const topPostsResult = published
    .slice(0, 10)
    .map((a) => ({ id: `file-${a.slug}`, title: a.title, slug: a.slug, publishedAt: a.publishedAt }));

  const postsBySubcategoryResult = published
    .filter((a) => a.subcategorySlug)
    .map((a) => {
      const sub = getSubcategoryBySlug(a.subcategorySlug!);
      return { subcategoryId: sub?.id ?? null, title: sub?.title ?? null };
    });

  return {
    totalResult: [{ count: all.length }],
    publishedResult: [{ count: published.length }],
    draftResult: [{ count: drafts.length }],
    postsByCategoryResult,
    postsByPovTagResult,
    postsByMonthResult,
    pipelineStatsResult: [] as { status: string; count: number }[],
    topPostsResult,
    pillarStatsResult: postsBySubcategoryResult,
  };
}

export async function getPostBodyHtml(slug: string): Promise<string | null> {
  const all = await getAllArticles();
  const found = all.find((a) => a.slug === slug);
  if (!found) return null;
  return markdownToHtml(found.body);
}

export async function getPostsPublishedToday(): Promise<PostWithRelations[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

  const all = await getAllArticles();
  const todayArticles = all
    .filter(
      (a) =>
        a.status === 'published' &&
        a.publishedAt >= startOfDay &&
        a.publishedAt <= endOfDay
    )
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  const ogMap = await getOgMetadataMap(todayArticles.map((a) => a.slug));
  return todayArticles.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function getPostsPublishedThisWeek(): Promise<PostWithRelations[]> {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  weekAgo.setHours(0, 0, 0, 0);

  const all = await getAllArticles();
  const weekArticles = all
    .filter(
      (a) =>
        a.status === 'published' &&
        a.publishedAt >= weekAgo.toISOString()
    )
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
  const ogMap = await getOgMetadataMap(weekArticles.map((a) => a.slug));
  return weekArticles.map((a) => rawToPostWithRelations(a, ogMap.get(a.slug)));
}

export async function publishArticleFile(slug: string): Promise<boolean> {
  const fileName = `${slug}.md`;
  let filePath = join(ARTICLES_DIR, fileName);
  if (!existsSync(filePath)) {
    const seriesFiles = readDirRecursive(SERIES_DIR);
    const found = seriesFiles.find((f) => f.endsWith(fileName));
    if (!found) return false;
    filePath = found;
  }

  const fileContent = readFileSync(filePath, 'utf8');
  const parsed = parseFrontmatter(fileContent, fileName);
  if (!parsed) return false;

  if (parsed.frontmatter.status !== 'scheduled') return false;

  parsed.frontmatter.status = 'published';

  const newContent = stringifyFrontmatter(parsed.frontmatter as unknown as Record<string, unknown>, parsed.body);
  writeFileSync(filePath, newContent, 'utf8');

  return true;
}
