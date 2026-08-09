# Series Build: Sistem Media Indonesia

**Step:** 07-build
**Date:** 2027-03-01
**Status:** DONE

---

## Pre-Flight Checks

| Check | Result | Notes |
|-------|--------|-------|
| Series in config.ts | PASS | `content/config.ts` line 90, slug `sistem-media-indonesia`, status updated to `scheduled` |
| 7 part files exist | PASS | All in `content/seri/sistem-media-indonesia/` |
| Slug uniqueness | PASS | All 7 slugs unique, no collision with existing articles |

## Config Update

- `content/config.ts` line 90: status changed from `coming-soon` → `scheduled`
- expectedDate: `2027-04-01`
- expectedParts: 7

## Frontmatter Verification

All 7 parts have complete frontmatter:

| Field | P1 | P2 | P3 | P4 | P5 | P6 | P7 |
|-------|----|----|----|----|----|----|----|
| title | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| slug | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| excerpt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| publishedAt | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| status | scheduled | scheduled | scheduled | scheduled | scheduled | scheduled | scheduled |
| category | teknologi | teknologi | teknologi | teknologi | teknologi | teknologi | teknologi |
| subcategory | teknologi-ai | teknologi-ai | teknologi-ai | teknologi-ai | teknologi-ai | teknologi-ai | teknologi-ai |
| author | yovie-setiawan | yovie-setiawan | yovie-setiawan | yovie-setiawan | yovie-setiawan | yovie-setiawan | yovie-setiawan |
| series | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| seriesOrder | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| povTag | kontra-narasi | kontra-narasi | kontra-narasi | kontra-narasi | kontra-narasi | kontra-narasi | kontra-narasi |
| tags (6) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| ogHeadline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| seoMetaTitle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| seoMetaDescription | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| seoKeywords (6) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| sourceReferences (4) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| featured | true | false | false | false | false | false | false |
| humanSignature | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## SEO Metadata Validation (42 fields)

| Part | ogHeadline | metaTitle | metaDesc | excerpt | keywords | Result |
|------|-----------|-----------|----------|---------|----------|--------|
| P1 | 39c | 59c | 127c | 119c | 6 | PASS |
| P2 | 42c | 52c | 139c | 142c | 6 | PASS |
| P3 | 43c | 57c | 156c | 144c | 6 | PASS |
| P4 | 48c | 52c | 143c | 152c | 6 | PASS |
| P5 | 49c | 65c | 153c | 150c | 6 | PASS |
| P6 | 42c | 57c | 154c | 149c | 6 | PASS |
| P7 | 46c | 68c | 158c | 136c | 6 | PASS |

**All 42 SEO fields: PASS** (ogHeadline ≤ 50, metaTitle ≤ 70, metaDesc ≤ 160, excerpt ≤ 160, keywords 3-8, ogHeadline ≠ title, excerpt ≠ metaDesc)

## Series Navigation Verification

| Check | P1 | P2 | P3 | P4 | P5 | P6 | P7 | Result |
|-------|----|----|----|----|----|----|----|--------|
| Prev link | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 PASS |
| Next link | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | 6/6 PASS |
| Recap | - | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 6/6 PASS |
| Teaser | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | - | 6/6 PASS |

**Navigation: 24/24 PASS**

## Internal Links Verification

| Part | Series Nav | Internal Links | Total Unique | All Targets Exist |
|------|-----------|---------------|-------------|-------------------|
| P1 | 1 (next) | 2 (doomscrolling, algoritma) | 3 | ✅ |
| P2 | 2 (prev+next) | 2 (doomscrolling, algoritma) | 4 | ✅ |
| P3 | 2 (prev+next) | 2 (algoritma, gojek-grab) | 4 | ✅ |
| P4 | 2 (prev+next) | 2 (deepfake, data-privasi) | 4 | ✅ |
| P5 | 2 (prev+next) | 2 (influencer-bukan-profesi, creator-burnout) | 4 | ✅ |
| P6 | 2 (prev+next) | 2 (phk-tokopedia, gojek-grab) | 4 | ✅ |
| P7 | 1 (prev) | 2 (algoritma, doomscrolling) | 3 | ✅ |

**Internal Links: 7/7 PASS** (min 2 per part + antar part series nav, all targets exist)

