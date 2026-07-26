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

## AI Citation Tracking

Cek apakah artikel sudah di-cite oleh AI search engines:

| Check | Cara | Timing | Target |
|-------|------|--------|--------|
| **Perplexity** | Search query terkait di Perplexity, cek apakah TAM di-cite | H+14 | 1+ citation |
| **ChatGPT** | Search query terkait di ChatGPT (with web), cek source | H+14 | 1+ citation |
| **Google AI Overview** | Search query terkait di Google, cek AI Overview | H+14 | Muncul di overview |
| **Bing Copilot** | Search query terkait di Bing Copilot | H+30 | 1+ citation |

Jika belum di-cite H+14: cek format data self-contained, definisi jelas, FAQ format. Mungkin perlu format ulang section.

## Action Research Spiral

Monitoring TAM menggunakan action research spiral (Plan > Act > Observe > Reflect):

| Phase | Activity | Output |
|-------|----------|--------|
| **Plan** | Sebelum publish, tentukan hypothesis: "Artikel ini akan perform karena [angle/data/timing]" | Hypothesis |
| **Act** | Publish + distribute sesuai workflow | Execution log |
| **Observe** | Collect metrics di H+1, H+3, H+7, H+30 | Data table |
| **Reflect** | Bandingkan hypothesis vs reality. Kenapa over/under perform? | Learning note |

Setiap artikel menghasilkan 1 learning note. Akumulasi learning notes = content strategy improvement.

## Bayesian Calibration

Update prior belief tentang apa yang work berdasarkan data:

| Metric | Prior belief | Update jika | Posterior |
|--------|-------------|-------------|-----------|
| **Best posting time** | 08:00 WIB | Data menunjukkan 12:00 lebih baik | Update schedule |
| **Best angle** | Kontra-narasi | Data menunjukkan data-led lebih perform | Prioritize data-led |
| **Best length** | 1.500 kata | Data menunjukkan 2.000+ lebih perform | Expand target |
| **Best platform** | IG Carousel | Data menunjukkan X/Twitter thread lebih reach | Shift effort |

Catat calibration di learning note. Jangan over-update dari 1 artikel, cari pattern dari 5+ artikel.

## Monitor Quality Score (0-10)

Score monitoring sebelum decision update/biarkan. Target: minimal 7.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Metrics collected** | 2 | < 3 metric | 3-5 metric | 6+ metric |
| **Timing adherence** | 1 | Tidak sesuai schedule | Sebagiane | H+1, H+3, H+7, H+30 semua |
| **AI citation check** | 1 | Tidak dicek | Dicek tapi tidak actionable | Citation teridentifikasi |
| **Action research** | 1 | Tidak ada hypothesis | Hypothesis tapi tidak reflect | Full spiral |
| **Bayesian calibration** | 1 | Tidak update | Update dari 1 artikel | Pattern dari 5+ |
| **Decay detection** | 2 | Tidak detect | Detect tapi tidak act | Detect + act |
| **Decision made** | 1 | Tidak ada decision | Vague decision | Clear: refresh/update/biarkan |
| **Learning note** | 1 | Tidak ada | Ada tapi thin | Detailed + actionable |

Jika score < 7: monitoring tidak cukup, tambah metric atau timing check.

## Checklist

- [ ] Artikel ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Social engagement vs target (H+3): min 50 total engagements
- [ ] Metrics awal vs target (H+7)
- [ ] Google Search Console: impressions > 10, CTR > 2% (H+7)
- [ ] Internal links dari artikel lain dicek (H+7)
- [ ] AI Citation Tracking: Perplexity + ChatGPT + Google AI Overview dicek (H+14)
- [ ] Action Research Spiral: hypothesis + reflect selesai
- [ ] Bayesian Calibration: learning note tercatat
- [ ] Full performance review (H+30)
- [ ] Decision: refresh, update, atau biarkan (H+30)
- [ ] Monitor Quality Score: min 7 (dari 10)
- [ ] Jika ada decay signal: lanjut ke `/artikel-12-update`

## Next

Lanjut ke `/artikel-12-update`
