---
description: Seri step 06 - Review kesinambungan antar episode
---

# 06-review

Review kesinambungan antar episode.

## Prev

Dari `/seri-05-draft`

## Review Editorial

- Apakah alur antar part logis dan mengalir?
- Apakah tidak ada repetisi berlebihan antar part?
- Apakah setiap part bisa berdiri sendiri?
- Apakah tone konsisten di seluruh seri?

## Cross-Part Consistency Checklist (seri-specific)

| Cek | Pertanyaan | Pass/Fail |
|-----|------------|-----------|
| Argumen konsisten | Apakah part 3 tidak kontradiksi dengan part 1? | |
| Terminologi | Apakah istilah yang dipakai di part 1 sama dengan part 3? | |
| Tone | Apakah voice di part 1 sama dengan part N? | |
| Data overlap | Apakah data yang sama di part 1 dan part 3 tidak bertentangan? | |
| Recap akurasi | Apakah recap di awal part 2 akurat mewakili part 1? | |
| Teaser akurasi | Apakah teaser di akhir part 1 sesuai dengan konten part 2? | |
| Series arc | Apakah alur seri secara keseluruhan masuk akal? | |

## Validasi Fakta

- Setiap angka punya sumber yang bisa ditrace
- Data tidak outdated (max 2 tahun untuk data ekonomi)

### Command fact-check: cek angka tanpa atribusi

```bash
# Cek kalimat yang punya angka tapi tidak punya sumber
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const sentences = body.split(/[.!?]\s+/);
const numberSentences = sentences.filter(s => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)/i.test(s));
const withoutSource = numberSentences.filter(s => {
  const lower = s.toLowerCase();
  return !lower.includes('bps') && !lower.includes('survei') && !lower.includes('data') &&
         !lower.includes('laporan') && !lower.includes('studi') && !lower.includes('riset') &&
         !lower.includes('menurut') && !lower.includes('berdasarkan') &&
         !a.source_references?.some(r => s.includes(r.label));
});
if (withoutSource.length) {
  console.log('ANGKA TANPA ATRIBUSI:');
  withoutSource.forEach(s => console.log('  - ' + s.trim().substring(0, 100)));
} else {
  console.log('Semua angka punya atribusi sumber.');
}
"
```

### Command cek dead links

```bash
# Extract semua URL dari body
grep -oP 'https?://[^\s)]+' /tmp/tam-article.json | while read url; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 "$url")
  if [ "$status" != "200" ]; then echo "DEAD ($status): $url"; fi
done
```

## Red Flags List

Tolak artikel jika ada salah satu dari ini:

| Red flag | Contoh | Solusi |
|----------|--------|--------|
| Angka tanpa sumber | "74% gen Z stres" tanpa link/sumber | Tambah sumber atau hapus angka |
| Klaim absolut | "Semua orang kaya itu korup" | Ganti dengan "banyak" atau "sebagian" |
| Generalisasi berlebih | "Gen Z malas semua" | Spesifikkan: "sebagian gen Z" |
| Data outdated (> 2 tahun ekonomi) | Data BPS 2019 untuk kondisi 2026 | Cari data terbaru |
| Kontradiksi antar part | Part 1 bilang A, part 3 bilang tidak A | Fix salah satu |
| Opini sebagai fakta | "Investasi saham pasti untung" | Tambah "menurut saya" atau hapus |
| Clickbait tidak ditepati | Title janji A, body bahas B | Fix title atau fix body |

## Borderline Claims Guidance

| Tipe klaim | Boleh? | Syarat |
|------------|--------|--------|
| Opini personal (saya/gue) | Ya | Pakai first person, jelas ini opini |
| Observasi tidak formal | Ya | Sebutkan ini observasi pribadi |
| Generalisasi budaya | Ya | Pakai "cenderung", "banyak", bukan "semua" |
| Klaim kausalitas | Ya | Pakai "berkorelasi", bukan "menyebabkan" (kecuali ada studi) |
| Prediksi | Ya | Sebutkan ini prediksi/proyeksi, bukan fakta |

## Cek Logika

- Argumen konsisten antar part
- Tidak ada kontradiksi antar part
- Alur seri: setiap part membangun dari part sebelumnya

## Content Quality Score

Rate setiap part 0-100:

| Kriteria | Bobot |
|----------|-------|
| Akurasi fakta | 25 |
| Konsistensi antar part | 20 |
| Kedalaman analisis | 20 |
| Tone TAM (jujur, tajam, tidak menggurui) | 15 |
| Human signature | 10 |
| SEO metadata lengkap | 10 |

Target: **> 80 per part**. Jika < 70, revisi sebelum lanjut.

## Checklist

- [ ] Kesinambungan antar part dicek
- [ ] Cross-part consistency checklist: semua Pass
- [ ] Tidak ada repetisi berlebihan
- [ ] Setiap part bisa berdiri sendiri
- [ ] Tone konsisten di seluruh seri
- [ ] Command fact-check: no angka tanpa atribusi
- [ ] Command dead links: no dead links
- [ ] Red flags: tidak ada
- [ ] Semua klaim terverifikasi
- [ ] Content Quality Score > 80 per part

## Next

Lanjut ke `/seri-07-build`
