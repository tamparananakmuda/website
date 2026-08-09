# Artikel Build Plan: Bullshit Jobs: Kerjamu Mungkin Nggak Ada Gunanya

## Pre-Flight Check

| Check | Result |
|-------|--------|
| Slug available | PASS — `bullshit-jobs-kerja-mungkin-nggak-ada-gunanya` |
| Category valid | PASS — Karier |
| Author valid | PASS — Yovie Setiawan |

## SEO Metadata Validation

| Field | Value | Length | Rule | Pass? |
|-------|-------|--------|------|-------|
| seoMetaTitle | Bullshit Jobs: Kerjamu Mungkin Nggak Ada Gunanya | 48 | max 70 | PASS |
| seoMetaDescription | Gallup 2026: 80% pekerja global cuma bertahan... | 142 | max 160 | PASS |
| slug | bullshit-jobs-kerja-mungkin-nggak-ada-gunanya | 45 | max 60, kebab-case | PASS |
| excerpt | Gallup 2026: 80% pekerja global cuma bertahan... | 145 | max 160 | PASS |
| ogHeadline | Kerjamu mungkin memang nggak ada gunanya | 40 | max 50, != title | PASS |
| seoKeywords | 8 keywords | 8 | 3-8 | PASS |
| Keywords in body | 6/8 found | 75% | min 70% | PASS |

**All SEO fields: PASS**

## File Creation

| Detail | Value |
|--------|-------|
| Path | `content/articles/karier/bullshit-jobs-kerja-mungkin-nggak-ada-gunanya.md` |
| Status | scheduled |
| publishedAt | 2026-09-16 01:00:00+00 (08:00 WIB) |
| readingTime | 11 min |
| Tags | 7 |
| sourceReferences | 14 |
| humanSignature | false (set true after humanizer) |
| factCheckStatus | verified |
| reviewStatus | publish |

## Post-Insert Verification

| Check | Result |
|-------|--------|
| publishedAt | Set |
| author | yovie-setiawan |
| category | karier |
| sourceReferences | Array (14 items) |
| excerpt | 145 chars (< 160) |
| readingTime | 11 (not 1) |
| Internal links | 4 |
| H2 count | 10 |
| Word count | 2,487 |
| **Status** | **CLEAN** |

## Internal Link Verification

| # | Anchor Text | Target Slug | File Exists? | Pass? |
|---|-------------|-------------|--------------|-------|
| 1 | quiet quitting | quiet-quitting-bukan-malas-sistem-kerja-nggak-mau-bayar-hati | YES (karier/) | PASS |
| 2 | hustle culture yang dikemas sebagai dedikasi | hustle-culture-kenapa-gen-z-berhenti-berlari | YES (karier/) | PASS |
| 3 | 57% Gen Z yang menurut Robert Walters tidak ingin jadi bos | 6-persen-ingin-jadi-bos-bukan-gen-z-kurang-ambisi-sistemnya | YES (karier/) | PASS |
| 4 | pekerja Indonesia yang menurut survei Jobstreet paling bahagia di Asia tapi 43% burnout | pekerja-indonesia-paling-bahagia-di-asia-tapi-43-persen-burnout | YES (mindset/) | PASS |

**Fixes applied:**
- hustle culture slug: `hustle-culture-bukan-ambisi-itu-burnout-yang-dikemas-sebagai-dedikasi` → `hustle-culture-kenapa-gen-z-berhenti-berlari` (actual file found)

**All 4 internal links: PASS (min 2 required)**

## Schema Markup Readiness

| Schema type | Fields needed | Ready? |
|-------------|---------------|--------|
| Article | title, slug, excerpt, publishedAt, author, category | All set |
| BreadcrumbList | category > artikel | Auto-generated |
| Person | author slug | yovie-setiawan |
| FAQPage | 5 Q&A in body (### format) | Present |

## OG Image Verification

| Check | Result |
|-------|--------|
| ogHeadline set | "Kerjamu mungkin memang nggak ada gunanya" |
| ogHeadline != title | PASS (different) |
| ogHeadline length | 40 chars (max 50) |
| Category color | karier (in config) |
| Auto-generate | Cron will generate on publish date (scheduled) |

## Article Inventory

Updated `files/article-inventory.md` with:
```
| 203 | Bullshit Jobs: Kerjamu Mungkin Nggak Ada Gunanya | bullshit-jobs-kerja-mungkin-nggak-ada-gunanya | Karier | Karier & Pekerjaan | kontra-narasi | 2026-09-16 (scheduled 08:00 WIB) |
```

## Build Quality Score (0-10)

| Factor | Weight | Score | Notes |
|--------|--------|-------|-------|
| Frontmatter completeness | 2 | 2 (strong) | All 24 fields set |
| SEO metadata | 2 | 2 (strong) | All 6 fields pass |
| File creation | 1 | 2 (strong) | Created at correct path |
| Schema readiness | 1 | 2 (strong) | Article + Breadcrumb + Person + FAQ ready |
| OG image | 1 | 2 (strong) | ogHeadline unique + punchy, 40 chars |
| Internal links | 1 | 2 (strong) | 4 links, all valid, descriptive anchors |
| Inventory | 1 | 2 (strong) | Updated with correct format |
| Post-insert verification | 1 | 2 (strong) | CLEAN |

**Total Score: 10/10** — **PASS** (target: min 8)

## Checklist

- [x] Slug uniqueness dicek
- [x] Category dan author valid
- [x] File `content/articles/karier/bullshit-jobs-kerja-mungkin-nggak-ada-gunanya.md` created
- [x] Frontmatter lengkap dan valid (24 fields)
- [x] `sourceReferences` isArray = true (14 items)
- [x] `excerpt` <= 160 chars (145)
- [x] `publishedAt` tidak null (2026-09-16 01:00:00+00)
- [x] `readingTime` di-set (11, bukan 1)
- [x] SEO Metadata Validation: 6/6 fields pass
- [x] Schema Markup Verification: Article + Breadcrumb + Person + FAQ ready
- [x] OG Image Verification: ogHeadline set, unique, 40 chars
- [x] Internal Link Verification: 4 links, semua target exists, descriptive anchor
- [x] Interactive blocks: 1 chart (valid JSON)
- [x] Article inventory updated (#203)
- [x] Post-Insert Verification: CLEAN
- [x] Build Quality Score: 10/10

## Next

Lanjut ke `/artikel-07-qc`
