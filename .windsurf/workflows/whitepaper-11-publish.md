---
description: Whitepaper step 11 - Publikasi PDF atau landing page
---

# 11-publish

Publikasi PDF atau landing page.

## Prev

Dari `/whitepaper-10-humanizer`

## Whitepaper tidak perlu deploy

Di-insert ke DB, langsung live saat `status='published'`. Tidak ada file yang di-commit.

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

## Checklist

- [ ] `status` = `published` di DB
- [ ] OG image generated
- [ ] HTTP 200 di production `/whitepaper/SLUG`
- [ ] Sitemap includes slug
- [ ] Whitepaper muncul di `/whitepaper` list page
- [ ] URL submitted ke Google Search Console

## Next

Lanjut ke `/whitepaper-12-distribution`
