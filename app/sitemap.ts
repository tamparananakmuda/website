import type { MetadataRoute } from 'next';
import { getPublishedPostsForSitemap } from '@/lib/db/queries/posts';
import { getCategoriesForSitemap, getSubcategoriesForSitemap } from '@/lib/db/queries/categories';
import { getPublishedWhitepapersForSitemap } from '@/lib/db/queries/whitepapers';
import { getPublishedSocialPostsForSitemap } from '@/lib/db/queries/social-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/kategori`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/seri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/newsletter-arsip`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/sosial`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/donasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/cari`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${siteUrl}/whitepaper`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const [postsData, categoriesData, whitepapersData, subcategoriesData] = await Promise.all([
    getPublishedPostsForSitemap(),
    getCategoriesForSitemap(),
    getPublishedWhitepapersForSitemap(),
    getSubcategoriesForSitemap(),
  ]);

  let socialPostsData: { id: bigint; updatedAt: string | null }[] = [];
  try {
    socialPostsData = await getPublishedSocialPostsForSitemap();
  } catch {
    // social_posts table may not exist yet in the Drizzle-connected DB
  }

  const postPages: MetadataRoute.Sitemap = postsData.map((post) => ({
    url: `${siteUrl}/artikel/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categoriesData.map((category) => ({
    url: `${siteUrl}/kategori/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const subcategoryPages: MetadataRoute.Sitemap = subcategoriesData.map((sub) => {
    return {
      url: `${siteUrl}/kategori/${sub.categoryId}?pillar=${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  });

  const whitepaperPages: MetadataRoute.Sitemap = whitepapersData.map((wp) => ({
    url: `${siteUrl}/whitepaper/${wp.slug}`,
    lastModified: wp.updatedAt ? new Date(wp.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const socialPages: MetadataRoute.Sitemap = socialPostsData.map((sp) => ({
    url: `${siteUrl}/sosial/${sp.id}`,
    lastModified: sp.updatedAt ? new Date(sp.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...subcategoryPages, ...whitepaperPages, ...socialPages];
}
