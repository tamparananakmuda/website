---
description: Whitepaper step 08 - Finalisasi dokumen dan simpan sebagai file Markdown
---

# 08-build

Finalisasi dokumen dan simpan sebagai file Markdown di `content/whitepaper/`.

## Prev

Dari `/whitepaper-07-design`

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Whitepaper disimpan sebagai file Markdown di `content/whitepaper/`. Tidak ada DB insert. Pastikan frontmatter lengkap.

## Pre-Flight File Check

```bash
npx tsx -e "
const { existsSync } = require('fs');
const { join } = require('path');
const slug = 'SLUG_WHITEPAPER';
const filePath = join(process.cwd(), 'content', 'whitepaper', slug + '.md');
console.log('SLUG CHECK:', existsSync(filePath) ? 'FATAL: FILE EXISTS' : 'SLUG AVAILABLE: ' + slug);
"
```

## Whitepaper frontmatter fields

**Standard fields:**
- `title`, `slug`, `subtitle`, `summary`
- `coverImageUrl` (null jika pakai OG image dynamic)
- `author` (default: 'TAMPARAN ANAK MUDA'), `downloadUrl`
- `readingTime` (integer, default 10), `tags` (array)
- `status` ('draft' atau 'published'), `publishedAt` (ISO date string)
- `og_headline` (hook pendek untuk OG image, max 50 char, berbeda dari title)

**TAM Report fields (untuk annual reports):**
- `reportCode` (format: `TAM-{YEAR}-{NUMBER}`, contoh: `TAM-2026-10`)
- `reportYear` (integer, contoh: 2026)
- `reportSeries` (string, nama seri, contoh: `State of Indonesian Youth`)
- `isAnnualReport` (boolean, default: false)
- `keyFindings` (array string, 3-5 bullet points untuk Key Findings box)
- `dataSources` (array string, sumber data untuk Data Sources section)

## E-E-A-T Frontmatter Verification

Pastikan frontmatter mendukung E-E-A-T signals:

| Field | E-E-A-T signal | Required |
|-------|---------------|----------|
| `author` | Named author byline | Ya, bukan generic |
| `publishedAt` | Visible dates | Ya, ISO date |
| `summary` | Meta description untuk search | Ya, 150-160 char |
| `tags` | Topic categorization | Ya, 3-5 tags |

## AI SEO/AEO Verification

Sebelum save file, verify AI citation readiness:

| Check | Requirement |
|-------|-------------|
| **Semantic headings** | H2 = claim/conclusion, bukan generic ("Analisis") |
| **Citable passages** | Minimal 1 self-contained extractable claim per section |
| **Statistical formatting** | "74% (BPS, 2025)" dalam text, bukan hanya di chart |
| **Front-loaded thesis** | Paragraf pertama = governing thought |
| **Methodology section** | Ada jika original research (nerd box) |
| **Limitations section** | Ada dan explicit |
| **Schema-ready** | Frontmatter fields lengkap untuk schema markup |

## Insert command (write file Markdown)

```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (!wp.slug || !wp.title || !wp.body) { console.error('FATAL: slug, title, body required'); process.exit(1); }
if (!wp.published_at) { console.error('FATAL: published_at required'); process.exit(1); }

const dir = path.join(process.cwd(), 'content', 'whitepaper');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const frontmatter = [
  'title: ' + JSON.stringify(wp.title),
  'slug: ' + JSON.stringify(wp.slug),
  wp.subtitle ? 'subtitle: ' + JSON.stringify(wp.subtitle) : 'subtitle: null',
  wp.summary ? 'summary: ' + JSON.stringify(wp.summary) : 'summary: null',
  wp.cover_image_url ? 'coverImageUrl: ' + JSON.stringify(wp.cover_image_url) : 'coverImageUrl: null',
  'author: ' + JSON.stringify(wp.author || 'TAMPARAN ANAK MUDA'),
  wp.download_url ? 'downloadUrl: ' + JSON.stringify(wp.download_url) : 'downloadUrl: null',
  'readingTime: ' + (wp.reading_time || 10),
  'tags: ' + JSON.stringify(wp.tags || []),
  'status: ' + JSON.stringify(wp.status === 'scheduled' ? 'draft' : (wp.status || 'published')),
  'publishedAt: ' + JSON.stringify(wp.published_at),
  wp.og_headline ? 'og_headline: ' + JSON.stringify(wp.og_headline) : 'og_headline: ""',
  wp.report_code ? 'reportCode: ' + JSON.stringify(wp.report_code) : 'reportCode: null',
  wp.report_year ? 'reportYear: ' + wp.report_year : 'reportYear: null',
  wp.report_series ? 'reportSeries: ' + JSON.stringify(wp.report_series) : 'reportSeries: null',
  'isAnnualReport: ' + (wp.is_annual_report || false),
  'keyFindings: ' + JSON.stringify(wp.key_findings || []),
  'dataSources: ' + JSON.stringify(wp.data_sources || []),
].join('\n');

const fileContent = '---\n' + frontmatter + '\n---\n\n' + wp.body + '\n';
const filePath = path.join(dir, wp.slug + '.md');
fs.writeFileSync(filePath, fileContent, 'utf8');
console.log('Whitepaper written:', wp.slug, '| status:', wp.status || 'published', '| reading_time:', wp.reading_time || 10);
"
```

