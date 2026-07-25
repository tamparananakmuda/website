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

## Checklist

- [ ] `status` = `published` atau `scheduled`
- [ ] OG images generated (atau tunggu cron untuk scheduled)
- [ ] `git push` sukses
- [ ] Vercel deploy sukses
- [ ] HTTP 200 di production
- [ ] JSON-LD schema present
- [ ] Sitemap includes slug
- [ ] URL submitted ke Google Search Console

## Next

Lanjut ke `/artikel-10-distribution`
