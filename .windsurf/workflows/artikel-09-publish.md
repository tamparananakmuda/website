---
description: Artikel step 09 - Publish artikel ke production
---

# 09-publish

Publish artikel ke production.

## Prev

Dari `/artikel-08-humanizer`

## Scheduling Verification (jika scheduled)

```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'articles', 'SLUG' + '.md');
const { data: f } = matter(readFileSync(filePath, 'utf8'));
console.log('status:', f.status, '| publishedAt:', f.publishedAt);
if (f.status === 'scheduled') {
  const pubDate = new Date(f.publishedAt); const now = new Date();
  if (pubDate <= now) console.error('WARNING: publishedAt is past but status is scheduled!');
  else console.log('Will auto-publish in ~' + Math.ceil((pubDate.getTime() - now.getTime()) / 60000) + ' minutes');
} else if (f.status === 'published') console.log('Already published');
"
```

## OG Image Generation (wajib untuk publish langsung, skip untuk scheduled)

```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

Verify di CDN:
```bash
curl -s -o /dev/null -w "card: %{http_code}\n" "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -o /dev/null -w "feature: %{http_code}\n" "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"
```

## Deploy

### Pre-deploy build check

```bash
# Pastikan build sukses sebelum push
npm run build 2>&1 | tail -5
```

Jika build fail, fix error sebelum push. Jangan push kode yang gagal build.

### Push to production

```bash
git add -A && git commit -m "feat: add new article SLUG" && git push origin main
```

### Error handling

| Error | Solusi |
|-------|--------|
| Build fail | Fix error, re-run `npm run build` |
| Git push reject | `git pull --rebase origin main && git push` |
| Vercel deploy fail | Cek Vercel dashboard, lihat build log |
| OG generation fail (401) | Admin session cookie expired, login ulang di `/masuk` |
| OG generation fail (500) | Cek API logs di Vercel, pastikan R2 credentials valid |
| HTTP 404 di production | Cek slug di file, pastikan tidak ada typo |
| Schema MISSING | Cek `components/schema/article-schema.tsx`, pastikan import correct |

### Cara dapat admin session cookie

1. Login di `https://tamparananakmuda.com/masuk`
2. Buka DevTools > Application > Cookies
3. Copy value `sb-access-token` (atau cookie session Supabase)
4. Pakai di command: `-H "Cookie: sb-access-token=VALUE"`

## publishedAt Format

**WAJIB** pakai format: `"YYYY-MM-DD HH:MM:SS+00"` (contoh: `"2026-07-26 01:00:00+00"`).

JANGAN pakai format ISO `T` dengan `.000Z` (contoh: `"2026-07-26T01:00:00.000Z"`).
Format `+00` lebih ringkas dan konsisten dengan artikel existing.

## Scheduling: 3 Artikel Per Hari

Target publishing: 3 artikel/hari di jam 08:00, 12:00, 17:00 WIB.

| Slot | WIB | UTC | Status |
|------|-----|-----|--------|
| Pagi | 08:00 | 01:00 | `scheduled` + `publishedAt: "2026-01-01 01:00:00+00"` |
| Siang | 12:00 | 05:00 | `scheduled` + `publishedAt: "2026-01-01 05:00:00+00"` |
| Sore | 17:00 | 10:00 | `scheduled` + `publishedAt: "2026-01-01 10:00:00+00"` |

Cron job GitHub Actions berjalan every 5 minutes, auto-publish saat `publishedAt <= now()`. Cron juga auto-generate OG images. Tidak perlu manual deploy untuk scheduled articles.

**Untuk scheduled articles:** OG images auto-generate oleh cron, skip manual OG generation step.

## Verifikasi production

```bash
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o '"@type":"Article"' && echo "Schema OK" || echo "Schema MISSING"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
curl -s "https://tamparananakmuda.com/rss.xml" | grep "SLUG" && echo "RSS OK" || echo "RSS MISSING"
```

## SEO Indexing

1. Submit URL ke Google Search Console: `https://tamparananakmuda.com/artikel/SLUG`
2. Ping sitemap: `curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml"`

## Pre-Publish Verification Protocol

Sebelum push, jalankan 5 verifikasi:

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **File exists** | `ls content/articles/KATEGORI/SLUG.md` | File ada |
| **Frontmatter valid** | Post-insert verification script | CLEAN |
| **Build sukses** | `npm run build` | Exit code 0 |
| **No git conflict** | `git status` | Clean, no conflict |
| **Article JSON consistent** | Compare JSON vs frontmatter | Semua field match |

Jika 1 check fail: fix sebelum push.

## Post-Publish Health Check (H+1)

| Check | Cara | Pass criteria | Jika gagal |
|-------|------|---------------|-----------|
| **HTTP 200** | `curl -s -o /dev/null -w "%{http_code}" URL` | 200 | Cek Vercel deploy |
| **Schema present** | `curl -s URL \| grep "Article"` | Ada | Cek schema component |
| **Sitemap** | `curl -s sitemap.xml \| grep SLUG` | Ada | Cek sitemap generation |
| **RSS** | `curl -s rss.xml \| grep SLUG` | Ada | Cek RSS generation |
| **OG image** | `curl -s -o /dev/null -w "%{http_code}" CDN/og/SLUG-card.webp` | 200 | Regenerate OG |
| **Google indexing** | `site:tamparananakmuda.com/artikel/SLUG` | Indexed | Submit ulang ke GSC |

## Deploy Verification Protocol

| Step | Check | Output |
|------|-------|--------|
| **1. Pre-deploy** | Build sukses, no error | Exit 0 |
| **2. Push** | `git push origin main` sukses | No reject |
| **3. Vercel deploy** | Cek Vercel dashboard | Deploy success |
| **4. Production check** | HTTP 200 di artikel URL | 200 |
| **5. Schema check** | JSON-LD present di page | Ada |
| **6. Sitemap check** | Slug di sitemap.xml | Ada |
| **7. RSS check** | Slug di rss.xml | Ada |
| **8. OG image check** | Image di CDN | 200 |

## Publish Quality Score (0-10)

Score publish sebelum lanjut ke 10-distribution. Target: minimal 8.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Pre-publish verification** | 2 | > 2 fail | 1 fail | Semua pass |
| **Deploy** | 2 | Fail | Success tapi slow | Success + clean |
| **Production health** | 2 | > 2 fail | 1 fail | Semua H+1 pass |
| **OG image** | 1 | Missing | Generated tapi 404 | Generated + 200 |
| **SEO indexing** | 1 | Not submitted | Submitted | Submitted + ping sitemap |
| **Schema** | 1 | Missing | Article only | Article + FAQ |
| **Sitemap + RSS** | 1 | Missing | 1 ada | Keduanya ada |

Jika score < 8: fix production issue sebelum distribution.

## Checklist

- [ ] `status` = `published` atau `scheduled`
- [ ] Pre-Publish Verification: 5 checks pass
- [ ] OG images generated (atau tunggu cron untuk scheduled)
- [ ] `git push` sukses
- [ ] Vercel deploy sukses
- [ ] HTTP 200 di production
- [ ] JSON-LD schema present (Article + FAQ jika ada)
- [ ] Sitemap includes slug
- [ ] RSS includes slug
- [ ] OG image di CDN: HTTP 200
- [ ] URL submitted ke Google Search Console
- [ ] Sitemap pinged ke Google
- [ ] Post-Publish Health Check (H+1): 6 checks pass
- [ ] Publish Quality Score: min 8 (dari 10)

## Next

Lanjut ke `/artikel-10-distribution`
