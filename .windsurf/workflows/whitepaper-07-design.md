---
description: Whitepaper step 07 - Layout PDF, grafik, tabel, dan ilustrasi
---

# 07-design

Layout PDF, grafik, tabel, dan ilustrasi.

## Prev

Dari `/whitepaper-06-review`

## Brand Colors Reference

| Element | Value |
|---------|-------|
| Background | OLED Black `#0A0A0A` |
| Text primary | `#FFFFFF` |
| Text secondary | `#A1A1AA` (slate grey) |
| Accent (TAM red) | `#E63946` |
| Category colors | Mindset, Karier, Uang, Bisnis, Kehidupan, Teknologi (lihat `content/config.ts`) |
| Font display | Syne Bold 700 |
| Font body | Jakarta Sans |
| Font mono | JetBrains Mono |

## Chart Types Reference

| Data type | Chart type | Kapan dipakai | Contoh |
|-----------|-----------|---------------|--------|
| Trend temporal | Line chart | Data dari waktu ke waktu | Pengangguran 2020-2025 |
| Perbandingan kategori | Bar chart (horizontal) | Bandingkan 3+ kategori | Freelance vs tetap vs kontrak |
| Proporsi | Pie/donut chart (max 5 slice) | Komposisi total | Sebaran jenis pekerjaan |
| Korelasi | Scatter plot | Hubungan 2 variabel | Jam kerja vs kepuasan |
| Ranking | Horizontal bar | Urutan dari tertinggi | Top 10 sektor pengangguran |
| Before/after | Grouped bar | Perbandingan 2 periode | 2020 vs 2025 |
| Distribution | Histogram | Sebaran data | Distribusi gaji freelancer |

Aturan:
- Gunakan category color untuk accent
- Background chart: transparan atau `#1A1A1A`
- Label axis: Jakarta Sans, `#A1A1AA`
- Source citation di bawah chart: kecil, `#71717A`

## Cover Page Template (jika PDF download)

```
+------------------------------------------+
|                                          |
|  [Brand Mark: 2 garis merah vertikal]   |
|  TAMPARAN ANAK MUDA                      |
|                                          |
|                                          |
|  [Title: Syne Bold 700, besar]           |
|  [Subtitle: Jakarta Sans, slate grey]    |
|                                          |
|                                          |
|  [Author: TAMPARAN ANAK MUDA]            |
|  [Tanggal: Bulan Tahun]                  |
|                                          |
|  ----- (garis tipis accent) -----        |
|                                          |
|  [Tagline: "Menyadarkan generasi muda    |
|   akan kenyataan"]                       |
|                                          |
+------------------------------------------+
  Footer: tamparananakmuda.com
```

## Infographic Summary (1-page visual untuk social)

Buat 1-page infographic summary untuk distribusi social media:

- **Header:** Title + brand mark
- **3-4 key data points:** Angka besar + 1 kalimat konteks
- **1 key recommendation:** Actionable, 1 kalimat
- **Footer:** Link ke full whitepaper + tamparananakmuda.com
- **Format:** 1080x1920 (IG story) atau 1200x630 (OG image)

## Image Upload ke R2 CDN

Jika ada gambar/chart yang perlu di-host:

```bash
# Upload ke R2 via script
npx tsx -e "
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load env
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
});

const filePath = 'LOCAL_FILE_PATH';
const fileName = 'whitepaper/SLUG/chart-name.png';
const body = fs.readFileSync(filePath);

s3.send(new PutObjectCommand({
  Bucket: process.env.R2_BUCKET_NAME,
  Key: fileName,
  Body: body,
  ContentType: 'image/png',
})).then(() => {
  console.log('Uploaded:', process.env.CDN_BASE_URL + '/' + fileName);
}).catch(e => console.error('FATAL:', e.message));
"
```

Setelah upload, set `coverImageUrl` di `$ARTICLE_JSON`:
```json
{
  "cover_image_url": "https://cdn.tamparananakmuda.com/whitepaper/SLUG/cover.png"
}
```

## Data Visualization Best Practices

- **Label always:** Setiap chart harus punya title, axis label, dan source
- **Color contrast:** Pastikan text readable di OLED black background
- **No 3D charts:** Gunakan flat 2D charts saja
- **Max 5 slices:** Pie chart max 5 slice, sisanya jadi "Others"
- **Sort by value:** Bar chart urutkan dari terbesar ke terkecil
- **Start axis at 0:** Y-axis bar chart mulai dari 0 (tidak misleading)
- **Source citation:** Setiap chart harus cite sumber data di bawah
- **Alt text:** Untuk web, setiap gambar harus punya alt text deskriptif

## PDF Layout (jika akan di-download)

- Cover page dengan title + subtitle + brand mark
- Table of contents
- Section breaks dengan heading yang jelas
- Page numbers
- Footer: `tamparananakmuda.com`

## Checklist

- [ ] Brand colors reference dipakai untuk semua visual
- [ ] Chart types sesuai dengan data type
- [ ] Cover page dibuat (jika PDF download)
- [ ] Infographic summary dibuat (1-page untuk social)
- [ ] Image upload ke R2 CDN (jika ada gambar)
- [ ] `coverImageUrl` di-set di `$ARTICLE_JSON` (jika ada cover)
- [ ] Data viz best practices applied
- [ ] Layout PDF final (jika ada downloadUrl)
- [ ] Visual konsisten dengan brand TAM

## Next

Lanjut ke `/whitepaper-08-build`
