---
description: Whitepaper step 06 - Review oleh editor dan SME
---

# 06-review

Review oleh editor (dan Subject Matter Expert jika perlu).

## Prev

Dari `/whitepaper-05-draft`

## Review Editorial

- Apakah thesis statement jelas dan didukung data?
- Apakah struktur logis? (Executive Summary, Background, Analysis, Recommendation, Conclusion)
- Apakah tone konsisten dengan TAM voice?
- Apakah setiap supporting argument punya data source?
- Apakah counter-argument dibantah dengan data, bukan opini?
- Apakah rekomendasi actionable dan specific?
- Apakah conclusion tidak generic?

## Validasi Fakta

- Setiap angka punya sumber yang bisa ditrace
- Angka cocok dengan sumber (tidak dibulat-bulat)
- Tidak ada angka tanpa atribusi sumber
- Data tidak outdated

## Command fact-check (angka tanpa atribusi)

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const sentences = body.split(/[.!?]\s+/);
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Kemnaker|BI|Bank Indonesia|World Bank|ILO|OECD)/i.test(s));
if (unattributed.length > 0) {
  console.log('UNATTRIBUTED NUMBERS (' + unattributed.length + '):');
  unattributed.forEach((s, i) => console.log((i+1) + '. ' + s.trim().substring(0, 100) + '...'));
} else {
  console.log('All numbers attributed.');
}
"
```

## Command dead links check

```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const urls = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]);
(async () => {
  let dead = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      if (res.status >= 400) { console.log('DEAD [' + res.status + '] ' + url); dead++; }
    } catch (e) { console.log('DEAD [ERR] ' + url); dead++; }
  }
  console.log(dead === 0 ? 'All links OK.' : dead + ' dead links found.');
})();
"
```

## Methodology Review (whitepaper-specific)

Jika whitepaper punya section Methodology:

- Apakah data type jelas (kuantitatif/kualitatif/mixed)?
- Apakah analysis method sesuai dengan data?
- Apakah scope dan limitations dijelaskan?
- Apakah ada confounding variables yang tidak diakui?
- Apakah interpretasi data tidak overreach (data A tidak otomatis berarti conclusion B)?

## Data Interpretation Review

- Apakah conclusion sesuai dengan data, atau overreach?
- Apakah korelasi tidak di-present sebagai kausalitas?
- Apakah data kontekstual (tidak cherry-picked)?
- Apakah perbandingan apple-to-apple (tidak compare yang tidak comparable)?

## SME Review Checklist (jika perlu)

Jika whitepaper membahas topik teknis/khusus, minta review dari Subject Matter Expert.

Pertanyaan untuk SME:

| Pertanyaan | Yang dicek |
|------------|------------|
| "Apakah data yang dipakai akurat dan terbaru?" | Akurasi data |
| "Apakah interpretasi data valid?" | Interpretasi |
| "Apakah ada variabel yang missed?" | Missing variables |
| "Apakah metodologi analisis sesuai?" | Metodologi |
| "Apakah rekomendasi realistis dan implementable?" | Feasibility |
| "Apakah ada claim yang misleading?" | Misleading claims |
| "Apakah ada konteks yang kurang?" | Missing context |

SME cek akurasi teknis, bukan tone atau style.

## Red Flags (7 tipe, whitepaper versi)

| Red flag | Contoh | Fix |
|----------|--------|-----|
| **Angka tanpa sumber** | "74% lulusan menganggur" (tanpa BPS) | Tambah atribusi |
| **Overreach** | "Data menunjukkan X menyebabkan Y" (padahal cuma korelasi) | Ganti "menyebabkan" jadi "berkorelasi" |
| **Cherry-picking** | Hanya sebut data yang mendukung, abaikan yang bertentangan | Tambah counter-data |
| **Outdated data** | Data 2018 untuk klaim 2025 | Update ke data terbaru |
| **Vague recommendation** | "Tingkatkan literasi keuangan" | Spesifikkan: "Modul literasi di kurikulum SMA" |
| **Opini sebagai fakta** | "Freelance itu eksploitasi" (tanpa data) | Tambah "menurut analisis ini" atau data pendukung |
| **Generic conclusion** | "Masa depan cerah" | Ganti dengan insight spesifik |

## Borderline Claims Guidance

| Tipe claim | Boleh? | Syarat |
|------------|--------|-------|
| **Fakta** | Ya | Punya sumber, angka cocok |
| **Interpretasi data** | Ya | Jelaskan ini interpretasi, bukan fakta |
| **Opini TAM** | Ya | Label sebagai opini/analisis, punya human signature |
| **Proyeksi/prediksi** | Ya | Jelaskan asumsi, bukan present sebagai fakta |
| **Klaim kausalitas** | Hati-hati | Hanya jika ada bukti kausal, bukan cuma korelasi |
| **Generalisasi** | Hati-hati | Scope jelas, tidak generalisasi dari sample kecil |

## Content Quality Score (0-100, target > 80)

| Kriteria | Bobot | Skor 0-10 |
|----------|-------|-----------|
| Thesis clarity dan tajam | 15% | |
| Data sufficiency (min 5 primary) | 15% | |
| Data interpretation (tidak overreach) | 15% | |
| Argument structure (3-5 supporting + counter) | 10% | |
| Recommendation actionable | 10% | |
| Tone TAM (jujur, berani, tidak menggurui) | 10% | |
| Human signature | 5% | |
| Structure (Exec Summary, Background, Analysis, Rec, Conclusion) | 5% | |
| Internal linking (min 3) | 5% | |
| Word count (3.000-10.000) | 5% | |

Total = sum(bobot x skor). Target > 80. Jika < 70, revisi major.

## Checklist

- [ ] Review editorial selesai
- [ ] Command fact-check: no unattributed numbers
- [ ] Command dead links: no dead links
- [ ] Methodology review (jika ada)
- [ ] Data interpretation review: no overreach
- [ ] SME review dilakukan (jika perlu)
- [ ] Red flags: 0 found
- [ ] Borderline claims: semua labeled dengan benar
- [ ] Content Quality Score > 80
- [ ] Logika argumen konsisten

## Next

Lanjut ke `/whitepaper-07-design`