## Content Markers (PENTING)

Whitepaper markdown punya dua bagian:
1. **Published content** - yang tampil di website (antara markers)
2. **Workflow tracking** - checklist, score, catatan (di luar markers)

Gunakan markers ini di markdown file:

```markdown
<!-- START WHITEPAPER CONTENT -->

## Executive Summary
...konten whitepaper...

## FAQ
...jawaban FAQ...

<!-- END WHITEPAPER CONTENT -->

---
### Draft Completion Score (0-15)
...workflow tracking...
```

`lib/whitepaper/loader.ts` mengambil hanya konten antara markers via `extractPublishedContent()`. Jika markers tidak ada, seluruh body dirender (termasuk workflow tracking, yang salah).

**Aturan:**
- `<!-- START WHITEPAPER CONTENT -->` ditempatkan sebelum `## Executive Summary`
- `<!-- END WHITEPAPER CONTENT -->` ditempatkan setelah section terakhir yang public (biasanya FAQ atau Conclusion)
- Semua workflow tracking (Draft Completion Score, Checklist, dll) harus di LUAR markers
- Frontmatter tidak terkena markers (selalu di-include)

## Interactive Chart Verification

Jika whitepaper menggunakan `chart:type` code blocks, verify sebelum publish:

```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const filePath = join(process.cwd(), 'content', 'whitepaper', 'SLUG_WHITEPAPER.md');
const content = readFileSync(filePath, 'utf8');
const chartBlocks = content.match(/\`\`\`chart:(bar|line|area|pie|grouped-bar|stacked-bar|scatter|funnel|treemap|radar)\n([\s\S]*?)\`\`\`/g);
if (!chartBlocks) { console.log('No chart blocks found'); process.exit(0); }
console.log('Chart blocks found:', chartBlocks.length);
chartBlocks.forEach((block, i) => {
  const type = block.match(/chart:(\w+)/)[1];
  try {
    const json = block.match(/\n([\s\S]*?)\`\`\`/)[1].trim();
    const config = JSON.parse(json);
    console.log('Chart ' + (i+1) + ': type=' + type + ', title=' + config.title + ', data points=' + (config.data?.length || 0));
  } catch (e) {
    console.error('Chart ' + (i+1) + ': INVALID JSON');
  }
});
"
```

**Checklist chart:**
- [ ] Setiap `chart:type` block punya valid JSON
- [ ] Setiap chart punya `title`, `subtitle`, `source`
- [ ] Data di chart juga disebut di narasi sekitarnya
- [ ] Chart ditempatkan di antara teks, bukan di akhir section
- [ ] Content markers (`START`/`END`) tidak memotong chart blocks

## Post-Insert Verification

```bash
npx tsx -e "
const { existsSync, readFileSync, statSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'whitepaper', 'SLUG_WHITEPAPER.md');
if (!existsSync(filePath)) { console.error('FATAL: file not found'); process.exit(1); }
const { data, content } = matter(readFileSync(filePath, 'utf8'));
console.log('slug:', data.slug, '| status:', data.status, '| publishedAt:', data.publishedAt, '| readingTime:', data.readingTime, '| body:', content.length, 'chars');
console.log('All checks passed.');
"
```

## Checklist

- [ ] Slug uniqueness dicek (file tidak exists)
- [ ] File `content/whitepaper/SLUG.md` created
- [ ] Frontmatter lengkap dan valid (standard + TAM Report fields jika annual report)
- [ ] E-E-A-T frontmatter: author, publishedAt, summary, tags
- [ ] `og_headline` diisi (hook pendek, berbeda dari title, max 50 char)
- [ ] TAM Report fields: `reportCode`, `reportYear`, `isAnnualReport`, `keyFindings`, `dataSources` (jika annual report)
- [ ] AI SEO/AEO: semantic headings, citable passages, statistical formatting, front-loaded thesis
- [ ] Methodology section ada (jika original research)
- [ ] Limitations section ada dan explicit
- [ ] `status` = `published` atau `draft`
- [ ] `publishedAt` tidak null
- [ ] `body` tidak kosong
- [ ] `readingTime` > 0
- [ ] Content markers `<!-- START WHITEPAPER CONTENT -->` dan `<!-- END WHITEPAPER CONTENT -->` ada dan posisi benar
- [ ] Workflow tracking (Draft Completion Score, Checklist) di LUAR markers
- [ ] Interactive chart blocks (`chart:type`) punya valid JSON
- [ ] Chart blocks berada di dalam content markers

## Next

Lanjut ke `/whitepaper-09-qc`
