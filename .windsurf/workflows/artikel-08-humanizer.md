---
description: Artikel step 08 - Perbaiki flow, hilangkan pola AI, tambahkan contoh, natural tone
---

# 08-humanizer

Perbaiki flow, hilangkan pola AI, tambahkan contoh, natural tone.

## Humanizer rules lengkap

Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

## Yang diperbaiki di step ini

- **Flow kalimat:** perbaiki transisi yang terlalu formal/robotik
- **Hilangkan pola AI:** staccato drama, rule-of-three abuse, negative parallelisms, fragmented headers
- **Tambahkan contoh konkret:** ganti klaim abstrak dengan contoh spesifik
- **Natural tone:** ganti kata formal AI (signifikan, krusial, mendalam) dengan kata natural
- **Human signature:** pastikan minimal 1 paragraf pengalaman/observasi/opini spesifik

## Setelah humanizer

Set `human_signature: true` di article JSON.

## Checklist

- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID
- [ ] No staccato drama, rule-of-three abuse (>2x), negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- [ ] Tone: jujur, rasional, berani, tidak menggurudi
- [ ] `human_signature: true` di JSON

## Next

Lanjut ke `/artikel-09-publish`
