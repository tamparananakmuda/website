---
description: Seri step 02 - Menentukan alur pembelajaran atau storytelling seri
---

# 02-strategy

Menentukan alur pembelajaran atau storytelling seri.

## Prev

Dari `/seri-01-idea`

## Framework Seri

- Tentukan alur: kronologis, problem-solution, progressive complexity, atau thematic
- Setiap part harus berdiri sendiri sebagai artikel, tapi terhubung ke tema seri
- Tentukan jumlah part dan estimasi word count per part (1.000-2.500 kata per part)

## Prasyarat: Definisikan seri di `content/config.ts`

```typescript
export const series: SeriesConfig[] = [
  { id: 'uuid-generated', title: 'Nama Seri', slug: 'slug-seri', description: 'Deskripsi seri' },
];
```

## Naming convention slug (WAJIB)

```
{series-slug}-part-{n}-{article-slug}
```
Contoh: `detoks-dopamin-part-1-kenapa-kamu-kecanduan`

## Checklist

- [ ] Alur pembelajaran/storytelling ditentukan
- [ ] Jumlah part ditentukan
- [ ] Seri didefinisikan di `content/config.ts`
- [ ] Naming convention slug dipahami

## Next

Lanjut ke `/seri-03-research`
