---
description: Whitepaper step 10 - Membuat bahasa lebih natural tanpa mengurangi kredibilitas
---

# 10-humanizer

Membuat bahasa lebih natural tanpa mengurangi kredibilitas.

## Prev

Dari `/whitepaper-09-qc`

## Humanizer rules lengkap

Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

## Yang diperbaiki di step ini

- Flow kalimat: perbaiki transisi yang terlalu formal/robotik
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative parallelisms
- Tambahkan contoh konkret: ganti klaim abstrak dengan contoh spesifik
- Natural tone: ganti kata formal AI dengan kata natural
- **Tetap menjaga kredibilitas:** whitepaper boleh lebih formal dari artikel, tapi tidak boleh terdengar seperti AI
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

## Tabel Pengganti Kata AI

Lihat tabel lengkap di `/artikel-08-humanizer` (tabel pengganti kata AI ID dan EN).

## Setelah humanizer

1. Set `human_signature: true` di article JSON
2. **WAJIB re-run `/whitepaper-09-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.

## Checklist

- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID
- [ ] No staccato drama, rule-of-three abuse, negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini
- [ ] Bahasa natural tapi tetap kredibel
- [ ] Re-run `/whitepaper-09-qc` dan hasil CLEAN

## Next

Lanjut ke `/whitepaper-11-publish`
