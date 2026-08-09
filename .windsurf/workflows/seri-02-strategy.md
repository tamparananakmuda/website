---
description: Seri step 02 - Menentukan alur pembelajaran atau storytelling seri
---

# 02-strategy

Menentukan alur pembelajaran atau storytelling seri.

## Prev

Dari `/seri-01-idea`

## Framework Alur Seri (pilih salah satu)

| Alur | Kapan dipakai | Contoh |
|------|---------------|--------|
| **Kronologis** | Topik punya timeline jelas | Sejarah krisis ekonomi Indonesia: Orde Baru → 1998 → 2008 → 2025 |
| **Problem-solution** | Setiap part bahas 1 masalah + solusi | Gen Z finansial: masalah konsumsi → masalah utang → masalah investasi → masalah mental finansial |
| **Progressive complexity** | Topik butuh pemahaman bertahap | Investasi: konsep dasar → reksadana → saham → crypto → portfolio |
| **Thematic** | Setiap part bahas 1 tema dalam topik besar | Hustle culture: definisi → dampak fisik → dampak mental → alternatif |

## Prasyarat: Definisikan seri di `content/config.ts`

```typescript
export const series: SeriesConfig[] = [
  { id: 'uuid-generated', title: 'Nama Seri', slug: 'slug-seri', description: 'Deskripsi seri' },
];
```

## Command validasi series config

```bash
npx tsx -e "
const { series } = require('./content/config');
const slug = 'SERI-SLUG';
const found = series.find(s => s.slug === slug);
if (found) console.log('OK:', found.slug, '|', found.title, '|', found.description);
else console.log('NOT FOUND: Seri belum didefinisikan di content/config.ts');
"
```

## Naming convention slug (WAJIB)

```
{series-slug}-part-{n}-{article-slug}
```
Contoh: `detoks-dopamin-part-1-kenapa-kamu-kecanduan`

## Part Dependency Map

Tentukan dependency antar part:

| Part | Dependency | Bisa baca standalone? |
|------|------------|----------------------|
| Part 1 | Tidak ada (entry point) | Ya |
| Part 2 | Part 1 (konteks dasar) | Ya (dengan recap singkat) |
| Part 3 | Part 2 (konsep sebelumnya) | Sebagian (butuh recap) |
| Part 4 | Part 3 | Sebagian |

Aturan:
- **Part 1 selalu standalone** (entry point seri, harus hook pembaca)
- **Part 2-N harus bisa berdiri sendiri** dengan recap singkat di awal (1-2 kalimat)
- Setiap part WAJIB punya teaser ke part berikutnya di akhir

## Series Hook & Foreshadow Formula Strategy

Referensi formula yang dipilih di step 01-idea, rinciakan strategi implementasi:

### Series Hook Formula (dari step 01)

- Series Hook formula nomor [X] dipilih di step 01-idea
- Series Hook = hook untuk judul seri secara keseluruhan, bukan per part
- Series Hook harus terlihat di: series title, series description, part 1 opening
- Pastikan Series Hook konsisten dengan alur seri yang dipilih (kronologis/problem-solution/progressive/thematic)

### Series Foreshadow Formula (dari step 01)

- Series Foreshadow formula nomor [Y] dipilih di step 01-idea
- Series Foreshadow = tease untuk seri secara keseluruhan, ditempatkan di series description dan part 1 closing
- Series Foreshadow harus tease engine question tanpa spoiler jawaban

### Episode Hook/Foreshadow Strategy (per part)

- Setiap part akan punya Episode Hook (dipilih di step 04-outline dari 30 Hook formula)
- Setiap part akan punya Episode Foreshadow (dipilih di step 04-outline dari 20 Foreshadow formula)
- Next Tease/Bridge antar part akan dipilih di step 04-outline dari 5 Bridge formula
- Hook progression: Part 1 broad hook, midpoint (Part N/2) twist hook, final part synthesis hook
- Foreshadow progression: setiap part tease part berikutnya, final part tease whitepaper/artikel turunan

### Thumbnail & Meta Strategy (per part)

- Setiap part akan punya thumbnail text (og_headline, max 50 char, berbeda dari part title)
- Setiap part akan punya thumbnail caption (excerpt, max 160 char, visual foreshadow)
- Setiap part akan punya meta description (max 160 char, Hook + Foreshadow element)

## Template Output Strategy

Dokumentasi strategy dalam format ini:

```
Alur seri: [kronologis / problem-solution / progressive complexity / thematic]
Jumlah part: [N part]
Series slug: [slug-seri]
Series title: [judul seri]
Series description: [deskripsi 1-2 kalimat]

Part roadmap:
- Part 1: [judul sementara] - [angle] - [keyword utama]
- Part 2: [judul sementara] - [angle] - [keyword utama]
- Part 3: [judul sementara] - [angle] - [keyword utama]
...

Rilis strategy:
- [1 part/hari] atau [1 part/minggu] atau [all at once]
- Estimasi tanggal rilis part 1: [tanggal]
```