### Unique Internal Link Targets (8 articles)

1. `/artikel/doomscrolling-bukan-kebiasaan-ketakutan-yang-algoritma-jual` — P1, P2, P7
2. `/artikel/algoritma-bukan-netral-feed-media-sosial-hilang-realitas` — P1, P2, P3, P7
3. `/artikel/gojek-grab-bukan-jadi-bos-sendiri-algoritma-yang-jadi-bosmu` — P3, P6
4. `/artikel/deepfake-kekerasan-seksual-dibiarkan-hukum-indonesia` — P4
5. `/artikel/data-privasi-gen-z-bukan-tidak-peduli-tidak-diberi-pilihan` — P4
6. `/artikel/influencer-bukan-profesi-itu-lotere-yang-dikemas-sebagai-karier` — P5
7. `/artikel/creator-burnout-bukan-kelelahan-algoritma-eksploitasi` — P5
8. `/artikel/phk-tokopedia-kerja-keras-nggak-menjamin-aman` — P6

## Chart Verification

| Part | Chart Type | Valid JSON | Result |
|------|-----------|-----------|--------|
| P1 | bar | ✅ | PASS |
| P2 | bar | ✅ | PASS |
| P3 | bar | ✅ | PASS |
| P4 | funnel | ✅ | PASS |
| P5 | bar | ✅ | PASS |
| P6 | line | ✅ | PASS |
| P7 | - | - | N/A (synthesis, no chart) |

**Charts: 6/6 PASS**

## Article Inventory

Updated `files/article-inventory.md` with entries #195-201:

| # | Title | Slug | Published |
|---|-------|------|----------|
| 195 | Konsentrasi Kepemilikan: 6 Grup, 90% Berita (P1) | sistem-media-indonesia-part-1-... | 2027-04-01 |
| 196 | Ekonomi Klik: Marah = Engagement = Iklan (P2) | sistem-media-indonesia-part-2-... | 2027-04-02 |
| 197 | Algoritma sebagai Editor: Platform Bukan Netral (P3) | sistem-media-indonesia-part-3-... | 2027-04-03 |
| 198 | Ekosistem Hoax: Industri yang Untung (P4) | sistem-media-indonesia-part-4-... | 2027-04-04 |
| 199 | Influencer sebagai Jurnalis: Opini Dikemas Fakta (P5) | sistem-media-indonesia-part-5-... | 2027-04-05 |
| 200 | Kematian Jurnalisme Lokal: Daerah Tanpa Suara (P6) | sistem-media-indonesia-part-6-... | 2027-04-06 |
| 201 | Sintesis: Media Tidak Gagal, Didesain Bikin Kamu Nggak Percaya (P7) | sistem-media-indonesia-part-7-... | 2027-04-07 |

## Fixes Applied During Build

1. P7: Excerpt shortened from 164c → 136c (was > 160 limit)
2. P1-P7: Added 2 internal links per part to existing TAM articles (doomscrolling, algoritma, gojek-grab, deepfake, data-privasi, influencer-bukan-profesi, creator-burnout, phk-tokopedia)
3. Config: status updated from `coming-soon` → `scheduled`

## Series Build Quality Score (0-12)

| Factor | Weight | Score | Points | Notes |
|--------|--------|-------|--------|-------|
| Frontmatter | 2 | 2 | 2 | All fields terisi, no missing |
| Series fields | 2 | 2 | 2 | series + seriesOrder valid, match config |
| SEO metadata | 1 | 2 | 1 | All 42 fields pass |
| Navigation | 2 | 2 | 2 | Full prev/next + recap/teaser, 24/24 |
| Internal links | 1 | 2 | 1 | 2+ per part + antar part, all targets exist |
| OG headline | 1 | 2 | 1 | Unique + punchy, all different from title, ≤ 50c |
| File creation | 1 | 2 | 1 | Path benar di content/seri/sistem-media-indonesia/ |
| Post-insert | 1 | 2 | 1 | All 7 parts verified CLEAN |
| Inventory | 1 | 2 | 1 | Updated #195-201, format benar |

**Total Score: 12/12** ✅ (target: min 9)

---

## Next

Lanjut ke `/seri-08-qc`
