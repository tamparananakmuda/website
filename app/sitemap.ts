import type { MetadataRoute } from 'next';
import { createPublicClient } from '@/lib/supabase/public';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const supabase = createPublicClient();

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

  const [{ data: posts }, { data: categories }, { data: whitepapers }, { data: socialPosts }, { data: subcategories }] = await Promise.all([
    supabase
      .from('posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('categories')
      .select('slug, updated_at'),
    supabase
      .from('whitepapers')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('social_posts')
      .select('id, updated_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false }),
    supabase
      .from('subcategories')
      .select('slug, category_id, categories(slug)'),
  ]);

  const postPages: MetadataRoute.Sitemap = (posts || []).map((post) => ({
    url: `${siteUrl}/artikel/${post.slug}`,
    lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = (categories || []).map((category) => ({
    url: `${siteUrl}/kategori/${category.slug}`,
    lastModified: category.updated_at ? new Date(category.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const subcategoryPages: MetadataRoute.Sitemap = (subcategories || []).map((sub) => {
    const catSlug = (sub as unknown as { categories?: { slug: string }[] })?.categories?.[0]?.slug;
    if (!catSlug) return null;
    return {
      url: `${siteUrl}/kategori/${catSlug}?pillar=${sub.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    };
  }).filter(Boolean) as MetadataRoute.Sitemap;

  const whitepaperPages: MetadataRoute.Sitemap = (whitepapers || []).map((wp) => ({
    url: `${siteUrl}/whitepaper/${wp.slug}`,
    lastModified: wp.updated_at ? new Date(wp.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const socialPages: MetadataRoute.Sitemap = (socialPosts || []).map((sp) => ({
    url: `${siteUrl}/sosial/${sp.id}`,
    lastModified: sp.updated_at ? new Date(sp.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.4,
  }));

  return [...staticPages, ...postPages, ...categoryPages, ...subcategoryPages, ...whitepaperPages, ...socialPages];
}
