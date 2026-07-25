---
description: Workflow eksekusi whitepaper TAM, dari identifikasi masalah sampai update
---

# Whitepaper Execution Workflow

Workflow untuk whitepaper. Disimpan langsung di DB (tabel `whitepapers`) via Drizzle ORM. Tidak ada file Markdown.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Whitepaper disimpan langsung di DB (tabel `whitepapers`). Tidak ada file Markdown, tidak ada frontmatter. Pastikan `DATABASE_URL` di `.env.local`.

---

## 01-idea

Identifikasi masalah utama.

**Untuk ide dari workflow `/content-ideation`:** Langsung lanjut ke 02-research.

**Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis whitepaper ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

**POV Selection (wajib pilih salah satu):**
- `kontra-narasi`, `refleksi`, `data`, `framework`, `tamparan`, `riset`, `opini`, `panduan`, `inspirasi`

**Checklist:**
- [ ] Masalah utama teridentifikasi
- [ ] Target audience jelas (professionals, decision makers, researchers)
- [ ] Search intent dianalisis
- [ ] Goal whitepaper didefinisikan (educate, influence, convert)
- [ ] Angle test lolos
- [ ] POV tag dipilih

---

## 02-research

Mengumpulkan data, jurnal, statistik, dan studi kasus.

**Data Collection:**
- Minimal 5 sumber primer teridentifikasi
- Kumpulkan jurnal, statistik, studi kasus yang relevan
- Cek data tidak outdated (max 2 tahun untuk data ekonomi)
- Pastikan URL sumber aktif

**Source Verification:**
- **Tier 1:** Terverifikasi langsung dari publikasi asli
- **Tier 2:** Kutipan media sekunder, wajib label atribusi
- Hapus: dead link, sample terlalu kecil (n < 5.000), blog post tanpa data primer

