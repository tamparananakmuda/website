---
description: Whitepaper step 06 - Review oleh editor dan SME
---

# 06-review

Review oleh editor (dan Subject Matter Expert jika perlu).

## Prev

Dari `/whitepaper-05-draft`

## Review Editorial

- Apakah thesis statement jelas dan didukung data?
- Apakah struktur logis? (Executive Summary, Background, Analysis, Recommendation, Conclusion, Limitations)
- Apakah tone konsisten dengan TAM voice?
- Apakah setiap supporting argument punya data source?
- Apakah counter-argument dibantah dengan data, bukan opini?
- Apakah rekomendasi actionable dan specific?
- Apakah conclusion tidak generic?

## 5-Pass Review Process (TeamBench Standards)

Review whitepaper harus melalui 5 pass terpisah, bukan satu bacaan:

| Pass | Fokus | Reviewer | Output |
|------|-------|----------|--------|
| **1. Structural** | Outline logic, section order, Pyramid Principle, MECE arguments | Editor | Structural revision notes |
| **2. Accuracy** | Data verification, source tracing, claim-evidence proportion, Bayesian audit | Editor + SME | Fact-check report |
| **3. Readability** | Cognitive load, plain language, sentence length, jargon definition, layered reading | Editor | Readability revision notes |
| **4. Brand/Tone** | TAM voice, human signature, no AI patterns, no em dash, hedging language | Editor | Tone revision notes |
| **5. Copy edit** | Grammar, punctuation, formatting, internal links, schema, frontmatter | Editor | Final clean copy |

Setiap pass terpisah. Jangan gabung. Editor yang berbeda untuk pass 2 vs pass 4 jika memungkinkan.

## Bayesian Audit (6-step claim verification)

Untuk setiap key claim di whitepaper, jalankan Bayesian audit:

| Step | Pertanyaan | Output |
|------|------------|--------|
| **1. Identify claim** | Apa claim spesifik yang dibuat? | Claim statement |
| **2. Specify priors** | Apa yang kita tahu sebelumnya? Prior belief strength? | Prior assessment |
| **3. Translate evidence** | Seberapa kuat evidence mendukung/menentang? Bayes factor? | Evidence strength |
| **4. Update to posterior** | Setelah evidence, seberapa yakin kita? | Posterior assessment |
| **5. Sensitivity** | Apakah conclusion berubah jika prior berbeda? | Robustness check |
| **6. Synthesize** | Apakah claim dalam whitepaper proportionate ke posterior? | Verdict: proportionate / over-claim / under-claim |

Jika verdict = over-claim, tambah hedging language atau tambah evidence. Jika under-claim, perkuat claim jika evidence mendukung.

## E-E-A-T Verification

| Signal | Check | Status |
|--------|-------|--------|
| **Author byline** | Named author dengan verifiable credentials? | |
| **First-person markers** | Minimal 1 paragraf pengalaman/observasi spesifik? | |
| **Primary sources** | >70% source level A+ atau A? | |
| **Expert quotes** | Minimal 2 expert quote dengan attribution? | |
| **Visible dates** | publishedAt di frontmatter? | |
| **Methodology section** | Ada jika original research? | |
| **Limitations section** | Ada dan explicit? | |
| **Correction transparency** | Update history jika ada revisi? | |

## Framework Verification Checks

### Pyramid Principle Structure Check
- [ ] Governing thought = paragraf pertama Executive Summary?
- [ ] 3-5 supporting arguments MECE (no overlap, no gaps)?
- [ ] SCQA pembuka ada di Executive Summary?
- [ ] Setiap section mulai dengan conclusion, lalu evidence?

### Toulmin Argument Completeness Check
Untuk setiap supporting argument:
- [ ] Claim: section heading = claim yang jelas?
- [ ] Ground: evidence dari 02-research ada?
- [ ] Warrant: logic bridge explicit?
- [ ] Backing: authority/source credible?
- [ ] Qualifier: hedging language proportionate?
- [ ] Rebuttal: counter-argument diakui?

### Cognitive Load Validation
- [ ] 1 idea per paragraph (no stacking)?
- [ ] Short sentences untuk key claims (max 25 kata)?
- [ ] Bold key findings untuk skim reader?
- [ ] Section breaks setiap 300-500 kata?
- [ ] Progressive disclosure (simple dulu, detail kemudian)?
- [ ] Max 5-7 data components per chart?

### Citable Passage Verification
- [ ] Minimal 1 self-contained extractable claim per section?
- [ ] Data dalam narasi (bukan hanya di tabel/chart)?
- [ ] Statistical formatting: "74% (BPS, 2025)"?
- [ ] No vague references ("seperti disebutkan di atas")?

