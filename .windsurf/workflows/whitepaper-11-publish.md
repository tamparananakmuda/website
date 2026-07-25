---
description: Whitepaper step 11 - Publikasi PDF atau landing page
---

# 11-publish

Publikasi PDF atau landing page.

## Prev

Dari `/whitepaper-10-humanizer`

## Whitepaper publish = set status di file Markdown

Set `status: "published"` di frontmatter file `content/whitepaper/SLUG.md`. Commit dan push ke main untuk deploy.

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

- [ ] `status` = `published` di frontmatter file
- [ ] OG image generated
- [ ] HTTP 200 di production `/whitepaper/SLUG`
- [ ] Sitemap includes slug
- [ ] Whitepaper muncul di `/whitepaper` list page
- [ ] URL submitted ke Google Search Console

## Next

Lanjut ke `/whitepaper-12-distribution`
