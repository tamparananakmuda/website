import { readFileSync, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const WHITEPAPER_DIR = join(process.cwd(), 'content', 'whitepaper');

export interface WhitepaperPost {
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  body: string;
  bodyHtml: string;
  coverImageUrl: string | null;
  author: string;
  downloadUrl: string | null;
  readingTime: number;
  tags: string[];
  status: string;
  publishedAt: string;
  updatedAt: string;
}

interface RawWhitepaper {
  slug: string;
  title: string;
  subtitle: string | null;
  summary: string | null;
  body: string;
  coverImageUrl: string | null;
  author: string;
  downloadUrl: string | null;
  readingTime: number;
  tags: string[];
  status: string;
  publishedAt: string;
  updatedAt: string;
  fileMtime: string;
}

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

function readAllWhitepapers(): RawWhitepaper[] {
  const files = readDirRecursive(WHITEPAPER_DIR);
  const whitepapers: RawWhitepaper[] = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, 'utf8');
    const { data: fm, content: body } = matter(content);

    whitepapers.push({
      slug: fm.slug || filePath.split('/').pop()?.replace(/\.md$/, '') || '',
      title: fm.title || '',
      subtitle: fm.subtitle || null,
      summary: fm.summary || null,
      body,
      coverImageUrl: fm.coverImageUrl || null,
      author: fm.author || 'TAMPARAN ANAK MUDA',
      downloadUrl: fm.downloadUrl || null,
      readingTime: fm.readingTime || 10,
      tags: fm.tags || [],
      status: fm.status || 'draft',
      publishedAt: fm.publishedAt || new Date().toISOString(),
      updatedAt: fm.publishedAt || new Date().toISOString(),
      fileMtime: statSync(filePath).mtime.toISOString(),
    });
  }

  return whitepapers;
}

async function toPost(raw: RawWhitepaper): Promise<WhitepaperPost> {
  const result = await remark().use(html).process(raw.body);
  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    summary: raw.summary,
    body: raw.body,
    bodyHtml: result.toString(),
    coverImageUrl: raw.coverImageUrl,
    author: raw.author,
    downloadUrl: raw.downloadUrl,
    readingTime: raw.readingTime,
    tags: raw.tags,
    status: raw.status,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt,
  };
}

export async function getPublishedWhitepapers(limit = 20): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => w.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return Promise.all(all.map(toPost));
}

export async function getWhitepaperBySlug(slug: string): Promise<WhitepaperPost | undefined> {
  const all = readAllWhitepapers();
  const wp = all.find((w) => w.slug === slug);
  if (!wp) return undefined;
  return toPost(wp);
}

export async function getPublishedWhitepaperBySlug(slug: string): Promise<WhitepaperPost | undefined> {
  const wp = await getWhitepaperBySlug(slug);
  if (!wp || wp.status !== 'published') return undefined;
  return wp;
}

export async function getRelatedWhitepapers(excludeSlug: string, limit = 3): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => w.status === 'published' && w.slug !== excludeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);

  return Promise.all(all.map(toPost));
}

export async function getPublishedWhitepapersForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
  return readAllWhitepapers()
    .filter((w) => w.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((w) => ({ slug: w.slug, updatedAt: w.fileMtime }));
}
