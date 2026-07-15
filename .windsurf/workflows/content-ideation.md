---
description: Workflow untuk mencari ide konten artikel TAM per kategori — kombinasi trend scan + gap analysis dengan angle test TAM
---

# Content Ideation Workflow

Workflow untuk menemukan ide artikel TAM di berbagai kategori. Kombinasi trend-based scan + gap analysis, difilter melalui angle test TAM.

## Kategori & Content Pillars TAM

| Kategori DB | Slug | Color | Pillar Utama | % Target | Tone |
|---|---|---|---|---|---|
| Mindset | `mindset` | #D13A3A | Mindset & Realita (20%), Psikologi (5%), Tamparan, Filosofi Hidup | 25-30% | Serius, reflektif, provokatif |
| Karier | `karier` | #4080D9 | Karier & Dunia Kerja (15%), Produktivitas (10%), Pendidikan, Komunikasi, Skill Masa Depan (5%) | 25-30% | Praktis, to-the-point, sarkas |
| Uang | `uang` | #D9A040 | Uang (15%) | 15% | Rasional, data-driven, anti-judi |
| Teknologi | `teknologi` | #6040D9 | Teknologi & AI (10%), Analisis Fenomena (5%) | 10-15% | Objektif, praktis, anti-fanboy |
| Bisnis | `bisnis` | #A040D9 | Bisnis (15%), Skill Masa Depan (5%) | 15-20% | Praktis, no-nonsense, anti-hype |
| Kehidupan | `kehidupan` | #40B880 | Hubungan Sosial, Lifestyle, Sejarah Orang Sukses, Ulasan Buku | 5-10% | Empatik, reflektif, personal |

## Frequency

Jalankan workflow ini **mingguan** (setiap Senin) untuk maintain content pipeline 2-4 minggu ke depan.

## Step 1: Trend Scan

Scan platform untuk topik yang sedang ramai dibahas anak muda Indonesia.

### 1a. Google Trends
```
1. Buka https://trends.google.com/trends/explore?geo=ID
2. Filter: Last 7 days → Indonesia
3. Cari keyword terkait kategori target:
   - Mindset: "self improvement", "mental health", "motivasi", "mindset"
   - Karier: "kerja", "fresh graduate", "karir", "CV", "PHK", "burnout kerja"
   - Uang: "investasi", "pinjaman online", "gaji", "nabung", "paylater", "FIRE movement"
   - Bisnis: "bisnis", "startup", "UMKM", "side hustle", "gagal bisnis"
   - Teknologi: "AI", "ChatGPT", "crypto", "gadget", "coding", "no-code"
   - Kehidupan: "toxic relationship", "pertemanan", "loneliness", "digital detox", "quarter life crisis"
4. Catat top 5 trending queries per kategori
```

### 1b. Twitter/X Indonesia
```
1. Search query: "min_faves:100 lang:id" + keyword kategori
2. Cari thread viral yang spawn diskusi
3. Catat: topik, sentiment, angle yang dibahas, angle yang MISSING
4. Perhatikan quote tweets — itu sinyal disagreement = potensi kontra-narasi
```

### 1c. Reddit (r/indonesia, r/IndoArtikel, r/financialindependence)
```
1. Sort by: Hot → This Week
2. Filter post yang dapat 100+ upvotes
3. Catat: pain points, pertanyaan yang belum dijawab, debat yang berulang
4. Reddit = sinyal awal tren sebelum mainstream
```

### 1d. TikTok Indonesia
```
1. Search hashtag: #fyp + keyword kategori (e.g. #kerjaremote, #investasi pemula)
2. Filter video dengan 100K+ views
3. Catat: hook yang dipakai, komentar audience (pain points), angle creator
4. TikTok = sinyal apa yang sudah mainstream (late to trend = skip)
```

### 1e. Google Keyword Research
```
1. Buka https://ads.google.com/keywordsplanner (atau Ubersuggest free tier)
2. Masukkan seed keyword dari trend scan
3. Filter: Indonesia, Bahasa Indonesia
4. Catat: search volume (low/med/high), keyword difficulty, related keywords
5. Prioritas: long-tail (3-5 kata) dengan volume medium + difficulty low
```

### Output Step 1
Daftar raw ideas per kategori:
```
[Kategori] | [Topik] | [Platform source] | [Volume/signal strength] | [Angle yang dibuat] | [Angle yang MISSING] | [Keyword + search volume]
```
Simpan output ke `files/ideation-backlog.md` untuk tracking.

