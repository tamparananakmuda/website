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

## Setelah humanizer

1. Set `human_signature: true` di article JSON per part
2. **WAJIB re-run `/seri-08-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.

## Checklist

- [ ] No em dash, no en dash, no curly quotes (semua part)
- [ ] No AI vocab EN/ID (semua part)
- [ ] Tone konsisten di seluruh seri
- [ ] Human signature per part
- [ ] `human_signature: true` di JSON per part
- [ ] Re-run `/seri-08-qc` dan hasil CLEAN

## Next

Lanjut ke `/seri-10-schedule`