## Checklist

- [ ] Alur pembelajaran/storytelling dipilih (kronologis/problem-solution/progressive/thematic)
- [ ] Jumlah part ditentukan
- [ ] Seri didefinisikan di `content/config.ts`
- [ ] Command validasi config: OK
- [ ] Naming convention slug dipahami
- [ ] Part dependency map dibuat
- [ ] Series Hook formula strategy dirinci (dari step 01, konsisten dengan alur)
- [ ] Series Foreshadow formula strategy dirinci (dari step 01, tease engine question)
- [ ] Episode Hook/Foreshadow strategy per part direncanakan (progression: broad, twist, synthesis)
- [ ] Next Tease/Bridge strategy antar part direncanakan (dari 5 Bridge formula)
- [ ] Thumbnail & meta strategy per part direncanakan (og_headline, excerpt, meta desc)
- [ ] Template output strategy diisi
- [ ] Rilis strategy ditentukan
- [ ] Series Arc Integrity Check: all pass
- [ ] Cross-Part Dependency Audit: all pass
- [ ] Release Strategy Verification: all pass
- [ ] Series Strategy Quality Score: min 9 (dari 12)

## Series Arc Integrity Check

Verifikasi alur seri secara keseluruhan sebelum lanjut ke research:

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Arc completeness** | Apakah alur punya awal, tengah, akhir yang jelas? | Act 1, Act 2 (midpoint), Act 3 terdefinisi |
| **Part balance** | Apakah ada part yang terlalu padat atau terlalu tipis? | Setiap part punya potensi 1.000-2.500 kata |
| **Progression logic** | Apakah part N membutuhkan part N-1 untuk konteks? | Ya, tapi bisa standalone dengan recap |
| **Climax placement** | Apakah klimaks/insight terbesar di tempat yang tepat? | Di Act 3, bukan Act 1 |
| **Engine question** | Apakah 1 pertanyaan drive seluruh seri? | Ya, tidak bisa dijawab dalam 1 part |
| **Emotional arc** | Apakah emosi reader berubah dari part 1 ke part N? | Ada perubahan sesuai goal seri |

Jika > 2 check fail: restructure seri sebelum lanjut.

## Cross-Part Dependency Audit

| Check | Pertanyaan | Action jika fail |
|-------|------------|-----------------|
| **No circular dependency** | Apakah part 3 tidak butuh part 5 untuk dipahami? | Reorder atau hapus forward reference |
| **Recap sufficiency** | Apakah recap 1-2 kalimat cukup untuk standalone? | Expand recap atau tambah konteks |
| **Teaser accuracy** | Apakah teaser part N sesuai dengan konten part N+1? | Fix teaser atau fix part N+1 |
| **No orphan part** | Apakah setiap part punya koneksi ke min 1 part lain? | Tambah internal link atau merge |
| **Entry point clarity** | Apakah part 1 jelas sebagai entry point? | Strengthen hook part 1 |

## Release Strategy Verification

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Cadence** | Apakah ritme rilis konsisten? | 1 part/hari atau 1 part/slot, tidak random |
| **Part 1 first** | Apakah part 1 publish/sebelum part lain? | Part 1 selalu first |
| **Gap tolerance** | Apakah gap antar part tidak terlalu lama? | Max 3 hari antar part |
| **Binge option** | Apakah reader bisa binge read setelah seri selesai? | Semua part published/scheduled |
| **SEO compounding** | Apakah setiap part publish akan boost part lain? | Internal links + cluster effect |

## Series Strategy Quality Score (0-12)

Score strategy sebelum lanjut ke 03-research. Target: minimal 9.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Alur choice** | 2 | Tidak match topik | OK tapi tidak optimal | Match topik perfectly |
| **Part count** | 1 | Terlalu sedikit/banyak | OK | Optimal untuk depth topik |
| **Dependency map** | 1 | Tidak dibuat | Dibuat tapi tidak clear | Clear + no circular |
| **Arc integrity** | 2 | > 2 fail | 1-2 fail | All pass |
| **Release strategy** | 1 | Tidak ada | Ada tapi vague | Clear + consistent |
| **Config registration** | 1 | Tidak terdaftar | Terdaftar tapi slug salah | Terdaftar + validated |
| **Naming convention** | 1 | Tidak diikuti | Sebagiane | Semua part mengikuti |
| **Standalone potential** | 1 | Tidak bisa standalone | Sebagiane | Semua part standalone |
| **SEO compounding** | 1 | Tidak ada strategi | Internal links only | Internal + cluster + sitemap |
| **Binge-read design** | 1 | Tidak ada | Ada tapi lemah | Strong binge-read path |

Jika score < 9: revisi strategy sebelum lanjut ke research.

## Next

Lanjut ke `/seri-03-research`