**Template `files/ideation-backlog.md`:**
```
# Ideation Backlog

## [Tanggal scan] - Kategori: [kategori]

| # | Topik | Platform | Signal | Angle dibuat | Angle MISSING | Keyword | Volume | Difficulty |
|---|---|---|---|---|---|---|---|---|
| 1 | ... | ... | ... | ... | ... | ... | ... | ... |

## Prioritized (skor >= 3.5)

| Rank | Kategori | Working title | Skor | POV | Keyword | Status |
|---|---|---|---|---|---|---|
| 1 | ... | ... | 4.6 | kontra-narasi | ... | drafted/published |

## Rejected (skor < 3.5)

| Topik | Skor | Alasan reject |
|---|---|---|
| ... | 2.8 | Gap terlalu rendah, competitor sudah cover |
```

## Step 2: Gap Analysis

Bandingkan raw ideas dengan artikel yang sudah ada di TAM dan competitor.

### 2a. Audit Artikel Existing TAM
```bash
# Query semua artikel published
curl -s "$SUPA_URL/rest/v1/posts?status=eq.published&select=slug,title,category:categories(slug,title)&order=published_at.desc" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
d.forEach(p => console.log(p.category?.slug, '|', p.slug, '|', p.title));
"
```

### 2b. Competitor Scan
```
Platform umum yang di-scan:
- Medium Indonesia (medium.com/tag/indonesia)
- Tirto.id (kolom opini/youth)
- Katadata.co.id (kolom young)
- LinkedIn articles (kreator konten karir/keuangan Indonesia)
- Substack Indonesia (newsletter writers)

Kategori-specific competitors:
- Uang: CNBC Indonesia, Detik Finance, Tempo Ekonomi, Kumparan Bisnis, Asetpintar
- Karier: Kalibrr blog, Glints blog, LinkedIn karir creators
- Mindset: Tirto.id opini, Medium ID self-improvement, Rolf Wibawa (YouTube)
- Bisnis: DailySocial, Katadata Startup, Tech in Asia ID
- Teknologi: Tech in Asia, Detik Tech, Kompas Tekno
- Kehidupan: Kumparan, IDN Times, Popbela

TikTok/YouTube creators (scan untuk angle yang dibuat vs MISSING):
- Finance: @finansialku, @sahamgain, @investasigenggam
- Karier: @glints, @kalibrr
- Mindset: @rolfwibawa, @raditya dika (karir/life)

Per competitor, catat:
- Topik yang sudah dibahas
- Angle yang dipakai
- Angle yang TIDAK dipakai (gap opportunity)
```

### 2c. Cross-Reference
Untuk setiap raw idea dari Step 1, tanya:
1. **Sudah ada di TAM?** → Jika ya, bisa update/rewrite dengan angle baru atau skip
2. **Sudah ada di competitor?** → Jika ya, angle TAM harus berbeda (kontra-narasi atau data yang berbeda)
3. **Belum dibahas siapapun?** → Greenfield opportunity, prioritas tinggi

### Output Step 2
Filtered ideas dengan gap status:
```
[Kategori] | [Topik] | [TAM status: new/update/skip] | [Competitor status: unique/similar/covered] | [Gap opportunity: high/medium/low]
```

## Step 3: Angle Test TAM

Setiap idea yang lolos Step 2 harus lulus angle test.

### 3a. Dua Pertanyaan Wajib
1. **"Apakah ada media lain yang akan menulis ini dengan cara yang sama?"**
   - Jika ya → rewrite angle atau buang
2. **"Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?"**
   - Jika tidak → terlalu generik, perlu angle yang lebih spesifik

### 3b. POV Selection (wajib pilih salah satu)

| POV | Deskripsi | Cocok untuk topik |
|---|---|---|
| `kontra-narasi` | Melawan narasi populer dengan dasar kuat | Hustle culture, pinjol, investasi boom, growth mindset |
| `refleksi` | Pengalaman/observasi personal yang spesifik | Gaji pertama, burnout, quarter life crisis, perbandingan diri |
| `data` | Data + interpretasi yang tidak obvious | FIRE movement, PHK statistik, tren Gen Z, ekonomi |
| `framework` | Kerangka berpikir original | Cara pilih karir, sistem produktivitas, Coast FIRE |
| `tamparan` | Statement tajam yang membongkar ilusi langsung | Menyalahkan orang tua, passion tidak bayar tagihan |
| `riset` | Temuan riset/studi sebagai angle utama | Survei freelancer, data OJK, studi psikologi |
| `opini` | Sudut pandang yang berani dan spesifik | Hustle culture lebih berbahaya dari kerja keras |
| `panduan` | Guide praktis berbasis pengalaman nyata | Cara atur gaji pertama, cara negosiasi gaji |
| `inspirasi` | Cerita inspiratif tanpa menjual harapan palsu | Gagal 3 kali lalu sukses, kisah Bob Sadino |

