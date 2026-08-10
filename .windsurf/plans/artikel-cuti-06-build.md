# Artikel Cuti - 06 Build

## Pre-Flight Check

| Check | Result |
|-------|--------|
| Slug availability | SLUG AVAILABLE: 12-hari-cuti-indonesia-nggak-ngasih-kamu-istirahat |
| Category valid | Karier |
| Author valid | Yovie Setiawan |

## File Created

`content/articles/karier/12-hari-cuti-indonesia-nggak-kamu-istirahat.md`

## Frontmatter

| Field | Value |
|-------|-------|
| title | "12 Hari Cuti, 66% Tetap Kerja: Sistem Nggak Ngasih Istirahat" |
| slug | "12-hari-cuti-indonesia-nggak-ngasih-kamu-istirahat" |
| excerpt | 157 chars (max 160) |
| publishedAt | "2026-09-27 01:00:00+00" |
| status | "scheduled" |
| category | "karier" |
| subcategory | "karier-korporat" |
| author | "yovie-setiawan" |
| series | null |
| seriesOrder | null |
| povTag | "data" |
| tags | [] |
| ogHeadline | "12 hari cuti, tapi 66% tetap kerja saat liburan" (47 chars) |
| seoMetaTitle | "12 Hari Cuti, 66% Tetap Kerja: Sistem Nggak Ngasih Istirahat" |
| seoMetaDescription | 153 chars (max 160) |
| seoKeywords | 7 items (all found in body) |
| sourceReferences | 17 items (array) |
| featured | true |
| readingTime | 9 |
| humanSignature | true |
| factCheckStatus | "verified" |
| reviewStatus | "publish" |
| coverImageUrl | null |
| coverImageAlt | null |

## Post-Insert Verification

```
slug: 12-hari-cuti-indonesia-nggak-ngasih-kamu-istirahat | status: scheduled | publishedAt: 2026-09-27 01:00:00+00
category: karier | author: yovie-setiawan
sourceReferences isArray: true
readingTime: 9
ogHeadline: 12 hari cuti, tapi 66% tetap kerja saat liburan
featured: true
humanSignature: true
All checks passed.
```

## SEO Metadata Validation

| Field | Rule | Result |
|-------|------|--------|
| seoMetaTitle | Max 70 chars, keyword | 60 chars, "cuti" present PASS |
| seoMetaDescription | Max 160 chars, keyword + hook | 153 chars, "cuti" + hook PASS |
| slug | Kebab-case, max 60, keyword | 50 chars, "cuti" present PASS |
| excerpt | Max 160, different from seoMetaDescription | 157 chars, different PASS |
| ogHeadline | Max 50, different from title, punchy | 47 chars, different PASS |
| seoKeywords | 3-8, all in body | 7 items, all found PASS |

**6/6 fields pass.**

## Internal Link Verification

| # | Anchor | Target slug | Found? |
|---|--------|-------------|--------|
| 1 | hustle culture | hustle-culture-kenapa-gen-z-berhenti-berlari | FOUND |
| 2 | toxic productivity: istirahat terasa seperti kejahatan | toxic-productivity-istirahat-terasa-seperti-kejahatan | FOUND |
| 3 | work-life balance bukan permintaan, tapi syarat bertahan | wlb-bukan-permintaan-syarat-bertahan-gen-z | FOUND |
| 4 | 8 jam kerja makan 14 jam hidupmu | time-poverty-gen-z-8-jam-kerja-makan-14-jam-hidupmu | FOUND |
| 5 | 43% pekerja Indonesia burnout | pekerja-indonesia-paling-bahagia-di-asia-tapi-43-persen-burnout | FOUND |

**5/5 links found. All anchors descriptive. PASS.**

## Chart Verification

| Chart | Type | Title | Data points | JSON |
|-------|------|-------|-------------|------|
| 1 | bar | Cuti Tahunan Minimal per Negara (Hari Kerja) | 10 | VALID |
| 2 | pie | Pekerja Indonesia Saat Liburan | 2 | VALID |

**2/2 charts valid. PASS.**

## Schema Readiness

| Schema | Fields needed | Status |
|--------|---------------|--------|
| Article | title, author, datePublished, image, publisher | All fields in frontmatter PASS |
| FAQPage | min 3 Q&A | 5 Q&A in body PASS |
| BreadcrumbList | category > artikel | category=karier PASS |
| Person | name, slug, bio | author=yovie-setiawan (exists in config) PASS |

**4/4 schema types ready. PASS.**

## OG Image Verification

| Check | Result |
|-------|--------|
| ogHeadline set | "12 hari cuti, tapi 66% tetap kerja saat liburan" |
| ogHeadline != title | PASS (different) |
| ogHeadline max 50 | 47 chars PASS |
| Category color | karier category has color in config PASS |
| Image auto-gen | Scheduled, cron will auto-generate PASS |

## Article Inventory

Updated `files/article-inventory.md` with entry #214.

## Build Quality Score

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2/2 | All fields terisi |
| SEO metadata | 2 | 2/2 | 6/6 fields pass |
| File creation | 1 | 1/1 | Created di correct path |
| Schema readiness | 1 | 1/1 | 4/4 schema types ready |
| OG image | 1 | 1/1 | ogHeadline unique + punchy |
| Internal links | 1 | 1/1 | 5 links, all valid |
| Inventory | 1 | 1/1 | Updated + format correct |
| Post-insert verification | 1 | 1/1 | CLEAN |
| **Total** | **10** | **10/10** | |

## Checklist

- [x] Slug uniqueness dicek (AVAILABLE)
- [x] Category dan author valid (Karier, Yovie Setiawan)
- [x] File `content/articles/karier/12-hari-cuti-indonesia-nggak-ngasih-kamu-istirahat.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true (17 items)
- [x] `excerpt` <= 160 chars (157)
- [x] `publishedAt` tidak null (2026-09-27 01:00:00+00)
- [x] `readingTime` di-set (9, bukan 1)
- [x] SEO Metadata Validation: 6/6 fields pass
- [x] Schema Markup Verification: Article + FAQ + Breadcrumb + Person ready
- [x] OG Image Verification: ogHeadline set, unique, 47 chars
- [x] Internal Link Verification: 5 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 2 charts valid JSON
- [x] Article inventory updated (#214)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10 (> 8)

## Next

Lanjut ke `/artikel-07-qc`
