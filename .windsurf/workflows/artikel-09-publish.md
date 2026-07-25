---
description: Artikel step 09 - Publish artikel ke production
---

# 09-publish

Publish artikel ke production.

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

```bash
git add -A && git commit -m "feat: add new article SLUG" && git push origin main
```

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
