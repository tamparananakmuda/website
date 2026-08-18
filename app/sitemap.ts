import type { MetadataRoute } from 'next';
import { getPublishedPostsForSitemap } from '@/lib/db/queries/posts';
import { getCategoriesForSitemap } from '@/lib/db/queries/categories';
import { getPublishedWhitepapersForSitemap } from '@/lib/db/queries/whitepapers';
import { getPublishedSocialPostsForSitemap } from '@/lib/db/queries/social-posts';
import { encodeSocialId } from '@/lib/social/encode';
import { series as seriesConfig } from '@/content/config';
import { getPostsBySeries } from '@/lib/articles/loader';

export const revalidate = 3600;

const STATIC_PAGES_LAST_MODIFIED = new Date('2026-08-09T00:00:00Z');

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/artikel`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kategori`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/seri`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tentang`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/newsletter`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/newsletter-arsip`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/sosial`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/donasi`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/whitepaper`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/kebijakan-privasi`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/syarat-ketentuan`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/disclaimer`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/tami`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/story`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/kebijakan-editorial`,
      lastModified: STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const [postsData, categoriesData, whitepapersData] = await Promise.all([
    getPublishedPostsForSitemap(),
    getCategoriesForSitemap(),
    getPublishedWhitepapersForSitemap(),
  ]);

  let socialPostsData: { id: bigint; updatedAt: string | null }[] = [];
  try {
    socialPostsData = await getPublishedSocialPostsForSitemap();
  } catch {
    // social_posts table may not exist yet in the Drizzle-connected DB
  }

  const postPages: MetadataRoute.Sitemap = (postsData as { slug: string; updatedAt: string | null }[]).map((post) => ({
    url: `${siteUrl}/artikel/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categoriesData as { slug: string; updatedAt: string | null }[]).map((category) => ({
    url: `${siteUrl}/kategori/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  // NOTE: Subcategory pages use ?pillar= query params — not indexable as separate URLs.
  // Excluded from sitemap intentionally; category hub pages already cover them.

  // Only include series that have at least 1 published article
  const seriesWithPosts = await Promise.all(
    seriesConfig.map(async (s) => {
      const posts = await getPostsBySeries(s.slug, 999);
      const publishedPosts = posts.filter((p) => p.status === 'published');
      const latestDate = publishedPosts.length > 0
        ? publishedPosts.reduce((latest, p) => {
            const d = new Date(p.publishedAt || p.updatedAt || 0);
            return d > latest ? d : latest;
          }, new Date(0))
        : null;
      return { slug: s.slug, hasPosts: publishedPosts.length > 0, latestDate };
    })
  );
  const seriPages: MetadataRoute.Sitemap = seriesWithPosts
    .filter((s) => s.hasPosts)
    .map((s) => ({
      url: `${siteUrl}/seri/${s.slug}`,
      lastModified: s.latestDate || STATIC_PAGES_LAST_MODIFIED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  const whitepaperPages: MetadataRoute.Sitemap = (whitepapersData as { slug: string; updatedAt: string | null }[]).map((wp) => ({
    url: `${siteUrl}/whitepaper/${wp.slug}`,
    lastModified: wp.updatedAt ? new Date(wp.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const socialPages: MetadataRoute.Sitemap = socialPostsData.map((sp) => ({
    url: `${siteUrl}/sosial/${encodeSocialId(sp.id.toString())}`,
    lastModified: sp.updatedAt ? new Date(sp.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...seriPages, ...whitepaperPages, ...socialPages];
}
