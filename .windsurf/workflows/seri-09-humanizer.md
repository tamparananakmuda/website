---
description: Seri step 09 - Menyamakan tone seluruh seri
---

# 09-humanizer

Menyamakan tone seluruh seri.

## Prev

Dari `/seri-08-qc`

## Humanizer rules lengkap

Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

## Yang diperbaiki di step ini

- **Flow kalimat:** perbaiki transisi yang terlalu formal/robotik
- **Hilangkan pola AI:** staccato drama, rule-of-three abuse, negative parallelisms
- **Tambahkan contoh konkret**
- **Natural tone:** ganti kata formal AI dengan kata natural
- **Konsistensi tone antar part:** pastikan semua part punya voice yang sama
- **Human signature:** minimal 1 paragraf pengalaman/observasi/opini spesifik per part

## Tabel Pengganti Kata AI

Lihat tabel lengkap di `/artikel-08-humanizer` (tabel pengganti kata AI ID dan EN).

## Before/After Examples

### Staccato drama
**Before:** "Kamu kerja. Kamu lelah. Kamu bosan. Kamu quit."
**After:** "Kamu kerja tiap hari, capek, bosan, sampai akhirnya mikir buat resign."

### Rule of three abuse
**Before:** "Kerja keras, disiplin, dan konsisten adalah kunci sukses."
**After:** "Kerja keras dan disiplin masih bisa dibahas. Tapi kalau kata 'kunci sukses' dipakai, terdengar seperti seminar motivasi."

### Negative parallelisms
**Before:** "Bukan hanya tentang uang, melainkan tentang kebebasan."
**After:** "Ini soal kebebasan. Uang cuma alatnya."

### Fragmented headers
**Before:** `## Kerja Keras` lalu kalimat berikutnya "Kerja keras itu penting..."
**After:** `## Mitos Kerja Keras` lalu kalimat berikutnya "Sejak kecil kita dengar..."

## Teknik Human Signature (3 tipe, min 1 per part)

| Tipe | Contoh |
|------|--------|
| **Pengalaman personal** | "Gue dulu kerja 60 jam seminggu, pikir itu produktif. Sampai gue burnout dan nggak bisa bangun dari tempat tidur selama 3 hari." |
| **Observasi spesifik** | "Gue perhatikan temen-temen yang resign 2024-2025 punya pola sama: semua nunggu 'momen yang tepat' yang nggak pernah datang." |
| **Opini tajam** | "Menurut gue, hustle culture itu bukan budaya kerja. Itu budaya eksploitasi yang dikemas jadi motivasi." |

## Command auto-check pola AI

```bash
# Cek pola AI di semua part seri
for slug in SERIES-SLUG-PART-1 SERIES-SLUG-PART-2 SERIES-SLUG-PART-3; do
  echo "=== $slug ==="
  npx tsx -e "
  const fs = require('fs');
  const { join } = require('path');
  const matter = require('gray-matter');
  const { data, content } = matter(fs.readFileSync(join(process.cwd(), 'content/seri/SERIES-SLUG/$slug.md'), 'utf8'));
  const issues = [];
  if (content.includes('\u2014') || content.includes('\u2013')) issues.push('Em/en dash');
  const aiId = ['signifikan','krusial','esensial','vital','mendalam','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','tidak dapat dipungkiri'];
  const found = aiId.filter(w => content.toLowerCase().includes(w));
  if (found.length) issues.push('AI vocab ID: ' + found.join(', '));
  const triples = content.match(/(\w+,\s+\w+,\s+(?:dan)\s+\w+)/g) || [];
  if (triples.length > 2) issues.push('Rule of three: ' + triples.length);
  const neg = content.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan)/gi) || [];
  if (neg.length) issues.push('Negative parallelisms: ' + neg.length);
  const personal = (content.match(/\bkita\b|\bkamu\b|\bsaya\b|\bgue\b|\bguwe\b/gi) || []).length;
  if (personal < 3) issues.push('Human signature weak (need 3+)');
  if (issues.length) { console.log('FAIL:'); issues.forEach(i => console.log('  - ' + i)); }
  else console.log('CLEAN');
  "
done
```

## Tone Consistency Antar Part

Setelah semua part di-humanize, lakukan tone consistency check:

1. Baca part 1 dan part N secara berurutan
2. Cek: apakah voice sama? (formal/informal, gue/saya, kita/kamu)
3. Cek: apakah level emosi sama? (tidak ada part yang tiba-tiba lebih emosional/lebih datar)
4. Cek: apakah format recap/teaser konsisten di semua part?
5. Jika ada inkonsistensi: pilih tone part 1 sebagai benchmark, sesuaikan part lain

## Hook & Foreshadow Formula Preservation Rules

Saat humanizing, WAJIB jaga integritas formula yang sudah diimplementasi:

