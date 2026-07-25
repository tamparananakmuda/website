---
description: Seri step 11 - Publikasi
---

# 11-publish

Publikasi.

## Prev

Dari `/seri-10-schedule`

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
git add -A && git commit -m "feat: add new seri part SLUG" && git push origin main
```

## Verifikasi production

```bash
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
```

## SEO Indexing

1. Submit URL ke Google Search Console per part
2. Ping sitemap

## Checklist

- [ ] OG images generated per part (atau tunggu cron)
- [ ] `git push` sukses
- [ ] HTTP 200 di production per part
- [ ] Sitemap includes slug per part
- [ ] URL submitted ke Google Search Console per part

## Next

Lanjut ke `/seri-12-distribution`
