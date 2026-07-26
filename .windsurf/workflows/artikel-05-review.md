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

## Multi-Pass Review Protocol

Review artikel dalam 4 pass terpisah, masing-masing fokus pada 1 aspek:

| Pass | Fokus | Pertanyaan utama | Output |
|------|-------|------------------|--------|
| **P1: Structure** | Alur, heading, section balance | Apakah reader bisa skim dan dapat value? | Structural issues list |
| **P2: Evidence** | Data, source, attribution | Apakah setiap claim punya evidence yang traceable? | Evidence gap list |
| **P3: Tone** | TAM voice, human signature, AI pattern | Apakah ini terdengar seperti TAM atau AI? | Tone issues list |
| **P4: Reader** | Pain point, takeaway, actionability | Setelah baca, apa yang reader dapat? | Reader value assessment |

Jangan gabungkan pass. Fokus 1 aspek per pass untuk maximum detection.

## Bayesian Claim Audit

Setiap claim di artikel dinilai berdasarkan kekuatan evidence:

| Claim type | Evidence required | Check |
|------------|-------------------|-------|
| **Strong claim** ("X menyebabkan Y") | Data primer +因果 evidence | Apakah ada confounder yang tidak di-address? |
| **Moderate claim** ("X berkorelasi dengan Y") | Data + korelasi | Apakah sudah dinyatakan sebagai korelasi, bukan causation? |
| **Weak claim** ("X cenderung Y") | Observasi + data pendukung | Apakah hedging proportionate? |
| **Opini** ("X seharusnya Y") | Logika + pengalaman | Apakah dilabel sebagai opini? |

Aturan TAM: claim strength harus match evidence strength. Tidak boleh strong claim dengan weak evidence.

## E-E-A-T Check (Experience, Expertise, Authoritativeness, Trust)

| Dimension | Check | Pass criteria |
|-----------|-------|---------------|
| **Experience** | Ada pengalaman/observasi personal di artikel? | Min 1 human signature paragraph |
| **Expertise** | Data dari source kredibel (T1/T2)? | Min 1 T1 atau T2 source |
| **Authoritativeness** | Author punya kredibilitas di topik? | Author TAM, bukan ghostwriter generic |
| **Trust** | Source transparent, data traceable? | Semua angka punya source di sourceReferences |

Jika 1 dimension fail: artikel tidak siap publish.

## Structural Review

| Check | Pertanyaan | Jika gagal |
|-------|------------|-----------|
| **Hook power** | Apakah hook membuat reader ingin lanjut? | Ganti hook formula |
| **Section progression** | Apakah setiap section menambah depth? | Hapus atau merge section yang tidak advance |
| **Data section depth** | Apakah Data section punya min 3 data points? | Tambah data atau expand |
| **Insight landing** | Apakah Insight section memberikan TAM angle yang jelas? | Rewrite insight |
| **Conclusion callback** | Apakah conclusion refer kembali ke hook/data? | Tambah callback |
| **Section length balance** | Apakah ada section > 500 kata atau < 100 kata? | Trim atau expand |
| **Paragraph rhythm** | Apakah ada variasi panjang paragraph? | Mix short + long paragraphs |

## Tone Audit

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **TAM voice** | Jujur, tajam, rasional, berani, tidak menggurui? | 5 karakter terpenuhi |
| **No AI pattern** | Tidak ada pola AI (vocab, structure, signposting)? | 0 pola AI |
| **Human signature** | Min 1 paragraf pengalaman/observasi spesifik? | Ya |
| **No generic** | Tidak ada generic conclusion/platitude? | 0 generic |
| **Conversational** | Tidak terlalu formal, tidak terlalu casual? | Balance |
| **Reader address** | Pakai "kamu/kita/saya" secara natural? | Min 3 instance |

## Review Quality Score (0-10)

Score review sebelum lanjut ke 06-build. Target: minimal 7.

| Factor | Weight | 0 (fail) | 1 (ok) | 2 (strong) |
|--------|--------|----------|--------|------------|
| **Fact-check** | 2 | Angka tanpa source | Sebagiane ada source | Semua angka traceable |
| **Logic** | 1 | Kontradiksi internal | Sebagiane konsisten | Fully konsisten |
| **Structure** | 1 | Random flow | OK tapi weak hook | Clear progression + strong hook |
| **Tone** | 2 | AI pattern dominant | Sebagiane TAM | Fully TAM + human signature |
| **E-E-A-T** | 1 | < 2 dimension pass | 3 dimension pass | 4 dimension pass |
| **Bayesian** | 1 | Claim > evidence | Sebagiane match | Semua claim match evidence |
| **Reader value** | 2 | Tidak ada takeaway | Vague takeaway | Specific + actionable takeaway |

Jika score < 7: revisi sebelum lanjut ke 06-build.

## Content Quality Score (0-100, target > 80)

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

## Checklist

- [ ] Review editorial selesai
- [ ] Multi-Pass Review: P1 Structure, P2 Evidence, P3 Tone, P4 Reader selesai
- [ ] Command fact-check: CLEAN (semua angka ada sumber, semua URL aktif)
- [ ] Tidak ada angka tanpa atribusi sumber
- [ ] Tidak ada red flags (cek tabel di atas)
- [ ] Borderline claims sudah dilabel (opini/observasi/prediksi)
- [ ] Logika argumen konsisten (tidak ada kontradiksi internal)
- [ ] Bayesian Claim Audit: semua claim match evidence strength
- [ ] E-E-A-T: 4 dimension pass
- [ ] Structural Review: 7 checks passed
- [ ] Tone Audit: 6 checks passed
- [ ] Content Quality Score > 80
- [ ] Review Quality Score > 7 (dari 10)

## Next

Lanjut ke `/artikel-06-build`