- **Jangan break Series Hook formula:** Series Hook dari step 01 harus tetap utuh di part 1 opening dan series description. Boleh perbaiki bahasa, tapi pattern tidak boleh berubah.
- **Jangan break Episode Hook formula:** Episode Hook per part boleh di-humanize, tapi formula pattern harus tetap utuh. Contoh: jika Hook formula #7 (Question Hook), jangan ganti jadi data hook.
- **Jangan break Episode Foreshadow formula:** Foreshadow tease per part boleh di-natural-kan, tapi tease element harus tetap ada. Jangan hapus foreshadow karena "terlalu dramatis".
- **Jangan break Next Tease/Bridge formula:** Bridge antar part boleh di-perbaiki flow-nya, tapi connection antar part harus tetap ada. Jangan hapus Next Tease di akhir part.
- **Jangan ubah thumbnail text (og_headline):** og_headline sudah dirancang sebagai visual hook per part. Boleh perbaiki bahasa jika AI pattern terdeteksi, tapi tetap berbeda dari title dan max 50 char.
- **Jangan ubah thumbnail caption (excerpt):** Excerpt sudah dirancang sebagai visual foreshadow per part. Boleh perbaiki flow, tapi tetap max 160 char dan function sebagai tease.
- **Jangan ubah meta description:** Meta description sudah dirancang dengan Hook + Foreshadow element per part. Boleh perbaiki bahasa, tapi struktur Hook + Value + Foreshadow harus tetap.
- **Formula audit setelah humanize:** Setelah humanizer selesai, re-check bahwa semua formula (Series Hook, Episode Hook, Episode Foreshadow, Next Tease/Bridge) masih utuh. Jika formula rusak, fix sebelum re-run QC.

## Setelah humanizer

1. Set `human_signature: true` di article JSON per part
2. **WAJIB re-run `/seri-08-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.

## Checklist

- [ ] No em dash, no en dash, no curly quotes (semua part)
- [ ] No AI vocab EN/ID (semua part)
- [ ] No staccato drama, no rule-of-three abuse, no negative parallelisms (semua part)
- [ ] Tone konsisten di seluruh seri (voice, level emosi, format recap/teaser)
- [ ] Human signature per part (min 1 dari 3 tipe)
- [ ] Command auto-check: CLEAN untuk semua part
- [ ] `human_signature: true` di JSON per part
- [ ] Series Hook formula masih utuh setelah humanizing
- [ ] Episode Hook formula masih utuh per part setelah humanizing
- [ ] Episode Foreshadow formula masih utuh per part setelah humanizing
- [ ] Next Tease/Bridge formula masih utuh antar part setelah humanizing
- [ ] Thumbnail text (og_headline) per part tetap berbeda dari title, max 50 char
- [ ] Thumbnail caption (excerpt) per part tetap max 160 char, function sebagai tease
- [ ] Meta description per part tetap mengandung Hook + Foreshadow element, max 160 char
- [ ] Re-run `/seri-08-qc` dan hasil CLEAN
- [ ] Paragraph Rhythm Audit per part
- [ ] Cross-Part Tone Calibration: all pass
- [ ] Series Humanizer Quality Score: min 9 (dari 12)

## Paragraph Rhythm Audit (per part)

Cek variasi panjang paragraph untuk hindari monoton:

| Check | Pertanyaan | Pass criteria |
|-------|------------|---------------|
| **Short-long variation** | Apakah ada paragraph pendek (1-2 kalimat) di antara paragraph panjang? | Min 2 short paragraph per part |
| **No wall of text** | Apakah tidak ada paragraph > 120 kata berurutan? | Max 1 long paragraph berurutan |
| **Emphasis placement** | Apakah short paragraph dipakai untuk emphasis? | Ya, di insight atau conclusion |
| **Rhythm shift** | Apakah rhythm berubah antar section? | Hook = fast, Data = steady, Insight = mixed |

## Cross-Part Tone Calibration

| Check | Cara | Pass criteria |
|-------|------|---------------|
| **Voice consistency** | Baca part 1 dan part N berurutan | Voice sama, tidak ada shift |
| **Formality level** | Bandingkan gue/saya, kita/kamu ratio | Konsisten di semua part |
| **Emotional register** | Bandingkan level emosi antar part | Sesuai arc plan (tidak flat) |
| **Recap/teaser format** | Bandingkan format recap dan teaser | Konsisten di semua part |
| **Human signature type** | Cek tipe human signature per part | Variasi (tidak semua pengalaman personal) |

## Series Humanizer Quality Score (0-12)

Target: min 9.

| Factor | Weight | 0 | 1 | 2 |
|--------|--------|---|---|---|
| **AI pattern removal** | 2 | > 5 pattern | 1-5 | 0 pattern |
| **Tone consistency** | 2 | Shift antar part | Sebagiane | Fully konsisten |
| **Human signature** | 1 | 0 per part | 1 per part | 2+ per part |
| **Paragraph rhythm** | 1 | Monoton | Sebagiane | Good variation |
| **Recap/teaser format** | 1 | Inkonsisten | Sebagiane | Konsisten |
| **Cross-part calibration** | 2 | > 2 fail | 1-2 fail | All pass |
| **Re-run QC** | 1 | Still FAIL | Sebagiane | CLEAN |
| **Concrete examples** | 1 | Abstrak | Sebagiane | Konkret per part |
| **Transition quality** | 1 | Robotik | Sebagiane | Natural |

Jika score < 9: revisi sebelum lanjut ke schedule.

## Checklist

- [ ] No AI vocab EN/ID per part
- [ ] No staccato drama, rule-of-three abuse, negative parallelisms per part
- [ ] Title seri + title per part tidak mengandung AI tells: no formal words, no positive superlatives, no "kita/kami", no fear words, ada active verb, max 10 kata, still punchy berdasar 20 prinsip riset
- [ ] Human signature: min 1 per part
- [ ] Cross-Part Tone Calibration: 5 checks pass
- [ ] Series Humanizer Quality Score: min 9 (dari 12)
- [ ] Re-run `/seri-08-qc` dan hasil CLEAN per part

## Next

Lanjut ke `/seri-10-schedule`