**Data Availability Check:** Sebelum lanjut ke scoring (Step 4), pastikan minimal 2 data sources tersedia untuk backup angle. Jika tidak ada data kuat, ide perlu di-research lebih lanjut atau diturunkan skornya.

### 3c. TAM Voice Check
- [ ] Jujur — tidak menghindari kebenaran yang tidak nyaman
- [ ] Langsung — tidak bertele-tele
- [ ] Menghormati pembaca — tidak merendahkan, tidak menggurui
- [ ] Tone sesuai kategori (lihat tabel di atas)

### Output Step 3
Validated ideas siap draft:
```
[Kategori] | [Topik] | [POV] | [Angle 1-liner] | [Working title] | [seo_keywords: keyword1, keyword2, keyword3]
```

**`seo_keywords` format:** 3-8 keyword long-tail dalam Bahasa Indonesia, dipilih dari Step 1e (Google Keyword Research). Prioritas: search volume medium + difficulty low. Field ini akan di-pass ke `posts.seo_keywords` saat insert via `/post-article-execution` Step 4.

## Step 4: Prioritisasi

Urutkan validated ideas berdasarkan:

| Faktor | Bobot | Skor (1-5) |
|---|---|---|
| Trend signal strength | 30% | _ |
| Gap opportunity | 25% | _ |
| SEO potential (search volume + difficulty) | 20% | _ |
| TAM uniqueness (angle test) | 15% | _ |
| Evergreen vs newsjacking | 10% | _ |

**Formula:** `(Trend × 0.3) + (Gap × 0.25) + (SEO × 0.2) + (Uniqueness × 0.15) + (Evergreen × 0.1)`

**Trend Signal Scoring (1-5):**
- 5: 3+ platform menampilkan topik ini minggu ini (Reddit 100+ upvotes, Twitter 1000+ faves, Google Trends rising)
- 4: 2 platform viral, atau 1 platform dengan signal sangat kuat
- 3: 1 platform viral, atau topik mulai naik tapi belum mainstream
- 2: Topik dibahas tapi tidak viral, engagement rendah
- 1: Tidak ada signal, topik cold

**Gap Opportunity Scoring (1-5):**
- 5: Greenfield, tidak ada competitor bahas topik ini sama sekali
- 4: Competitor bahas tapi angle TAM sangat berbeda (kontra-narasi vs mainstream)
- 3: Competitor bahas, angle TAM bisa dibedakan dengan data tambahan
- 2: Competitor sudah bahas dengan angle mirip, TAM perlu twist ekstra
- 1: Topik sudah saturated, tidak ada angle baru

**TAM Uniqueness Scoring (1-5):**
- 5: Angle test lolos sempurna, tidak ada media lain yang akan tulis dengan cara sama
- 4: Angle test lolos, angle TAM sangat distinct
- 3: Angle test lolos tapi ada kemiripan dengan beberapa competitor
- 2: Angle test borderline, perlu sharpen angle
- 1: Angle test gagal, terlalu generik

**Evergreen vs Newsjacking Scoring (1-5):**
- 5: Topik relevan 12+ bulan, selalu dicari
- 4: Topik relevan 6-12 bulan
- 3: Topik relevan 3-6 bulan
- 2: Topik relevan 1-3 bulan, newsjacking dengan shelf life pendek
- 1: Topik basi dalam < 1 bulan

**SEO Potential Scoring (1-5):**
- 5: Volume tinggi + difficulty rendah + SERP gap (top 3 Google tidak ada artikel quality)
- 4: Volume tinggi + difficulty sedang, atau volume sedang + difficulty rendah
- 3: Volume sedang + difficulty sedang
- 2: Volume rendah atau difficulty tinggi
- 1: Tidak ada search volume atau difficulty sangat tinggi

**SERP Gap Check (untuk SEO scoring):**
Sebelum scoring SEO, cek top 3 Google results untuk keyword target:
```
Gunakan search_web dengan query keyword target.
Catat: URL, angle artikel, kualitas konten (depth, data, originalitas).
Jika top 3 tidak ada artikel quality (listicle tipis, no data, no original angle) = SERP gap = SEO skor +1.
Format lengkap: lihat files/templates/seo-brief-template.md section "Kompetitor Analysis".
```

**Tiebreaker Rule:**
Jika dua ide punya skor sama, prioritaskan berdasarkan:
1. **Pillar allocation** - kategori yang belum terpenuhi target bulanan diprioritaskan
2. **Trend signal** - skor trend lebih tinggi menang
3. **Gap opportunity** - skor gap lebih tinggi menang

