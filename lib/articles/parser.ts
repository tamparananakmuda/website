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

    const frontmatter: ArticleFrontmatter = {
      title: data.title || '',
      slug: data.slug || fileName.replace(/\.md$/, ''),
      excerpt: data.excerpt || '',
      publishedAt: data.publishedAt || new Date().toISOString(),
      status: data.status || 'draft',
      category: data.category || '',
      subcategory: data.subcategory || null,
      author: data.author || '',
      series: data.series || null,
      seriesOrder: data.seriesOrder || null,
      povTag: data.povTag || null,
      tags: data.tags || [],
      ogHeadline: data.ogHeadline || null,
      seoMetaTitle: data.seoMetaTitle || null,
      seoMetaDescription: data.seoMetaDescription || null,
      seoKeywords: data.seoKeywords || [],
      sourceReferences: data.sourceReferences || null,
      featured: data.featured || false,
      readingTime: data.readingTime || 1,
      humanSignature: data.humanSignature || false,
      factCheckStatus: data.factCheckStatus || 'pending',
      reviewStatus: data.reviewStatus || 'draft',
      isSponsored: data.isSponsored || false,
      sponsorName: data.sponsorName || null,
      sponsorUrl: data.sponsorUrl || null,
      sponsorDisclosure: data.sponsorDisclosure || null,
      isPremium: data.isPremium || false,
      premiumExcerpt: data.premiumExcerpt || null,
      coverImageUrl: data.coverImageUrl || null,
      coverImageAlt: data.coverImageAlt || null,
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
