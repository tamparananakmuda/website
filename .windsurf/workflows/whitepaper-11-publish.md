---
description: Whitepaper step 11 - Publikasi PDF atau landing page
---

# 11-publish

Publikasi PDF atau landing page.

## Prev

Dari `/whitepaper-10-humanizer`

## Whitepaper publish = set status di file Markdown

Whitepaper publish **1 bulan sekali**. Saat build (step 08), whitepaper sudah di-set `status: "scheduled"` dengan `publishedAt` di tanggal 1 bulan kosong berikutnya (08:00 WIB / 01:00 UTC).

### Cara Publish

**Otomatis (recommended):** Cron job GitHub Actions cek setiap 5 menit. Saat `publishedAt <= now()`, cron auto:
1. Ubah `status` dari `scheduled` ke `published` di file Markdown
2. Generate OG image (card + feature WebP)
3. Deploy ke production

**Manual (jika perlu publish langsung):** Set `status: "published"` di frontmatter file `content/whitepaper/SLUG.md`. Commit dan push ke main untuk deploy.

### Verifikasi schedule sebelum publish

Sebelum publish, pastikan tidak ada whitepaper lain di bulan yang sama:

```bash
npx tsx -e "
const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const dir = join(process.cwd(), 'content', 'whitepaper');
const files = readdirSync(dir).filter(f => f.endsWith('.md'));
const all = files.map(f => {
  const { data } = matter(readFileSync(join(dir, f), 'utf8'));
  return { slug: data.slug, status: data.status, month: new Date(data.publishedAt).toISOString().slice(0,7) };
});
const byMonth = {};
all.forEach(w => { byMonth[w.month] = (byMonth[w.month] || 0) + 1; });
Object.entries(byMonth).sort().forEach(([month, count]) => {
  console.log(month + ': ' + count + ' whitepaper' + (count > 1 ? ' [WARNING: lebih dari 1]' : ''));
});
"
```

## OG Image Generation (manual, template berbeda dari artikel)

```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

## Verifikasi production

```bash
curl -s -o /dev/null -w "whitepaper: %{http_code}\n" "https://tamparananakmuda.com/whitepaper/SLUG"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
```

## SEO Indexing

1. Submit URL ke Google Search Console: `https://tamparananakmuda.com/whitepaper/SLUG`
2. Ping sitemap

## AI Search Engine Submission (GEO)

Whitepaper = most citable asset. Submit ke AI engines untuk faster citation:

| Platform | Method |
|----------|--------|
| **Google AI Overview** | Submit ke Google Search Console (same as SEO) |
| **Perplexity** | Pastikan whitepaper public dan crawlable (no robots.txt block) |
| **ChatGPT** | Pastikan whitepaper di sitemap, OpenAI crawler bisa akses |
| **llms.txt** | Update `public/llms.txt` dengan link whitepaper jika ada |

GEO runs on days, bukan years. Submit cepat = citation cepat.

## E-E-A-T Production Verification

Verify E-E-A-T signals live di production:

| Check | Method |
|-------|--------|
| **Author byline** | Cek page render: author visible? |
| **Published date** | Cek page render: date visible? |
| **Schema markup** | Cek page source: Article schema ada? |
| **Meta description** | Cek `<meta name="description">`: summary ada? |
| **Open Graph** | Cek `<meta property="og:title">`: title ada? |
| **Canonical URL** | Cek `<link rel="canonical">`: URL correct? |

## Checklist

- [ ] `status` = `scheduled` (auto-publish oleh cron) atau `published` (manual)
- [ ] `publishedAt` = tanggal 1 bulan kosong, 01:00 UTC (08:00 WIB)
- [ ] Verifikasi: tidak ada whitepaper lain di bulan yang sama
- [ ] OG image generated
- [ ] HTTP 200 di production `/whitepaper/SLUG`
- [ ] Sitemap includes slug
- [ ] Whitepaper muncul di `/whitepaper` list page
- [ ] URL submitted ke Google Search Console
- [ ] AI search submission: llms.txt updated, sitemap crawlable
- [ ] E-E-A-T production verification: author, date, schema, meta, OG, canonical

## Next

Lanjut ke `/whitepaper-12-distribution`
