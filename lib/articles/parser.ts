import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  status: 'draft' | 'review' | 'fact-check' | 'scheduled' | 'published';
  category: string;
  subcategory: string | null;
  author: string;
  series: string | null;
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
  factCheckStatus: 'pending' | 'verified' | 'flagged';
  reviewStatus: 'draft' | 'review' | 'fact-check' | 'publish';
  isSponsored: boolean;
  sponsorName: string | null;
  sponsorUrl: string | null;
  sponsorDisclosure: string | null;
  isPremium: boolean;
  premiumExcerpt: string | null;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  updatedAt: string | null;
}

export interface ParsedArticle {
  frontmatter: ArticleFrontmatter;
  body: string;
  html: string;
  fileName: string;
}

export function parseFrontmatter(fileContent: string, fileName: string): ParsedArticle | null {
  try {
    const { data, content } = matter(fileContent);

    // Helper: read camelCase first, fall back to snake_case
    const get = <T>(camel: string, snake: string, fallback: T): T => {
      if (data[camel] !== undefined) return data[camel] as T;
      if (data[snake] !== undefined) return data[snake] as T;
      return fallback;
    };

    const frontmatter: ArticleFrontmatter = {
      title: data.title || '',
      slug: data.slug || fileName.replace(/\.md$/, ''),
      excerpt: data.excerpt || '',
      publishedAt: data.publishedAt || data.publish_date || new Date().toISOString(),
      status: data.status || 'draft',
      category: data.category || '',
      subcategory: data.subcategory || null,
      author: data.author || '',
      series: data.series || null,
      seriesOrder: get('seriesOrder', 'series_order', null),
      povTag: get('povTag', 'pov', null),
      tags: data.tags || [],
      ogHeadline: get('ogHeadline', 'og_headline', null),
      seoMetaTitle: get('seoMetaTitle', 'seo_meta_title', null),
      seoMetaDescription: get('seoMetaDescription', 'seo_meta_description', null),
      seoKeywords: get('seoKeywords', 'seo_keywords', []),
      sourceReferences: get('sourceReferences', 'source_references', null),
      featured: data.featured || false,
      readingTime: get('readingTime', 'reading_time', 1),
      humanSignature: get('humanSignature', 'human_signature', false),
      factCheckStatus: get('factCheckStatus', 'fact_check_status', 'pending'),
      reviewStatus: get('reviewStatus', 'review_status', 'draft'),
      isSponsored: get('isSponsored', 'is_sponsored', false),
      sponsorName: get('sponsorName', 'sponsor_name', null),
      sponsorUrl: get('sponsorUrl', 'sponsor_url', null),
      sponsorDisclosure: get('sponsorDisclosure', 'sponsor_disclosure', null),
      isPremium: get('isPremium', 'is_premium', false),
      premiumExcerpt: get('premiumExcerpt', 'premium_excerpt', null),
      coverImageUrl: get('coverImageUrl', 'cover_image_url', null),
      coverImageAlt: get('coverImageAlt', 'cover_image_alt', null),
      updatedAt: get('updatedAt', 'updated_at', null),
    };

    return {
      frontmatter,
      body: content.trim(),
      html: '',
      fileName,
    };
  } catch {
    return null;
  }
}

export async function markdownToHtml(md: string): Promise<string> {
  const result = await remark().use(html).process(md);
  return result.toString();
}

export function generateFrontmatterYaml(data: Record<string, unknown>): string {
  return matter.stringify('', data).trim();
}

export function stringifyFrontmatter(frontmatter: Record<string, unknown>, body: string): string {
  return matter.stringify(body, frontmatter);
}
