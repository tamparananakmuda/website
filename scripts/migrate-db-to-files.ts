const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  const k = t.substring(0, i).trim();
  const v = t.substring(i + 1).trim();
  if (!process.env[k]) process.env[k] = v;
});

const { db } = require('../lib/db');
const { posts, categories, subcategories, authors, series, postTags, tags } = require('../lib/db/schema');
const { eq, asc } = require('drizzle-orm');

const OUTPUT_DIR = join(process.cwd(), 'content', 'articles');
const SERIES_DIR = join(process.cwd(), 'content', 'seri');

function slugifyTag(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

async function migrate() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allPosts = await db.select().from(posts);
  console.log(`Found ${allPosts.length} posts in DB`);

  const allCats = await db.select().from(categories);
  const allSubs = await db.select().from(subcategories);
  const allAuthors = await db.select().from(authors);
  const allSeries = await db.select().from(series);
  const allTags = await db.select().from(tags);
  const allPostTags = await db.select().from(postTags);

  const catMap = new Map(allCats.map((c) => [c.id, c]));
  const subMap = new Map(allSubs.map((s) => [s.id, s]));
  const authorMap = new Map(allAuthors.map((a) => [a.id, a]));
  const seriesMap = new Map(allSeries.map((s) => [s.id, s]));
  const tagMap = new Map(allTags.map((t) => [t.id, t]));

  let count = 0;
  for (const post of allPosts) {
    const cat = post.categoryId ? catMap.get(post.categoryId) : null;
    const sub = post.subcategoryId ? subMap.get(post.subcategoryId) : null;
    const author = post.authorId ? authorMap.get(post.authorId) : null;
    const sr = post.seriesId ? seriesMap.get(post.seriesId) : null;

    const postTagRows = allPostTags.filter((pt) => pt.postId === post.id);
    const postTagNames = postTagRows.map((pt) => tagMap.get(pt.tagId)?.name).filter(Boolean);

    const frontmatter = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      publishedAt: post.publishedAt || new Date().toISOString(),
      status: post.status,
      category: cat?.slug || '',
      subcategory: sub?.slug || null,
      author: author?.slug || '',
      series: sr?.slug || null,
      seriesOrder: post.seriesOrder || null,
      povTag: post.povTag || null,
      tags: postTagNames,
      ogHeadline: post.ogHeadline || null,
      seoMetaTitle: post.seoMetaTitle || null,
      seoMetaDescription: post.seoMetaDescription || null,
      seoKeywords: post.seoKeywords || [],
      sourceReferences: post.sourceReferences || null,
      featured: post.featured || false,
      readingTime: post.readingTime || 1,
      humanSignature: post.humanSignature || false,
      factCheckStatus: post.factCheckStatus || 'pending',
      reviewStatus: post.reviewStatus || 'draft',
      isSponsored: post.isSponsored || false,
      sponsorName: post.sponsorName || null,
      sponsorUrl: post.sponsorUrl || null,
      sponsorDisclosure: post.sponsorDisclosure || null,
      isPremium: post.isPremium || false,
      premiumExcerpt: post.premiumExcerpt || null,
      coverImageUrl: post.coverImageUrl || null,
      coverImageAlt: post.coverImageAlt || null,
    };

    const yamlFrontmatter = Object.entries(frontmatter)
      .map(([key, value]) => {
        if (value === null) return `${key}: null`;
        if (typeof value === 'string') return `${key}: "${value.replace(/"/g, '\\"')}"`;
        if (typeof value === 'boolean' || typeof value === 'number') return `${key}: ${value}`;
        if (Array.isArray(value)) {
          if (value.length === 0) return `${key}: []`;
          const items = value.map((v) => `  - "${String(v).replace(/"/g, '\\"')}"`).join('\n');
          return `${key}:\n${items}`;
        }
        if (typeof value === 'object' && value !== null) {
          return `${key}: ${JSON.stringify(value)}`;
        }
        return `${key}: ${value}`;
      })
      .join('\n');

    const fileContent = `---\n${yamlFrontmatter}\n---\n\n${post.body}\n`;

    let targetDir;
    if (sr?.slug) {
      targetDir = join(SERIES_DIR, sr.slug);
    } else {
      targetDir = join(OUTPUT_DIR, cat?.slug || 'uncategorized');
    }
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const filePath = join(targetDir, `${post.slug}.md`);
    writeFileSync(filePath, fileContent, 'utf8');
    console.log(`Written: ${post.slug}.md`);
    count++;
  }

  console.log(`\nDone! ${count} articles migrated to ${OUTPUT_DIR}`);
  process.exit(0);
}

migrate().catch((e) => {
  console.error(e);
  process.exit(1);
});