**Command cek HTTP status inline links:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const urls = [...body.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map(m => m[1]);
(async () => {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      console.log((res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD') + ' [' + res.status + '] ' + url);
    } catch (e) { console.log('DEAD [ERR] ' + url); }
  }
})();
"
```

**Checklist:**
- [ ] Minimal 5 sumber primer terkumpul
- [ ] Data tidak outdated
- [ ] Semua source URL aktif
- [ ] Tidak ada dead link

---

## 03-strategy

Menentukan argumen utama (thesis).

**Thesis Statement:**
- Rumuskan argumen utama whitepaper dalam 1-2 kalimat
- Pastikan argumen didukung data dari 02-research
- Argumen harus tajam, spesifik, dan kontra-intuitif (sesuai TAM voice)

**Checklist:**
- [ ] Thesis statement dirumuskan
- [ ] Argumen didukung data
- [ ] Argumen spesifik dan tajam

---

## 04-outline

Executive Summary → Background → Analysis → Recommendation → Conclusion.

**Heading Structure (CRITICAL untuk Table of Contents):**
- `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body
- Minimal 5 heading h2 untuk TOC berfungsi (whitepaper lebih panjang)

**Struktur standar:**
1. Executive Summary
2. Background/Konteks
3. Analysis (data + interpretasi)
4. Recommendation
5. Conclusion

**Internal Linking Plan:**
- Minimal 3 link ke artikel atau whitepaper TAM lain
- Format: `[judul](/artikel/slug-artikel)` atau `[judul](/whitepaper/slug-whitepaper)`
- Cek via `files/article-inventory.md`

**Checklist:**
- [ ] Outline lengkap: Executive Summary → Background → Analysis → Recommendation → Conclusion
- [ ] Min 5 h2
- [ ] Internal linking plan: min 3 link
- [ ] FAQ section (jika relevan)

---

## 05-draft

Menulis dokumen lengkap.

**Word Count (STANDAR TAM):**
- Target: 3.000-10.000 kata (15-60 menit baca)
- Di bawah 3.000 kata = terlalu tipis, pertimbangkan jadi artikel (gunakan `/artikel-1-execution`)

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>`
- Gunakan `![alt](url)` untuk gambar

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark
- Tidak pakai ellipsis (...)

**Tone TAM:**
- Jujur, rasional, berani, tidak menggurui
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

**Simpan draft ke `$ARTICLE_JSON`:**
```json
{
  "title": "Judul Whitepaper",
  "slug": "slug-whitepaper-kebab-case",
  "subtitle": "Subtitle whitepaper (opsional)",
  "summary": "Summary untuk SEO dan card display (max 300 karakter)",
  "body": "## Section 1\n\nKonten...\n\n## Section 2\n\nKonten...",
  "author": "TAMPARAN ANAK MUDA",
  "download_url": null,
  "reading_time": 15,
  "tags": ["riset", "gen z", "data"],
  "status": "published",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

**Checklist:**
- [ ] Dokumen lengkap ditulis
- [ ] Word count: 3.000-10.000 kata
- [ ] Heading: h2/h3 only, min 5 h2, tidak ada h1
- [ ] Internal linking: min 3 link ke konten TAM
- [ ] JSON disimpan ke `$ARTICLE_JSON`

---

## 06-review

Review oleh editor (dan Subject Matter Expert jika perlu).

**Review Editorial:**
- Apakah thesis statement jelas dan didukung data?
- Apakah struktur logis? (Executive Summary → Background → Analysis → Recommendation → Conclusion)
- Apakah tone konsisten dengan TAM voice?

**Validasi Fakta:**
- Setiap angka punya sumber yang bisa ditrace
- Angka cocok dengan sumber (tidak dibulat-bulat)
- Tidak ada angka tanpa atribusi sumber
- Data tidak outdated

**SME Review (jika perlu):**
- Jika whitepaper membahas topik teknis/khusus, minta review dari Subject Matter Expert
- SME cek akurasi teknis, bukan tone

**Checklist:**
- [ ] Review editorial selesai
- [ ] Semua klaim terverifikasi
- [ ] Tidak ada angka tanpa atribusi
- [ ] SME review dilakukan (jika perlu)
- [ ] Logika argumen konsisten

---

## 07-design

Layout PDF, grafik, tabel, dan ilustrasi.

**Visual Elements:**
- Grafik/chart untuk data penting (gunakan brand colors)
- Tabel untuk perbandingan data
- Ilustrasi untuk konsep abstrak
- Pastikan visual konsisten dengan brand TAM (OLED black, category colors, Syne font)

**PDF Layout (jika akan di-download):**
- Cover page dengan title + subtitle + brand mark
- Table of contents
- Section breaks dengan heading yang jelas
- Page numbers
- Footer: `tamparananakmuda.com`

**Checklist:**
- [ ] Grafik/chart dibuat untuk data penting
- [ ] Tabel dibuat untuk perbandingan
- [ ] Layout PDF final (jika ada downloadUrl)
- [ ] Visual konsisten dengan brand TAM

---

## 08-build

Finalisasi dokumen dan insert ke DB.

**Pre-Flight DB Check:**
```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  if (r.length > 0) { console.log('FATAL: SLUG ALREADY EXISTS'); process.exit(1); }
  else console.log('SLUG AVAILABLE');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Whitepaper DB fields:**
- `title`, `slug`, `subtitle`, `summary`, `body` (markdown string)
- `coverImageUrl`, `author` (default: 'TAMPARAN ANAK MUDA'), `downloadUrl`
- `readingTime` (integer, default 10), `tags` (text array)
- `status` ('draft' atau 'published'), `publishedAt` (timestamp)
- Tidak ada frontmatter, POV tag, atau SEO fields terpisah

**Insert command (DB via Drizzle ORM):**
```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema');
const wp = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

if (!wp.slug || !wp.title || !wp.body) { console.error('FATAL: slug, title, body required'); process.exit(1); }
if (!wp.published_at) { console.error('FATAL: published_at required'); process.exit(1); }

db.insert(whitepapers).values({
  slug: wp.slug, title: wp.title, subtitle: wp.subtitle || null,
  summary: wp.summary || null, body: wp.body,
  coverImageUrl: wp.cover_image_url || null, author: wp.author || 'TAMPARAN ANAK MUDA',
  downloadUrl: wp.download_url || null, readingTime: wp.reading_time || 10,
  tags: wp.tags || [], status: wp.status === 'scheduled' ? 'draft' : (wp.status || 'published'),
  publishedAt: wp.published_at,
}).then(() => {
  console.log('Whitepaper inserted:', wp.slug, '| status:', wp.status || 'published', '| reading_time:', wp.reading_time || 10);
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Post-Insert Verification:**
```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.select().from(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(r => {
  const w = r[0]; if (!w) { console.error('FATAL: not found'); process.exit(1); }
  console.log('slug:', w.slug, '| status:', w.status, '| publishedAt:', w.publishedAt, '| readingTime:', w.readingTime, '| body:', w.body.length, 'chars');
  console.log('All checks passed.');
}).catch(e => { console.error('FATAL:', e.message); process.exit(1); });
"
```

**Checklist:**
- [ ] Slug uniqueness dicek di DB
- [ ] Whitepaper inserted ke DB
- [ ] `status` = `published` atau `draft`
- [ ] `publishedAt` tidak null
- [ ] `body` tidak kosong
- [ ] `readingTime` > 0

---

## 09-qc

Sitasi, data, tata bahasa, dan konsistensi visual.

**All-in-One QC Audit:**
```bash
npx tsx -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || ''; const title = a.title || '';
const full = body + ' ' + title;
const issues = [];
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount);
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length);
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
if (neg.length) issues.push('Negative parallelisms');
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (need 3+)');
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
if (h1 > 0) issues.push('h1 found: ' + h1);
if (h2 < 5) issues.push('h2 count: ' + h2 + ' (need min 5)');
const ilArtikel = (body.match(/\]\(\/artikel\//g) || []).length;
const ilWp = (body.match(/\]\(\/whitepaper\//g) || []).length;
const il = ilArtikel + ilWp;
if (il < 3) issues.push('Internal links: ' + il + ' (need min 3)');
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 3000) issues.push('Word count: ' + wc + ' (need min 3.000)');
if (wc > 10000) issues.push('Word count: ' + wc + ' (max 10.000)');
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);
console.log('=== QC AUDIT (WHITEPAPER) ===');
console.log('Word count:', wc, '| h2:', h2, '| internal links:', il);
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  - ' + i)); process.exit(1); }
else console.log('\nCLEAN: All checks passed.');
"
```

**Checklist:**
- [ ] Sitasi valid (semua angka punya sumber)
- [ ] Data akurat dan tidak outdated
- [ ] Tata bahasa clean
- [ ] Konsistensi visual (grafik, tabel, layout)
- [ ] QC audit CLEAN

---

## 10-humanizer

Membuat bahasa lebih natural tanpa mengurangi kredibilitas.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md`.

**Yang diperbaiki di step ini:**
- Flow kalimat: perbaiki transisi yang terlalu formal/robotik
- Hilangkan pola AI: staccato drama, rule-of-three abuse, negative parallelisms
- Tambahkan contoh konkret: ganti klaim abstrak dengan contoh spesifik
- Natural tone: ganti kata formal AI dengan kata natural
- **Tetap menjaga kredibilitas:** whitepaper boleh lebih formal dari artikel, tapi tidak boleh terdengar seperti AI
- Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik

**Checklist:**
- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID
- [ ] No staccato drama, rule-of-three abuse, negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini
- [ ] Bahasa natural tapi tetap kredibel

---

## 11-publish

Publikasi PDF atau landing page.

**Whitepaper tidak perlu deploy.** Di-insert ke DB, langsung live saat `status='published'`. Tidak ada file yang di-commit.

**OG Image Generation (manual, template berbeda dari artikel):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

**Verifikasi production:**
```bash
curl -s -o /dev/null -w "whitepaper: %{http_code}\n" "https://tamparananakmuda.com/whitepaper/SLUG"
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"
```

**SEO Indexing:**
1. Submit URL ke Google Search Console: `https://tamparananakmuda.com/whitepaper/SLUG`
2. Ping sitemap

**Checklist:**
- [ ] `status` = `published` di DB
- [ ] OG image generated
- [ ] HTTP 200 di production `/whitepaper/SLUG`
- [ ] Sitemap includes slug
- [ ] Whitepaper muncul di `/whitepaper` list page
- [ ] URL submitted ke Google Search Console

---

## 12-distribution

Email, webinar, media sosial, dan PR.

### Instagram Carousel (8-12 slides)
- Slide 1: Hook headline + visual
- Slide 2-10: Key data points (1 per slide, max 3 angka per slide)
- Slide 11: Pertanyaan refleksi
- Slide 12: CTA ke full whitepaper

### Newsletter (600-800 words)
- Subject line: 1 insight utama, bukan judul whitepaper
- Opening: 1 paragraf hook
- Body: 2-3 insight + 1 quote striking
- Closing: 1 pertanyaan untuk subscriber
- CTA: Link ke full whitepaper
- Kirim via: Brevo dashboard (manual)

### IG Stories (3-5 stories)
- Polling, key takeaways, Q&A, link sticker

### X/Twitter Thread (5-8 tweets)
- Tweet 1: Hook (1 kalimat tajam + angka/data)
- Tweet 2-6: Key insight (1 per tweet, max 280 chars)
- Tweet 7: Quote atau data striking
- Tweet 8: CTA ke full whitepaper

### LinkedIn (400-600 words + publish sebagai LinkedIn Article)
- Hook line: 1 kalimat relevan untuk professional audience
- Body: 2-3 insight dengan sudut pandang professional
- CTA: "Baca analisis lengkapnya di sini: tamparananakmuda.com/whitepaper/SLUG"
- Hashtags: 3-5 relevant hashtags
- Publish sebagai LinkedIn Article (bukan post biasa)

### TikTok/Reels
- Tidak direkomendasikan untuk whitepaper (terlalu kompleks)
- Jika ingin dibuat, pecah jadi beberapa video pendek dengan 1 insight per video

**Timeline:**
```
Hari 1: Publish whitepaper di website
Hari 2: Post IG Carousel + Stories + X/Twitter thread
Hari 3: Kirim newsletter + LinkedIn Article
Hari 7: Review analytics awal
```

**Checklist:**
- [ ] IG Carousel dibuat (8-12 slides)
- [ ] Newsletter dikirim (600-800 words)
- [ ] IG Stories dipost
- [ ] X/Twitter thread dipost (5-8 tweets)
- [ ] LinkedIn Article dipublikasikan

---

## 13-monitor

Ranking, traffic, dan engagement.

**Metrics to track (via Umami):**
- Page views, unique visitors, average reading time
- Scroll depth, email subscribe rate, social referral traffic
- PDF download count (jika `downloadUrl` di-set)
- Bounce rate

**Review schedule:**
- H+1: Cek apakah whitepaper ter-index Google (site:search)
- H+3: Cek social engagement (likes, shares, saves)
- H+7: Review metrics awal vs target
- H+30: Full performance review, decide if refresh needed

**Checklist:**
- [ ] Whitepaper ter-index Google (H+1)
- [ ] Social engagement dicek (H+3)
- [ ] Metrics awal vs target (H+7)
- [ ] Full performance review (H+30)

---

## 14-update

Revisi jika ada data atau temuan baru.

**Monthly:**
- Cek apakah data di whitepaper masih relevan
- Update jika ada survei/studi baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review whitepaper secara keseluruhan
- Identifikasi whitepaper untuk update vs archive
- Plan whitepaper baru berdasarkan performa

**Rollback (jika perlu hapus whitepaper):**
```bash
npx tsx -e "
const fs = require('fs'); const path = require('path');
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return;
    const i = t.indexOf('='); if (i === -1) return;
    process.env[t.substring(0, i).trim()] = t.substring(i + 1).trim();
  });
}
const { db } = require('./lib/db'); const { whitepapers } = require('./lib/db/schema'); const { eq } = require('drizzle-orm');
db.delete(whitepapers).where(eq(whitepapers.slug, 'SLUG')).then(() => console.log('Whitepaper deleted: SLUG')).catch(e => console.error('FATAL:', e.message));
"
```

**Checklist:**
- [ ] Data masih relevan (monthly check)
- [ ] Internal links masih aktif (monthly check)
- [ ] SEO ranking stabil atau naik (monthly check)
- [ ] Whitepaper review dilakukan (quarterly)
