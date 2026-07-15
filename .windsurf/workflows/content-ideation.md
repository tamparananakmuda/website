---
description: Workflow untuk mencari ide konten artikel TAM per kategori — kombinasi trend scan + gap analysis dengan angle test TAM
---

# Content Ideation Workflow

Workflow untuk menemukan ide artikel TAM di berbagai kategori. Kombinasi trend-based scan + gap analysis, difilter melalui angle test TAM.

## Kategori & Content Pillars TAM

| Kategori DB | Pillar Utama | % Target | Tone |
|---|---|---|---|
| Mindset | Mindset & Realita (20%), Psikologi (5%), Tamparan, Filosofi Hidup | 25-30% | Serius, reflektif, provokatif |
| Karir & Tujuan | Karier & Dunia Kerja (15%), Produktivitas (10%), Pendidikan, Komunikasi | 25-30% | Praktis, to-the-point, sarkas |
| Relasi | Hubungan Sosial, Komunikasi | 10-15% | Empatik, objektif |
| Keuangan | Uang (15%) | 15% | Rasional, data-driven, anti-judi |
| Bisnis | Bisnis (15%), Skill Masa Depan (5%) | 15-20% | Praktis, no-nonsense, anti-hype |
| Teknologi | Teknologi & AI (10%), Analisis Fenomena (5%) | 10-15% | Objektif, praktis, anti-fanboy |
| Identitas | Lifestyle, Sejarah Orang Sukses, Ulasan Buku | 5-10% | Reflektif, personal |

## Step 1: Trend Scan

Scan platform untuk topik yang sedang ramai dibahas anak muda Indonesia.

### 1a. Google Trends
```
1. Buka https://trends.google.com/trends/explore?geo=ID
2. Filter: Last 7 days → Indonesia
3. Cari keyword terkait kategori target:
   - Mindset: "self improvement", "mental health", "motivasi"
   - Karir: "kerja", "fresh graduate", "karir", "CV"
   - Keuangan: "investasi", "pinjaman online", "gaji", "nabung"
   - Bisnis: "bisnis", "startup", "UMKM", "side hustle"
   - Teknologi: "AI", "ChatGPT", "crypto", "gadget"
   - Relasi: "toxic relationship", "pertemanan", "loneliness"
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

### Output Step 1
Daftar raw ideas per kategori:
```
[Kategori] | [Topik] | [Platform source] | [Volume/signal strength] | [Angle yang dibuat] | [Angle yang MISSING]
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
Platform yang di-scan:
- Medium Indonesia (medium.com/tag/indonesia)
- Tirto.id (kolom opini/youth)
- Katadata.co.id (kolom young)
- LinkedIn articles (kreator konten karir/keuangan Indonesia)
- Substack Indonesia (newsletter writers)

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
- `kontra-narasi` — melawan narasi populer dengan dasar kuat
- `refleksi` — pengalaran/observasi personal yang spesifik
- `data` — data + interpretasi yang tidak obvious
- `framework` — kerangka berpikir original

### 3c. TAM Voice Check
- [ ] Jujur — tidak menghindari kebenaran yang tidak nyaman
- [ ] Langsung — tidak bertele-tele
- [ ] Menghormati pembaca — tidak merendahkan, tidak menggurui
- [ ] Tone sesuai kategori (lihat tabel di atas)

### Output Step 3
Validated ideas siap draft:
```
[Kategori] | [Topik] | [POV] | [Angle 1-liner] | [Working title] | [Keyword target]
```

## Step 4: Prioritisasi

Urutkan validated ideas berdasarkan:

| Faktor | Bobot | Skor (1-5) |
|---|---|---|
| Trend signal strength | 30% | _ |
| Gap opportunity | 25% | _ |
| SEO potential (search volume) | 20% | _ |
| TAM uniqueness (angle test) | 15% | _ |
| Evergreen vs newsjacking | 10% | _ |

**Formula:** `(Trend × 0.3) + (Gap × 0.25) + (SEO × 0.2) + (Uniqueness × 0.15) + (Evergreen × 0.1)`

**Threshold:** Hanya ide dengan skor ≥ 3.5 yang masuk content calendar.

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
- Karir & Tujuan: 2-3 artikel
- Keuangan: 1-2 artikel
- Bisnis: 1-2 artikel
- Teknologi: 1 artikel
- Relasi/Identitas: 0-1 artikel (as-needed)
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

## Checklist Final

- [ ] Trend scan completed (min 5 ideas per kategori target)
- [ ] Gap analysis done (TAM existing + 3 competitor checked)
- [ ] Angle test passed (2 pertanyaan + POV selected)
- [ ] TAM voice check passed
- [ ] Prioritisasi skor ≥ 3.5
- [ ] Calendar mapped sesuai alokasi pillar
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Min 1 insight unik yang tidak ada di 3 artikel pertama Google
