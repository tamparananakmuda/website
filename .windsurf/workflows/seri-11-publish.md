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
- [ ] JSON-LD schema present per part (Article + FAQ jika ada)
- [ ] RSS includes slug per part
- [ ] OG image di CDN: HTTP 200 per part
- [ ] Series page: semua part muncul
- [ ] Prev/next navigation: semua link aktif
- [ ] Post-Publish Health Check (H+1): all pass
- [ ] Series Publish Quality Score: min 8 (dari 10)

## Pre-Publish Verification (per part)

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **File exists** | `ls content/seri/SERIES-SLUG/SLUG.md` | Exists |
| **Frontmatter valid** | Post-insert verification script | CLEAN |
| **Series config** | Series slug di content/config.ts | Match |
| **SeriesOrder** | 1, 2, 3... no gap | Correct |
| **No git conflict** | `git status` clean | Clean |

## Post-Publish Health Check (H+1 per part)

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **HTTP 200** | `curl -s -o /dev/null -w "%{http_code}" URL` | 200 |
| **Schema** | `curl -s URL \| grep -i "application/ld+json"` | Present |
| **Sitemap** | `curl -s sitemap.xml \| grep SLUG` | Included |
| **OG image** | `curl -s -o /dev/null -w "%{http_code}" CDN/og/SLUG-card.webp` | 200 |
| **Series page** | `curl -s /seri/SERIES-SLUG \| grep SLUG` | All parts listed |
| **Navigation** | Prev/next link di production | Aktif |

## Series Publish Quality Score (0-10)

Target: min 8.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **Deploy** | 2 | Fail | Partial | All parts deployed |
| **HTTP status** | 1 | 404 | Sebagiane 200 | All 200 |
| **Schema** | 1 | Missing | Article only | Article + FAQ |
| **Sitemap + RSS** | 1 | Missing | 1 ada | Keduanya |
| **OG image** | 1 | Missing | Generated tapi 404 | All 200 |
| **Series page** | 1 | Missing | Sebagiane | All parts listed |
| **Navigation** | 1 | Broken | Sebagiane | All prev/next aktif |
| **GSC submitted** | 1 | Not submitted | Submitted | Submitted + ping |
| **Health check** | 1 | Not run | Run tapi issues | All pass |

Jika score < 8: fix production issue sebelum distribution.

## Next

Lanjut ke `/seri-12-distribution`
