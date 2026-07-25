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
- [ ] Template output strategy diisi
- [ ] Rilis strategy ditentukan

## Next

Lanjut ke `/seri-03-research`
