---
description: Artikel step 05 - Review editorial, validasi fakta, dan cek logika
---

# 05-review

Review editorial, validasi fakta, dan cek logika.

## Prev

Dari `/artikel-04-draft`

## Review Editorial

- Apakah argumen utama jelas dan didukung data?
- Apakah struktur logis? (hook → context → data → insight → conclusion)
- Apakah tone konsisten dengan TAM voice?
- Apakah ada bagian yang terlalu panjang/dragging? (trim jika 1 section > 500 kata)
- Apakah ada bagian yang terlalu tipis? (expand jika 1 section < 100 kata)

## Validasi Fakta

- Setiap angka punya sumber yang bisa ditrace (URL aktif di sourceReferences)
- Angka di artikel cocok dengan sumber (tidak dibulat-bulat)
- Tidak ada angka tanpa atribusi sumber di kalimat yang sama
- Data tidak outdated (max 2 tahun untuk data ekonomi)

## Command fact-check verification

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const refs = a.source_references || [];
const issues = [];

// Cek angka tanpa atribusi
const sentences = body.split(/[.!?]\s+/);
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Katadata|Snapcart|Populix)/i.test(s));
if (unattributed.length > 0) {
  issues.push('Angka tanpa atribusi sumber: ' + unattributed.length + ' kalimat');
  unattributed.forEach((s, i) => console.log('  [' + (i+1) + '] ' + s.trim().substring(0, 100) + '...'));
}

// Cek source references format
if (!Array.isArray(refs)) {
  issues.push('source_references: harus array');
} else {
  refs.forEach((r, i) => {
    if (!r.url) issues.push('source[' + i + ']: url kosong');
    if (!r.label) issues.push('source[' + i + ']: label kosong');
  });
}

// Cek dead links
(async () => {
  for (const ref of refs) {
    if (!ref.url) continue;
    try {
      const res = await fetch(ref.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      if (res.status >= 400) issues.push('Dead link: ' + ref.url + ' [' + res.status + ']');
    } catch (e) {
      try {
        const res = await fetch(ref.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
        if (res.status >= 400) issues.push('Dead link: ' + ref.url + ' [' + res.status + ']');
      } catch (e2) {
        issues.push('Dead link: ' + ref.url + ' [ERR]');
      }
    }
  }
  console.log('=== FACT-CHECK ===');
  console.log('Sources:', refs.length, '| Number sentences:', numberSentences.length, '| Unattributed:', unattributed.length);
  if (issues.length) {
    console.log('\nFAIL (' + issues.length + '):');
    issues.forEach(i => console.log('  - ' + i));
    process.exit(1);
  } else {
    console.log('\nCLEAN: All fact-checks passed.');
  }
})();
"
```

## Red Flags List

Tanda-tanda artikel perlu revisi sebelum lanjut ke build:

| Red flag | Contoh | Action |
|----------|--------|--------|
| Angka tanpa sumber | "74% gen Z stres" tanpa link | Tambah sumber atau hapus angka |
| Generalisasi berlebihan | "Semua gen Z malas" | Ganti dengan "banyak gen Z" + data |
| Klaim absolut | "Ini satu-satunya cara" | Soften: "Salah satu cara paling efektif" |
| Data dibulat-bulat | Sumber bilang 73.2%, artikel bilang 70% | Pakai angka exact atau "sekitar 73%" |
| Opinion sebagai fakta | "Freelance lebih baik dari full-time" | Tambah "menurut saya" atau "berdasarkan pengalaman" |
| Sumber tidak kredibel | Blog personal tanpa data | Ganti dengan sumber primer |
| Kontradiksi internal | Section 1 bilang A, section 3 bilang tidak A | Fix kontradiksi |

## Borderline Claims: Opini vs Fakta

| Tipe claim | Cara handle | Contoh |
|------------|-------------|--------|
| Fakta terverifikasi | Pakai langsung + sumber | "BPS 2025: 74% lulusan menganggur" |
| Fakta dari sumber sekunder | Tambah atribusi | "Menurut laporan Katadata, ..." |
| Opini personal | Label eksplisit | "Menurut saya, ..." |
| Observasi personal | Label eksplisit | "Dari pengamatan saya, ..." |
| Generalisasi dari sample kecil | Tambah disclaimer | "Berdasarkan pengalaman saya dan beberapa teman, ..." |
| Prediksi | Label sebagai prediksi | "Bisa jadi dalam 5 tahun, ..." |

## Cek Logika

- Tidak ada kontradiksi internal
- Setiap klaim didukung argumen atau data
- Conclusion mengikuti dari premise
- Tidak ada logical fallacy (straw man, false dichotomy, appeal to emotion)

## Content Quality Score (0-100, target > 80)

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

## Checklist

- [ ] Review editorial selesai
- [ ] Command fact-check: CLEAN (semua angka ada sumber, semua URL aktif)
- [ ] Tidak ada angka tanpa atribusi sumber
- [ ] Tidak ada red flags (cek tabel di atas)
- [ ] Borderline claims sudah dilabel (opini/observasi/prediksi)
- [ ] Logika argumen konsisten (tidak ada kontradiksi internal)
- [ ] Content Quality Score > 80

## Next

Lanjut ke `/artikel-06-build`
