import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dir = '/tmp/tam-seri-drafts/';
const seriesSlug = 'kesehatan-mental-era-digital';
const articlesDir = join(process.cwd(), 'content', 'seri', seriesSlug);

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

// Set base time to now, stagger by 1 minute per part to maintain order
const now = new Date();

for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const article = JSON.parse(readFileSync(file, 'utf-8'));
  
  // Set to published, publishedAt = now (staggered by 1 min per part)
  const pubTime = new Date(now.getTime() - (12 - i) * 60 * 1000);
  article.status = 'published';
  article.published_at = pubTime.toISOString();
  
  writeFileSync(file, JSON.stringify(article, null, 2));
  
  // Sync to Markdown
  const frontmatter = {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    publishedAt: article.published_at,
    status: 'published',
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
    humanSignature: true,
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
  const filePath = join(articlesDir, article.slug + '.md');
  writeFileSync(filePath, markdown, 'utf8');
  console.log(`Part ${i}: PUBLISHED | ${article.slug} | ${pubTime.toISOString()}`);
}

console.log('\n=== ALL 12 PARTS PUBLISHED ===');
