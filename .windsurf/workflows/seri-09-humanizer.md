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
- [ ] Re-run `/seri-08-qc` dan hasil CLEAN

## Next

Lanjut ke `/seri-10-schedule`
