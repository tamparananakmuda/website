# Artikel 06-Build: Gen Z Pindah dari Jakarta

## Build Quality Score: 10/10

| Factor | Weight | Score | Justifikasi |
|--------|--------|-------|-------------|
| Frontmatter completeness | 2 | 2 | Semua fields terisi: title, slug, excerpt, publishedAt, status, category, subcategory, author, series, seriesOrder, povTag, tags, ogHeadline, seoMetaTitle, seoMetaDescription, seoKeywords, sourceReferences, humanSignature, featured, readingTime, factCheckStatus, reviewStatus, coverImageUrl, coverImageAlt |
| SEO metadata | 2 | 2 | 6/6 fields pass: seoMetaTitle (60), seoMetaDescription (157), slug (55), excerpt (160), ogHeadline (37, != title), seoKeywords (6, all in body) |
| File creation | 1 | 1 | Created di content/articles/kehidupan/jakarta-mengusir-gen-z-bukan-pindah-desa-diusir-ekonomi.md |
| Schema readiness | 1 | 1 | Article schema: title, author, datePublished ready. FAQPage: 4 Q&A ready. BreadcrumbList: category > article. |
| OG image | 1 | 1 | ogHeadline "Jakarta terlalu mahal untuk gaji kamu" (37 char, unique, punchy). Scheduled: auto-generate by cron. |
| Internal links | 1 | 1 | 4 links, semua target exists, descriptive anchor text |
| Inventory | 1 | 1 | Updated: entry #185 added to files/article-inventory.md |
| Post-insert verification | 1 | 1 | CLEAN: all checks passed |
| **Total** | **10** | **10** | **PASS (target: minimal 8)** |

## Pre-Flight Check

- File exists: YES (from step 04, verified)
- Category valid: Kehidupan (getCategoryBySlug)
- Author valid: Yovie Setiawan (getAuthorBySlug)

## Frontmatter Final

| Field | Value |
|-------|-------|
| title | "Jakarta Mengusir Gen Z: Bukan Pindah ke Desa, Diusir Ekonomi" |
| slug | "jakarta-mengusir-gen-z-bukan-pindah-desa-diusir-ekonomi" |
| excerpt | 160 chars |
| publishedAt | "2026-09-12 01:00:00+00" |
| status | "scheduled" |
| category | "kehidupan" |
| subcategory | "kehidupan-sosial" |
| author | "yovie-setiawan" |
| series | null |
| seriesOrder | null |
| povTag | "kontra-narasi" |
| tags | ["gen-z", "migrasi", "jakarta", "biaya-hidup", "urban-exodus", "ump", "wfa"] |
| ogHeadline | "Jakarta terlalu mahal untuk gaji kamu" (37 char) |
| seoMetaTitle | 60 char |
| seoMetaDescription | 157 char |
| seoKeywords | 6 keywords, all in body |
| sourceReferences | 10 entries (array) |
| humanSignature | true |
| featured | true |
| readingTime | 8 |
| factCheckStatus | "verified" |
| reviewStatus | "publish" |
| coverImageUrl | null (dynamic OG) |
| coverImageAlt | null |

## SEO Metadata Validation

| Field | Rule | Length | Status |
|-------|------|--------|--------|
| seoMetaTitle | Max 70, keyword | 60 | PASS |
| seoMetaDescription | Max 160, keyword + hook | 157 | PASS |
| slug | Kebab-case, max 60, keyword | 55 | PASS |
| excerpt | Max 160, != seoMetaDescription | 160 | PASS |
| ogHeadline | Max 50, != title, punchy | 37 | PASS |
| seoKeywords | 3-8, all in body | 6 | PASS |

6/6 fields pass.

## Internal Link Verification

| Link | Target | Exists? | Anchor | Status |
|------|--------|---------|--------|--------|
| 1 | quiet-living-adaptasi-ekonomi-yang-dikemas-filosofi | YES | "quiet living yang dikemas sebagai filosofi" | PASS |
| 2 | kpr-gen-z-bukan-gagal-nabung-rumah-naik-3x-gaji | YES | "rumah yang harganya naik 3x gaji" | PASS |
| 3 | kerja-remote-bule-gen-z-indonesia-talent-ekspor-termurah | YES | "kerja remote untuk bule" | PASS |
| 4 | pulang-ke-rumah-bukan-gagal-terbang-sistem-yang-hancurkan-landasannya | YES | "pulang ke rumah orang tua" | PASS |

4/4 links valid. Min 2. PASS.

## Chart Verification

| Chart | Type | Title | Subtitle | Source | Data items | Valid JSON |
|-------|------|-------|----------|--------|------------|------------|
| 1 | bar | "Biaya Sewa Kos per Kota..." | OK | OK | 4 | OK |
| 2 | bar | "Tujuan Perpindahan Penduduk: 5..." | OK | OK | 5 | OK |

2 charts, all valid JSON, all have title+subtitle+source+data.

## Schema Readiness

| Schema | Fields needed | Status |
|--------|--------------|--------|
| Article | title, author, datePublished, image | Ready (title, author, publishedAt set; image via OG cron) |
| FAQPage | min 3 Q&A | Ready (4 Q&A in body) |
| BreadcrumbList | category > article | Ready (category=kehidupan) |

## OG Image

- ogHeadline: "Jakarta terlalu mahal untuk gaji kamu" (37 char)
- Category: kehidupan (color in config)
- Status: scheduled -> OG auto-generate by cron when publishedAt <= now()

## Issues Fixed During Build

1. excerpt > 160 chars (184 -> 165 -> 160) — trimmed wording
2. seoMetaDescription > 160 chars (169 -> 157) — trimmed wording
3. featured field missing (undefined -> true)
4. readingTime, seoKeywords, factCheckStatus, reviewStatus, coverImageUrl, coverImageAlt added
5. seoKeywords "urban exodus indonesia" not in body -> replaced with "wfa indonesia"

## Article Inventory

Entry #185 added to `files/article-inventory.md`:
```
| 185 | Jakarta Mengusir Gen Z: Bukan Pindah ke Desa, Diusir Ekonomi | jakarta-mengusir-gen-z-bukan-pindah-desa-diusir-ekonomi | Kehidupan | Hubungan Sosial / Psikologi | kontra-narasi | 2026-09-12 (scheduled 08:00 WIB) |
```

## Checklist

- [x] Slug uniqueness dicek (file exists from step 04, no conflict)
- [x] Category dan author valid
- [x] File content/articles/kehidupan/jakarta-mengusir-gen-z-bukan-pindah-desa-diusir-ekonomi.md created
- [x] Frontmatter lengkap dan valid (24 fields)
- [x] sourceReferences isArray = true (10 entries)
- [x] excerpt <= 160 chars (160)
- [x] publishedAt tidak null (2026-09-12 01:00:00+00)
- [x] readingTime di-set (8, bukan 1)
- [x] SEO Metadata Validation: 6/6 fields pass
- [x] Schema Markup Verification: Article + FAQPage ready
- [x] OG Image Verification: ogHeadline set, unique, 37 char
- [x] Internal Link Verification: 4 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 2 chart:bar, valid JSON
- [x] Article inventory updated (#185)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10