### Information Foraging Audit
- [ ] Conclusion-first headings (bukan generic)?
- [ ] Bolded key findings sebagai scent markers?
- [ ] Pull quotes (1 per 500 kata)?
- [ ] Key insight setiap 200-300 kata (reward frequency)?

### Hedging Language Audit
- [ ] Strong evidence pakai "menunjukkan"?
- [ ] Moderate evidence pakai "mengindikasikan"?
- [ ] Weak evidence pakai "kemungkinan"?
- [ ] Tidak ada over-claiming untuk effect kecil?

### Limitations Section Verification
- [ ] Data gaps diakui?
- [ ] Methodological limitations explicit?
- [ ] Generalizability constraints stated?
- [ ] Confounders acknowledged?

## Whitepaper Failure Mode Check

Cek 6 alasan utama whitepaper gagal (That White Paper Guy):

| Failure mode | Check | TAM mitigation |
|--------------|-------|----------------|
| **Internal conflict unresolved** | Apakah ada argumen yang kontradiksi dengan argumen lain? | Resolve atau acknowledge |
| **No story/research** | Apakah ada narrative arc + data yang cukup? | Min 5 primary sources |
| **Process breakdown during reviews** | Apakah 5-pass review dilakukan? | This checklist |
| **Messaging unclear/evolving** | Apakah thesis stable sejak 03-strategy? | Jika berubah, update 01-03 |
| **Too generic topic** | Apakah angle test lolos? | Angle test dari 01-idea |
| **Sales pitch disguised** | Apakah ada promotional language? | 90% educational, 10% soft positioning |

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

## Section Hook/Foreshadow/Bridge Formula Validation

Validasi bahwa formula yang dipilih di step 03-strategy terimplementasi dengan benar:

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Executive Hook implemented** | Apakah title dan Executive Summary opening sesuai Executive Hook formula dari step 01? | Formula terimplementasi, bukan generic hook |
| **Section Hook implemented** | Apakah opening setiap section sesuai Section Hook formula yang dipilih di step 03? | Formula terimplementasi per section, bukan generic hook |
| **Section Foreshadow implemented** | Apakah closing setiap section sesuai Foreshadow formula yang dipilih? | Formula terimplementasi, tease tidak spoiler penuh |
| **Bridge formula implemented** | Apakah transition antar section sesuai Bridge formula yang dipilih? | Bridge terimplementasi, connect antar section |
| **Foreshadow payoff** | Apakah foreshadow di section N di-bayar di section N+1? | Payoff ada, tidak menggantung |
| **Thumbnail text (og_headline)** | Berbeda dari title? Max 50 char? Function sebagai visual hook? | Ya, semua kriteria terpenuhi |
| **Thumbnail caption (excerpt)** | Max 160 char? Function sebagai visual foreshadow? | Ya, tease tidak spoiler |
| **Meta description** | Max 160 char? Mengandung Hook + Foreshadow element? | Ya, Hook + Value + Foreshadow |

Jika Section Hook, Foreshadow, atau Bridge tidak terimplementasi: kembali ke 05-draft untuk fix.

## Checklist

- [ ] 5-pass review selesai (structural, accuracy, readability, brand/tone, copy edit)
- [ ] Executive Hook formula implemented sesuai pilihan di step 01 (nomor + nama)
- [ ] Section Hook formula implemented per section sesuai pilihan di step 03 (nomor + nama)
- [ ] Section Foreshadow formula implemented per section sesuai pilihan di step 03 (nomor + nama)
- [ ] Bridge formula implemented antar section sesuai pilihan di step 03 (dari 5 Bridge formula)
- [ ] Thumbnail text (og_headline): berbeda dari title, max 50 char, visual hook
- [ ] Title masih punchy berdasar 20 prinsip riset (cek: no formal words, no fear words, no superlatives, no "kita/kami", ada active verb, max 10 kata, ada kontras/surprise, no "Krisis X Indonesia:" default, no "X: Sistem yang Y" default)
- [ ] Thumbnail caption (excerpt): max 160 char, visual foreshadow
- [ ] Meta description: max 160 char, mengandung Hook + Foreshadow element
- [ ] Bayesian audit: semua key claim proportionate to evidence
- [ ] E-E-A-T verification: all 8 signals checked
- [ ] Pyramid Principle structure check: governing thought, MECE, SCQA
- [ ] Toulmin argument completeness: 6 komponen per supporting argument
- [ ] Cognitive load validation: 1 idea per paragraph, short sentences, progressive disclosure
- [ ] Citable passage verification: self-contained claim per section
- [ ] Information foraging audit: conclusion-first headings, scent markers, reward frequency
- [ ] Hedging language audit: proportionate to evidence strength
- [ ] Limitations section verification: data gaps, methodological, generalizability, confounders
- [ ] Whitepaper failure mode check: 0 red flags
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
