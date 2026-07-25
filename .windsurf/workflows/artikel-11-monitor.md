---
description: Artikel step 11 - Ranking, CTR, traffic, dan engagement
---

# 11-monitor

Ranking, CTR, traffic, dan engagement.

## Prev

Dari `/artikel-10-distribution`

## Target Metric Per Artikel

| Metric | Target | Alert jika |
|--------|--------|------------|
| Page views (H+7) | > 500 | < 100 |
| Unique visitors (H+7) | > 300 | < 50 |
| Avg reading time | > 3 menit | < 1 menit |
| Scroll depth | > 60% | < 30% |
| Email subscribe rate | > 2% | < 0.5% |
| Social referral traffic | > 100 visits | < 20 visits |
| Bounce rate | < 70% | > 90% |
| Google indexing | Ter-index H+1 | Belum H+7 |

## Command cek Google indexing

```bash
# Cek apakah artikel sudah ter-index Google
curl -s "https://www.google.com/search?q=site:tamparananakmuda.com/artikel/SLUG" \
  -H "User-Agent: Mozilla/5.0" \
  | grep -o "tamparananakmuda.com/artikel/SLUG" \
  && echo "INDEXED" || echo "NOT INDEXED YET"
```

## Command cek Google Search Console (manual via dashboard)

1. Buka Google Search Console
2. Pilih property `tamparananakmuda.com`
3. Search: `artikel/SLUG`
4. Cek: impressions, clicks, CTR, average position
5. Target H+7: min 10 impressions, CTR > 2%

## Command cek sitemap dan RSS

```bash
# Pastikan slug masih di sitemap
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" \
  && echo "Sitemap OK" || echo "Sitemap MISSING"

# Pastikan slug masih di RSS
curl -s "https://tamparananakmuda.com/rss.xml" | grep "SLUG" \
  && echo "RSS OK" || echo "RSS MISSING"
```

## Command cek internal links dari artikel lain

```bash
# Cek artikel mana yang link ke artikel ini
grep -rl "/artikel/SLUG" content/articles/ --include="*.md" \
  | while read f; do echo "Linked from: $(basename $f)"; done
```

## Command cek HTTP status artikel di production

```bash
curl -s -o /dev/null -w "HTTP %{http_code} | Time: %{time_total}s | Size: %{size_download} bytes\n" \
  "https://tamparananakmuda.com/artikel/SLUG"
```

## Review schedule

### H+1: Google indexing check
- Jalankan command cek indexing di atas
- Jika belum ter-index: submit ulang URL ke Google Search Console
- Cek apakah sitemap dan RSS include slug

### H+3: Social engagement check
- IG Carousel: likes, saves, shares, comments
- X/Twitter thread: impressions, replies, profile clicks
- LinkedIn post: likes, comments, shares
- Newsletter: open rate, CTR
- Target: min 50 total engagements across platforms

### H+7: Metrics awal vs target
- Cek Umami dashboard untuk page views, reading time, scroll depth
- Cek Google Search Console untuk impressions, CTR, position
- Bandingkan dengan target metric di tabel atas
- Jika di bawah target: analisis kenapa (headline lemah? topik tidak menarik? distribution kurang?)

### H+30: Full performance review
- Total page views vs target
- Google ranking untuk keyword target
- Backlinks yang didapat (cek via Google Search Console atau Ahrefs free)
- Konversi: email subs, donasi, atau CTA clicks dari artikel ini
- Decision: refresh, update, atau biarkan

## Content Decay Signals

Tanda artikel perlu di-update (lanjut ke `/artikel-12-update`):

| Signal | Threshold | Action |
|--------|-----------|--------|
| Traffic turun | > 30% dalam 30 hari | Update konten, refresh data |
| Google ranking turun | > 5 posisi | Update SEO, tambah konten baru |
| Data outdated | > 2 tahun untuk data ekonomi | Update angka, tambah sumber baru |
| Internal links rusak | Ada link 404 | Fix atau ganti link |
| Backlink hilang | > 50% backlinks hilang | Refresh konten untuk attract backlink baru |
| CTR turun | < 1% di Google Search Console | Update meta title dan description |

## Action plan jika artikel tidak ter-index dalam 7 hari

1. Submit ulang URL ke Google Search Console
2. Cek robots.txt: `curl -s https://tamparananakmuda.com/robots.txt`
3. Cek apakah ada `noindex` tag: `curl -s https://tamparananakmuda.com/artikel/SLUG | grep -i noindex`
4. Cek sitemap: `curl -s https://tamparananakmuda.com/sitemap.xml | grep SLUG`
5. Share artikel di social media untuk dapat crawl signals
6. Tambah internal link dari artikel lain yang sudah ter-index
7. Jika masih belum ter-index H+14: cek Google Search Console Coverage report untuk error

## Checklist

- [ ] Artikel ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Metrics awal vs target (H+7)
- [ ] Google Search Console: impressions > 10, CTR > 2% (H+7)
- [ ] Internal links dari artikel lain dicek (H+7)
- [ ] Full performance review (H+30)
- [ ] Decision: refresh, update, atau biarkan (H+30)
- [ ] Jika ada decay signal: lanjut ke `/artikel-12-update`

## Next

Lanjut ke `/artikel-12-update`
