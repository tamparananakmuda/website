import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const article = JSON.parse(readFileSync('/tmp/tam-article.json', 'utf8'));

if (article.excerpt && article.excerpt.length > 160) { console.error('FATAL: excerpt > 160 chars'); process.exit(1); }
if (article.seo_meta_description && article.seo_meta_description.length > 160) { console.error('FATAL: seo_meta_description > 160 chars'); process.exit(1); }
if (!Array.isArray(article.source_references)) { console.error('FATAL: source_references must be array'); process.exit(1); }
if (!article.published_at) { console.error('FATAL: published_at is required'); process.exit(1); }
if (!article.slug || !article.title || !article.body) { console.error('FATAL: slug, title, body are required'); process.exit(1); }

const frontmatter: Record<string, any> = {
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt || '',
  publishedAt: article.published_at,
  status: article.status === 'scheduled' ? 'scheduled' : 'published',
  category: article.category || 'kehidupan',
  subcategory: article.subcategory || null,
  author: article.author || 'yovie-setiawan',
  series: null,
  seriesOrder: null,
  povTag: article.pov_tag || 'data',
  tags: [],
  ogHeadline: article.og_headline || article.title,
  seoMetaTitle: article.seo_meta_title || '',
  seoMetaDescription: article.seo_meta_description || '',
  seoKeywords: article.seo_keywords || [],
  sourceReferences: article.source_references.map((r: any) => ({ type: r.type || 'link', url: r.url, label: r.label || '' })),
  featured: article.featured || false,
  readingTime: article.reading_time || Math.ceil(article.body.split(/\s+/).filter(Boolean).length / 200),
  humanSignature: article.human_signature !== false,
  factCheckStatus: 'verified',
  reviewStatus: 'publish',
  isSponsored: false,
  sponsorName: null,
  sponsorUrl: null,
  sponsorDisclosure: null,
  isPremium: false,
  premiumExcerpt: null,
  coverImageUrl: null,
  coverImageAlt: null,
};

function toYaml(obj: Record<string, any>, indent = ''): string {
  let lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      lines.push(indent + key + ': null');
    } else if (typeof value === 'string') {
      lines.push(indent + key + ': "' + value.replace(/"/g, '\\"') + '"');
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(indent + key + ': ' + value);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(indent + key + ': []');
      } else if (typeof value[0] === 'string') {
        lines.push(indent + key + ':');
        value.forEach(v => lines.push(indent + '  - "' + String(v).replace(/"/g, '\\"') + '"'));
      } else {
        lines.push(indent + key + ':');
        value.forEach(v => {
          lines.push(indent + '  - ' + JSON.stringify(v));
        });
      }
    } else if (typeof value === 'object') {
      lines.push(indent + key + ':');
      lines.push(toYaml(value, indent + '  '));
    }
  }
  return lines.join('\n');
}

const yaml = toYaml(frontmatter);
const markdown = '---\n' + yaml + '\n---\n\n' + article.body + '\n';
const articlesDir = join(process.cwd(), 'content', 'articles', 'karier');
mkdirSync(articlesDir, { recursive: true });
const filePath = join(articlesDir, article.slug + '.md');
writeFileSync(filePath, markdown, 'utf8');
console.log('File created:', filePath);
console.log('slug:', article.slug, '| status:', frontmatter.status, '| published_at:', frontmatter.publishedAt);
