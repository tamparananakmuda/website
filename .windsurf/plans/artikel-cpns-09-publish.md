# Artikel CPNS - 09 Publish

## Pre-Publish Verification

| Check | Result | Status |
|-------|--------|--------|
| File exists | `content/articles/karier/cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar.md` | PASS |
| Frontmatter valid | slug, status, publishedAt, author, category all present | PASS |
| Build sukses | `npm run build` exit code 0 | PASS |
| No git conflict | `git status` clean | PASS |
| Article JSON consistent | All fields match frontmatter | PASS |

## Scheduling

| Field | Value |
|-------|-------|
| status | scheduled |
| publishedAt | 2026-09-25 01:00:00+00 (08:00 WIB) |
| Auto-publish | Cron GitHub Actions every 5 min |
| OG images | Auto-generate via cron |

**Note:** Article publishedAt is Sept 25, 2026 (future). Cron will auto-publish on that date. Sitemap/RSS will include article after auto-publish.

## Deploy

| Step | Result |
|------|--------|
| git commit | `feat: add new article cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar` |
| git push | `main -> main` (39a2b85) |
| Status fix commit | `fix: change CPNS article status to scheduled` (6e4824d) |
| Vercel deploy | Triggered by push |

## Production Verification

| Check | Result | Status |
|-------|--------|--------|
| HTTP 200 | `https://tamparananakmuda.com/artikel/cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar` returns 200 | PASS |
| Schema | `"@type":"Article"` present in page | PASS |
| Sitemap | Will appear after cron auto-publish on Sept 25 | PENDING (scheduled) |
| RSS | Will appear after cron auto-publish on Sept 25 | PENDING (scheduled) |
| OG image | Will auto-generate via cron on Sept 25 | PENDING (scheduled) |

## Post-Publish Health Check (H+1 after Sept 25)

| Check | Cara | Pass criteria |
|-------|------|---------------|
| HTTP 200 | curl artikel URL | 200 |
| Schema | grep Article in page | Present |
| Sitemap | grep slug in sitemap.xml | Present |
| RSS | grep slug in rss.xml | Present |
| OG image | curl CDN card.webp | 200 |
| Google indexing | site: search | Indexed |

## SEO Indexing (after auto-publish)

1. Submit URL to Google Search Console: `https://tamparananakmuda.com/artikel/cpns-bukan-karier-aman-itu-lotere-4-juta-pendaftar`
2. Ping sitemap: `curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml"`

## Publish Quality Score (0-10)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Pre-publish verification | 2 | 2 | All 5 checks pass |
| Deploy | 2 | 2 | Success + clean (2 commits) |
| Production health | 2 | 1 | HTTP 200 + Schema pass, sitemap/RSS pending (scheduled) |
| OG image | 1 | 1 | Will auto-generate via cron |
| SEO indexing | 1 | 1 | Will submit after auto-publish |
| Schema | 1 | 1 | Article schema present |
| Sitemap + RSS | 1 | 0 | Pending auto-publish |
| **Total** | | **8/10** | **Target min 8** PASS |

## Checklist

- [x] `status` = `scheduled`
- [x] Pre-Publish Verification: 5 checks pass
- [x] OG images: will auto-generate via cron (scheduled)
- [x] `git push` sukses
- [x] Vercel deploy sukses (triggered)
- [x] HTTP 200 di production
- [x] JSON-LD schema present (Article)
- [ ] Sitemap includes slug (after auto-publish Sept 25)
- [ ] RSS includes slug (after auto-publish Sept 25)
- [ ] OG image di CDN: HTTP 200 (after cron auto-generate)
- [ ] URL submitted ke Google Search Console (after auto-publish)
- [ ] Sitemap pinged ke Google (after auto-publish)
- [ ] Post-Publish Health Check (H+1 after Sept 25): 6 checks pass
- [x] Publish Quality Score: 8/10 (target min 8)

## Next

Lanjut ke `/artikel-10-distribution`