**Threshold:** Hanya ide dengan skor >= 3.5 yang masuk content calendar.
Skor 3.5 = minimal rata-rata 3 (medium) di semua faktor dengan bobot. Ide dengan skor 3.5 berarti tidak ada faktor yang sangat lemah. Ide dengan skor < 3.5 punya setidaknya satu faktor lemah yang akan menurunkan kualitas artikel.

### Output Step 4
Prioritized backlog:
```
Rank | [Kategori] | [Working title] | [Skor] | [POV] | [Keyword] | [Trend/Gap/Evergreen tag]
```

## Step 5: Content Calendar Mapping

Distribusi ide ke calendar berdasarkan alokasi pillar:

```
Target per bulan (8 artikel):
- Mindset: 2-3 artikel
- Karier: 2-3 artikel
- Uang: 1-2 artikel
- Bisnis: 1-2 artikel
- Teknologi: 1 artikel
- Kehidupan: 0-1 artikel (as-needed)
```

Rules:
- Max 2 artikel topik serupa berurutan
- Selang-seling antara kontra-narasi dan refleksi
- 1 evergreen + 1 trend-based per cycle
- Newsjacking hanya jika skor ≥ 4.0

## Quick Reference: Source Platforms

| Platform | Signal Type | Lead Time | Best For |
|---|---|---|---|
| Reddit | Early signal | 2-4 weeks before mainstream | Pain points, debat |
| Twitter/X | Real-time | Immediate | Viral hooks, kontra-narasi |
| Google Trends | Mainstream | Already trending | SEO keyword validation |
| TikTok | Late signal | Already saturated | Skip atau angle kontra |
| LinkedIn | Professional | 1-2 weeks | Karir, bisnis, keuangan |
| Medium ID | Competitor | Ongoing | Gap analysis |

## Step 6: Performance Review Loop

Sebelum trend scan mingguan, cek performa artikel yang sudah published. Insight dari review ini mempengaruhi scoring dan prioritas ide baru.

**Cek top/bottom performers:**
- Buka `files/ContentCalendar.md` Section 4 (Monthly Review) untuk checklist lengkap
- Cek `files/Analytics.md` Section 4 untuk pillar performance dan top/bottom artikel
- Catat: pillar mana yang overperform/underperform, POV tag yang paling resonan, topik yang perlu di-refresh

**Feed insight ke scoring:**
- Jika pillar X overperform: naikkan prioritas ide di kategori tersebut (+0.5 ke skor akhir)
- Jika pillar X underperform: turunkan prioritas atau revise angle (-0.5 ke skor akhir)
- Jika POV tag Y paling resonan: pertimbangkan untuk ide baru
- Jika artikel evergreen masih dapat traffic: prioritas ide evergreen naik

**Output Step 6:**
```
[Review date] | Top 3 artikel: [slugs] | Bottom 3: [slugs] | Pillar insight: [naik/turun] | POV insight: [tag] | Action: [adjust scoring]
```

## Handoff ke Post-Article Execution

Ide yang sudah diprioritisasi dan masuk calendar langsung dilanjutkan ke workflow `/post-article-execution` mulai dari Step 0.5 (Draft Writing Guidelines).

## Checklist Final

- [ ] Performance review loop completed (Step 6: cek top/bottom performers)
- [ ] Trend scan completed (min 5 ideas per kategori target)
- [ ] Keyword research done (search volume + difficulty checked)
- [ ] `seo_keywords` array ditentukan (3-8 long-tail, Bahasa Indonesia)
- [ ] SEO potential score dihitung (volume + difficulty + SERP gap)
- [ ] SERP gap check done (top 3 Google results diperiksa)
- [ ] Gap analysis done (TAM existing + 3 competitor checked)
- [ ] Angle test passed (2 pertanyaan + POV selected)
- [ ] Data availability check passed (min 2 data sources per ide)
- [ ] TAM voice check passed
- [ ] Scoring rubrik digunakan untuk semua 5 faktor (Trend, Gap, SEO, Uniqueness, Evergreen)
- [ ] Prioritisasi skor >= 3.5
- [ ] Calendar mapped sesuai alokasi pillar
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] `seo_keywords` array siap untuk pass ke `posts.seo_keywords` di Step 4 execution
- [ ] Min 1 insight unik yang tidak ada di 3 artikel pertama Google
- [ ] Output disimpan ke `files/ideation-backlog.md` (gunakan template format)
- [ ] Ide prioritas di-handoff ke `/post-article-execution`
