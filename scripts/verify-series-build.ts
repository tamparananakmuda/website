import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const dir = 'content/seri/sistem-kesehatan-indonesia';
const files = readdirSync(dir).filter(f => f.endsWith('.md')).sort();

console.log('=== FRONTMATTER + SEO VALIDATION ===\n');
let totalIssues = 0;

files.forEach(f => {
  const { data: fm, content: body } = matter(readFileSync(join(dir, f), 'utf8'));
  const issues: string[] = [];
  
  // Required fields
  const reqFields = ['title','slug','excerpt','publishedAt','status','category','author','series','seriesOrder','povTag','tags','ogHeadline','seoMetaTitle','seoMetaDescription','seoKeywords','sourceReferences','featured','humanSignature','factCheckStatus','reviewStatus','isSponsored','isPremium','human_signature','readingTime'];
  reqFields.forEach(k => { if (fm[k] === undefined) issues.push(k + ' MISSING'); });
  
  // SEO length checks
  if (fm.seoMetaTitle && fm.seoMetaTitle.length > 70) issues.push('seoMetaTitle ' + fm.seoMetaTitle.length + ' > 70');
  if (fm.seoMetaDescription && fm.seoMetaDescription.length > 160) issues.push('seoMetaDescription ' + fm.seoMetaDescription.length + ' > 160');
  if (fm.excerpt && fm.excerpt.length > 160) issues.push('excerpt ' + fm.excerpt.length + ' > 160');
  if (fm.ogHeadline && fm.ogHeadline.length > 50) issues.push('ogHeadline ' + fm.ogHeadline.length + ' > 50');
  if (fm.slug && fm.slug.length > 60) issues.push('slug ' + fm.slug.length + ' > 60');
  
  // ogHeadline != title
  if (fm.ogHeadline === fm.title) issues.push('ogHeadline = title');
  
  // excerpt != seoMetaDescription
  if (fm.excerpt === fm.seoMetaDescription) issues.push('excerpt = seoMetaDescription');
  
  // seoKeywords count
  if (fm.seoKeywords && (fm.seoKeywords.length < 3 || fm.seoKeywords.length > 8)) issues.push('seoKeywords count ' + fm.seoKeywords.length);
  
  // Series fields
  if (fm.series !== 'sistem-kesehatan-indonesia') issues.push('series wrong: ' + fm.series);
  if (!fm.seriesOrder || fm.seriesOrder < 1) issues.push('seriesOrder invalid');
  
  // reviewStatus
  if (fm.reviewStatus === 'draft') issues.push('reviewStatus still draft');
  
  // sourceReferences
  if (!Array.isArray(fm.sourceReferences) || fm.sourceReferences.length < 3) issues.push('sourceReferences < 3');
  
  // Body word count
  const words = body.trim().split(/\s+/).length;
  if (words < 1000) issues.push('word count ' + words + ' < 1000');
  
  // Em dash check
  if (body.includes('\u2014')) issues.push('em dash found');
  if (body.includes('...')) issues.push('ellipsis found');
  
  // Chart JSON validation
  const chartMatches = body.match(/chart:(bar|pie|line|doughnut)\n([\s\S]*?)```/g);
  if (chartMatches) {
    chartMatches.forEach(c => {
      const jsonStr = c.replace(/chart:(bar|pie|line|doughnut)\n/, '').replace(/```/, '').trim();
      try { JSON.parse(jsonStr); } catch(e) { issues.push('invalid chart JSON'); }
    });
  }
  
  // Internal links
  const tamLinks = (body.match(/\]\(\/artikel\//g) || []).length;
  if (tamLinks < 2) issues.push('internal links ' + tamLinks + ' < 2');
  
  // Prev link (part 2+)
  const order = fm.seriesOrder;
  if (order > 1) {
    if (!body.includes('Sebelumnya di Sakit Itu Mahal')) issues.push('no recap/prev');
  }
  // Next link (part 1-N-1)
  if (order < 8) {
    if (!body.includes('Selanjutnya di Sakit Itu Mahal')) issues.push('no teaser/next');
  }
  
  totalIssues += issues.length;
  console.log(f + ' (P' + order + '): ' + (issues.length === 0 ? 'ALL PASS' : issues.join('; ')));
});

console.log('\nTotal issues: ' + totalIssues);
