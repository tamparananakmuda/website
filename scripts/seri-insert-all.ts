import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const dir = '/tmp/tam-seri-drafts/';
const seriesSlug = 'kesehatan-mental-era-digital';
const seriesDir = join(process.cwd(), 'content', 'seri', seriesSlug);
mkdirSync(seriesDir, { recursive: true });

function toYaml(obj: any, indent = ''): string {
  let lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      lines.push(`${indent}${key}: null`);
    } else if (typeof value === 'string') {
      lines.push(`${indent}${key}: "${value.replace(/"/g, '\\"')}"`);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${indent}${key}: ${value}`);
    } else if (Array.isArray(value)) {
      if (value.length === 0) {
        lines.push(`${indent}${key}: []`);
      } else if (typeof value[0] === 'string') {
        lines.push(`${indent}${key}:`);
        value.forEach(v => lines.push(`${indent}  - "${v.replace(/"/g, '\\"')}"`));
      } else {
        lines.push(`${indent}${key}:`);
        value.forEach(v => {
          if (typeof v === 'object') {
            lines.push(`${indent}  - ${JSON.stringify(v)}`);
          } else {
            lines.push(`${indent}  - ${v}`);
          }
        });
      }
    } else if (typeof value === 'object') {
      lines.push(`${indent}${key}:`);
      lines.push(toYaml(value, indent + '  '));
    }
  }
  return lines.join('\n');
}

let success = 0;
let failed = 0;

for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const article = JSON.parse(readFileSync(file, 'utf-8'));

  // Validation
  if (article.excerpt && article.excerpt.length > 160) {
    console.error(`FATAL Part ${i}: excerpt > 160 chars (${article.excerpt.length})`);
    failed++;
    continue;
  }
  if (!Array.isArray(article.source_references)) {
    console.error(`FATAL Part ${i}: source_references must be array`);
    failed++;
    continue;
  }
  if (!article.published_at) {
    console.error(`FATAL Part ${i}: published_at is required`);
    failed++;
    continue;
  }
  if (!article.slug || !article.title || !article.body) {
    console.error(`FATAL Part ${i}: slug, title, body required`);
    failed++;
    continue;
  }
  if (!article.series) {
    console.error(`FATAL Part ${i}: series is required for Seri`);
    failed++;
    continue;
  }
  if (!article.series_order) {
    console.error(`FATAL Part ${i}: series_order is required for Seri`);
    failed++;
    continue;
  }

  const frontmatter = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    publishedAt: article.published_at,
    status: article.status === 'scheduled' ? 'scheduled' : 'published',
    category: article.category || 'kehidupan',
    subcategory: article.subcategory || null,
    author: article.author || 'yovie-setiawan',
    series: article.series,
    seriesOrder: article.series_order,
    povTag: article.pov_tag || 'data',
    tags: [],
    ogHeadline: article.og_headline || article.title,
    seoMetaTitle: article.seo_meta_title || '',
    seoMetaDescription: article.seo_meta_description || '',
    seoKeywords: article.seo_keywords || [],
    sourceReferences: article.source_references.map((r: any) => ({
      type: r.type || 'link',
      url: r.url,
      label: r.label || '',
    })),
    featured: article.featured || false,
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

  const yaml = toYaml(frontmatter);
  const markdown = '---\n' + yaml + '\n---\n\n' + article.body + '\n';
  const filePath = join(seriesDir, article.slug + '.md');

  if (existsSync(filePath)) {
    console.error(`FATAL Part ${i}: file already exists: ${filePath}`);
    failed++;
    continue;
  }

  writeFileSync(filePath, markdown, 'utf8');
  console.log(`Part ${i}: ${article.slug} | series: ${frontmatter.series} | order: ${frontmatter.seriesOrder} | status: ${frontmatter.status}`);
  success++;
}

console.log(`\n=== INSERT COMPLETE ===`);
console.log(`Success: ${success}/12 | Failed: ${failed}`);
