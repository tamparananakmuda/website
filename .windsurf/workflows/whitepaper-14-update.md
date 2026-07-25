---
description: Whitepaper step 14 - Revisi jika ada data atau temuan baru
---

# 14-update

Revisi jika ada data atau temuan baru.

## Prev

Dari `/whitepaper-13-monitor`

## Monthly

- Cek apakah data di whitepaper masih relevan
- Update jika ada survei/studi baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

## Quarterly

- Review whitepaper secara keseluruhan
- Identifikasi whitepaper untuk update vs archive
- Plan whitepaper baru berdasarkan performa

## Command cek internal links aktif

```bash
# Cek semua internal link di whitepaper
npx tsx -e "
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const matter = require('gray-matter');
const filePath = join(process.cwd(), 'content', 'whitepaper', 'SLUG.md');
if (!existsSync(filePath)) { console.error('NOT FOUND'); process.exit(1); }
const { content } = matter(readFileSync(filePath, 'utf8'));
const links = [...content.matchAll(/\]\(\/(artikel|whitepaper)\/([^)]+)\)/g)].map(m => m[2]);
links.forEach(slug => {
  const articlePath = join(process.cwd(), 'content', 'articles');
  const seriPath = join(process.cwd(), 'content', 'seri');
  const wpPath = join(process.cwd(), 'content', 'whitepaper', slug + '.md');
  const found = existsSync(wpPath) || require('child_process').execSync('find ' + articlePath + ' ' + seriPath + ' -name ' + slug + '.md 2>/dev/null').toString().trim();
  console.log((found ? 'OK' : 'BROKEN') + ': ' + slug);
});
"
```

## Update Process Step-by-Step

1. Update body di `$ARTICLE_JSON`
2. Jalankan ulang `/whitepaper-09-qc` untuk verifikasi
3. Jalankan ulang `/whitepaper-10-humanizer` untuk verifikasi
4. Update file Markdown:
   ```bash
   npx tsx -e "
   const fs = require('fs'); const path = require('path');
   const matter = require('gray-matter');
   const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
   const filePath = path.join(process.cwd(), 'content', 'whitepaper', wp.slug + '.md');
   if (!fs.existsSync(filePath)) { console.error('FATAL: file not found'); process.exit(1); }
   const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
   data.title = wp.title;
   data.subtitle = wp.subtitle || null;
   data.summary = wp.summary || null;
   data.tags = wp.tags || [];
   data.readingTime = wp.reading_time || 10;
   const fileContent = matter.stringify(wp.body, data);
   fs.writeFileSync(filePath, fileContent, 'utf8');
   console.log('Whitepaper updated:', wp.slug);
   "
   ```
5. Regenerate OG image jika title berubah
6. Submit ulang URL ke Google Search Console

## Kapan Update vs Tulis Baru

| Kondisi | Action |
|---------|--------|
| Data outdated, angle masih relevan | Update whitepaper |
| Ranking turun, konten masih bagus | Update SEO + tambah konten baru |
| Topik butuh refresh total | Tulis whitepaper baru |
| Ada data baru yang signifikan | Update + tulis artikel baru jika insight berbeda |
| Whitepaper tidak relevan lagi | Archive (set status draft) atau hapus |

## Rollback (jika perlu hapus whitepaper)

```bash
rm content/whitepaper/SLUG.md
```

## Checklist

- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Whitepaper review dilakukan (quarterly)

## Next

Kembali ke `/whitepaper-01-idea` untuk whitepaper baru, atau `/content-ideation` untuk ide baru
