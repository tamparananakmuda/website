# Artikel Passion Trap - 06 Build

## Pre-Flight Checks

| Check | Status | Notes |
|-------|--------|-------|
| Slug uniqueness | PASS | `passion-itu-trap-kerja-butuh-gaji-bukan-cinta` available |
| Category valid | PASS | Mindset |
| Author valid | PASS | Yovie Setiawan |

## File Created

- **Path**: `content/articles/mindset/passion-itu-trap-kerja-butuh-gaji-bukan-cinta.md`
- **Status**: scheduled
- **Published at**: 2026-09-23 01:00:00+00 (08:00 WIB)

## Frontmatter Verification

| Field | Value | Status |
|-------|-------|--------|
| title | "Passion Itu Trap: Kerja Butuh Gaji, Bukan Cinta" | PASS |
| slug | "passion-itu-trap-kerja-butuh-gaji-bukan-cinta" | PASS |
| excerpt | 151 chars | PASS (max 160) |
| publishedAt | "2026-09-23 01:00:00+00" | PASS |
| status | "scheduled" | PASS |
| category | "mindset" | PASS |
| subcategory | "mindset-realita" | PASS |
| author | "yovie-setiawan" | PASS |
| series | null | PASS |
| seriesOrder | null | PASS |
| povTag | "kontra-narasi" | PASS |
| tags | 7 tags | PASS |
| ogHeadline | "\"Follow your passion\" bikin kamu miskin?" (40 chars) | PASS (max 50, different from title) |
| seoMetaTitle | "Passion Itu Trap: Kerja Butuh Gaji, Bukan Cinta" | PASS |
| seoMetaDescription | 146 chars | PASS (max 160) |
| seoKeywords | 5 keywords | PASS |
| sourceReferences | 7 items, isArray | PASS |
| featured | false | PASS |
| readingTime | 9 | PASS |
| humanSignature | true | PASS |
| factCheckStatus | "verified" | PASS |
| reviewStatus | "publish" | PASS |
| coverImageUrl | null | PASS (OG dynamic) |
| coverImageAlt | null | PASS |

## SEO Metadata Validation

| Field | Rule | Status |
|-------|------|--------|
| seoMetaTitle | Max 70 chars, keyword present | PASS (47 chars, "passion" present) |
| seoMetaDescription | Max 160 chars, keyword + hook | PASS (146 chars, "passion" + hook) |
| slug | Kebab-case, max 60 chars, keyword | PASS (48 chars, "passion" present) |
| excerpt | Max 160 chars, unique from seoMetaDescription | PASS (151 chars, different wording) |
| ogHeadline | Max 50 chars, different from title, punchy | PASS (40 chars, different, hook) |
| seoKeywords | 3-8 keywords, all in body | PASS (5 keywords, all present in body) |

## Internal Link Verification

| Link | Target File | Status |
|------|-------------|--------|
| `/artikel/magang-gratis-bukan-belajar-eksploitasi-dikemas-pengalaman` | `content/articles/karier/magang-gratis-bukan-belajar-eksploitasi-dikemas-pengalaman.md` | FOUND |
| `/artikel/hustle-culture-bukan-ambisi-itu-burnout-yang-dikemas-sebagai-dedikasi` | `content/articles/mindset/hustle-culture-bukan-ambisi-itu-burnout-yang-dikemas-sebagai-dedikasi.md` | FOUND |
| `/artikel/quiet-quitting-bukan-malas-sistem-kerja-nggak-mau-bayar-hati` | `content/articles/karier/quiet-quitting-bukan-malas-sistem-kerja-nggak-mau-bayar-hati.md` | FOUND |
| `/artikel/toxic-productivity-istirahat-terasa-seperti-kejahatan` | `content/articles/mindset/toxic-productivity-istirahat-terasa-seperti-kejahatan.md` | FOUND |
| `/artikel/growth-mindset-dipakai-gaslighting-kamu` | `content/articles/mindset/growth-mindset-dipakai-gaslighting-kamu.md` | FOUND |
| `/dukung` | Support page | N/A (CTA) |

**Total internal links: 5 (min 2 required) + 1 CTA link**

## Schema Readiness

| Schema | Trigger | Fields Ready |
|--------|---------|-------------|
| Article | All articles | title, author, datePublished, image (OG dynamic), publisher |
| FAQPage | 5 Q&A in body | Questions and answers in markdown |
| BreadcrumbList | Automatic | category > artikel |

## OG Image

- ogHeadline: set, unique, 40 chars (max 50)
- Category color: Mindset (in config)
- Scheduled: OG image auto-generate by cron

## Article Inventory

- Updated: `files/article-inventory.md` entry #210
- Format: `| 210 | Passion Itu Trap: Kerja Butuh Gaji, Bukan Cinta | passion-itu-trap-kerja-butuh-gaji-bukan-cinta | Mindset | Mindset Realita | kontra-narasi | 2026-09-23 (scheduled 08:00 WIB) |`

## Post-Insert Verification

```
slug: passion-itu-trap-kerja-butuh-gaji-bukan-cinta | status: scheduled | publishedAt: 2026-09-23 01:00:00+00
category: mindset | author: yovie-setiawan
sourceReferences isArray: true
readingTime: 9
ogHeadline: "Follow your passion" bikin kamu miskin?
All checks passed.
```

## Build Quality Score

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2 | All fields terisi |
| SEO metadata | 2 | 2 | 6/6 fields pass |
| File creation | 1 | 1 | Created di correct path |
| Schema readiness | 1 | 1 | Article + FAQ ready |
| OG image | 1 | 1 | ogHeadline unique + punchy |
| Internal links | 1 | 1 | 5 links, semua valid |
| Inventory | 1 | 1 | Updated + format correct |
| Post-insert verification | 1 | 1 | CLEAN |
| **Total** | **10** | **10** | **Target: > 8** |

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/mindset/passion-itu-trap-kerja-butuh-gaji-bukan-cinta.md` created
- [x] Frontmatter lengkap dan valid
- [x] `sourceReferences` isArray = true
- [x] `excerpt` <= 160 chars (151)
- [x] `publishedAt` tidak null
- [x] `readingTime` di-set (9)
- [x] SEO Metadata Validation: 6 fields pass
- [x] Schema Markup Verification: Article + FAQ ready
- [x] OG Image Verification: ogHeadline set, unique, 40 chars
- [x] Internal Link Verification: 5 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 1 chart (bar) with valid JSON
- [x] Article inventory updated (#210)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10
