import { readFileSync, readdirSync, existsSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const WHITEPAPER_DIR = join(process.cwd(), 'content', 'whitepaper');

const now = () => new Date().toISOString();

function isPublished(w: { status: string; publishedAt: string }): boolean {
  return (w.status === 'published' || (w.status === 'scheduled' && w.publishedAt <= now())) && w.publishedAt <= now();
}

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
  reportCode: string | null;
  reportYear: number | null;
  reportSeries: string | null;
  isAnnualReport: boolean;
  keyFindings: string[];
  dataSources: string[];
  ogHeadline: string | null;
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
  reportCode: string | null;
  reportYear: number | null;
  reportSeries: string | null;
  isAnnualReport: boolean;
  keyFindings: string[];
  dataSources: string[];
  ogHeadline: string | null;
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
      reportCode: fm.reportCode || null,
      reportYear: fm.reportYear || null,
      reportSeries: fm.reportSeries || null,
      isAnnualReport: fm.isAnnualReport || false,
      keyFindings: fm.keyFindings || [],
      dataSources: fm.dataSources || [],
      ogHeadline: fm.og_headline || null,
    });
  }

  return whitepapers;
}

function extractPublishedContent(body: string): string {
  const startMarker = '<!-- START WHITEPAPER CONTENT -->';
  const endMarker = '<!-- END WHITEPAPER CONTENT -->';
  const startIdx = body.indexOf(startMarker);
  const endIdx = body.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) return body;
  return body.slice(startIdx + startMarker.length, endIdx).trim();
}

async function toPost(raw: RawWhitepaper): Promise<WhitepaperPost> {
  const publishedBody = extractPublishedContent(raw.body);
  const result = await remark().use(html).process(publishedBody);
  return {
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    summary: raw.summary,
    body: publishedBody,
    bodyHtml: result.toString(),
    coverImageUrl: raw.coverImageUrl,
    author: raw.author,
    downloadUrl: raw.downloadUrl,
    readingTime: raw.readingTime,
    tags: raw.tags,
    status: raw.status,
    publishedAt: raw.publishedAt,
    updatedAt: raw.updatedAt,
    reportCode: raw.reportCode,
    reportYear: raw.reportYear,
    reportSeries: raw.reportSeries,
    isAnnualReport: raw.isAnnualReport,
    keyFindings: raw.keyFindings,
    dataSources: raw.dataSources,
    ogHeadline: raw.ogHeadline,
  };
}

export async function getPublishedWhitepapers(limit = 20): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => isPublished(w))
    .sort((a, b) => {
      if (a.reportCode && b.reportCode) return a.reportCode.localeCompare(b.reportCode);
      if (a.reportCode && !b.reportCode) return -1;
      if (!a.reportCode && b.reportCode) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);

  return Promise.all(all.map(toPost));
}

export async function getAnnualReports(year?: number): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => isPublished(w) && w.isAnnualReport)
    .filter((w) => year ? w.reportYear === year : true)
    .sort((a, b) => (a.reportCode || '').localeCompare(b.reportCode || ''));

  return Promise.all(all.map(toPost));
}

export async function getStandaloneWhitepapers(): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => isPublished(w) && !w.isAnnualReport)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return Promise.all(all.map(toPost));
}

export async function getWhitepapersByYear(year: number): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers()
    .filter((w) => isPublished(w) && w.reportYear === year)
    .sort((a, b) => (a.reportCode || '').localeCompare(b.reportCode || ''));

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
  if (!wp) return undefined;
  if (!isPublished(wp)) return undefined;
  return wp;
}

export async function getRelatedWhitepapers(excludeSlug: string, limit = 3): Promise<WhitepaperPost[]> {
  const all = readAllWhitepapers().filter((w) => isPublished(w));

  const current = all.find((w) => w.slug === excludeSlug);
  const currentYear = current?.reportYear;

  const sorted = all
    .filter((w) => w.slug !== excludeSlug)
    .sort((a, b) => {
      const aSameYear = currentYear && a.reportYear === currentYear ? 0 : 1;
      const bSameYear = currentYear && b.reportYear === currentYear ? 0 : 1;
      if (aSameYear !== bSameYear) return aSameYear - bSameYear;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, limit);

  return Promise.all(sorted.map(toPost));
}

export async function getPublishedWhitepapersForSitemap(): Promise<{ slug: string; updatedAt: string }[]> {
  return readAllWhitepapers()
    .filter((w) => isPublished(w))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .map((w) => ({ slug: w.slug, updatedAt: w.fileMtime }));
}

export function getAllWhitepapersRaw(): RawWhitepaper[] {
  return readAllWhitepapers();
}

export function getScheduledWhitepapers(): RawWhitepaper[] {
  return readAllWhitepapers()
    .filter((w) => w.status === 'scheduled')
    .sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
}

export function publishWhitepaperFile(slug: string): boolean {
  const files = readDirRecursive(WHITEPAPER_DIR);
  const filePath = files.find((f) => f.endsWith(`${slug}.md`));
  if (!filePath) return false;

  const fileContent = readFileSync(filePath, 'utf8');
  const { data: fm, content: body } = matter(fileContent);

  if (fm.status !== 'scheduled') return false;

  fm.status = 'published';

  const newContent = matter.stringify(body, fm);
  writeFileSync(filePath, newContent, 'utf8');

  return true;
}
