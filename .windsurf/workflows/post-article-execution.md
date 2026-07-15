---
description: Workflow lengkap untuk eksekusi artikel TAM, dari riset topik sampai distribusi multi-platform
---

# Post-Article Execution Workflow

Workflow ini mencakup seluruh pipeline: riset, drafting, QC, insert database, deploy, distribusi, dan maintenance. Setiap step harus complete sebelum lanjut.

## Env Var Reference

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project | Public |
| `SUPABASE_SERVICE_ROLE_KEY` | Bypass RLS untuk insert | Server only |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Read published posts (RLS) | Public |
| `NEXT_PUBLIC_SITE_URL` | URL production | Public |
| `BREVO_API_KEY` | Newsletter | Server only |
| `BREVO_LIST_ID` | Subscriber list | Server only |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 access key | Server only |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 secret | Server only |
| `R2_ENDPOINT` | R2 S3 endpoint URL | Server only |
| `R2_BUCKET_NAME` | R2 bucket name (`cdn-tam`) | Server only |
| `CDN_BASE_URL` | CDN domain (`https://cdn.tamparananakmuda.com`) | Public |
| `CRON_SECRET` | Auth secret untuk cron API auto-publish | Server only |

```bash
export SUPA_URL="$NEXT_PUBLIC_SUPABASE_URL"
export SUPA_KEY="$SUPABASE_SERVICE_ROLE_KEY"
export ARTICLE_JSON="/tmp/tam-article.json"
```

## Step -1: Topic Research & Angle Test

Sebelum drafting, validasi ide artikel. Mencegah artikel generik dan memastikan angle TAM unik.

**Untuk ide yang sudah melalui workflow `/content-ideation`** (file: `.windsurf/workflows/content-ideation.md`), langsung lanjut ke Step 0 dengan ide yang sudah terpilih.

**Untuk ide ad-hoc (tidak dari ideation workflow):** lakukan angle test di bawah ini.

**Angle Test (2 pertanyaan wajib):**
1. "Apakah ada media lain yang akan menulis ini dengan cara yang sama?" Jika ya, rewrite angle.
2. "Kalau saya hapus nama TAM dari artikel ini, apakah pembaca tahu ini tulisan TAM?" Jika tidak, terlalu generik.

**POV Selection (wajib pilih salah satu):**
- `kontra-narasi` - melawan narasi populer dengan dasar kuat
- `refleksi` - pengalaman/observasi personal yang spesifik
- `data` - data + interpretasi yang tidak obvious
- `framework` - kerangka berpikir original
- `tamparan` - statement tajam yang membongkar ilusi langsung
- `riset` - temuan riset/studi sebagai angle utama
- `opini` - sudut pandang yang berani dan spesifik
- `panduan` - guide praktis berbasis pengalaman nyata
- `inspirasi` - cerita inspiratif tanpa menjual harapan palsu

**Category Reference:**
| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karir-tujuan` | Karir & Tujuan | #4080D9 |
| `relasi` | Relasi | #40B880 |
| `keuangan` | Keuangan | #D9A040 |
| `identitas` | Identitas | #A040D9 |

**Checklist:**
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Minimal 1 insight unik yang tidak ada di 3 artikel pertama Google

## Step 0: Pre-Flight Database Check

Verifikasi struktur data sesuai schema database aktual. Mencegah error 500 di production.

**Cek koneksi database:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?select=id&limit=1" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d.message) console.error('DB ERROR:', d.message);
else console.log('DB connection OK');
"
```

**Cek slug uniqueness (CRITICAL):**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=id,slug" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d.length > 0) { console.error('FATAL: Slug exists!', d[0].slug); process.exit(1); }
else console.log('Slug available');
"
```

**Cek category_id:**
```bash
curl -s "$SUPA_URL/rest/v1/categories?slug=eq.karir-tujuan&select=id,title,color" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d[0]) console.log('ID:', d[0].id, '| Color:', d[0].color);
else console.error('Category not found');
"
```

**Cek author_id (default: Yovie Setiawan):**
```bash
curl -s "$SUPA_URL/rest/v1/authors?slug=eq.yovie-setiawan&select=id,name" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if(d[0]) console.log('Author ID:', d[0].id, '| Name:', d[0].name);
else console.error('Author not found');
"
```

**Kolom ADA di `posts` (verified dari schema + migrations):**
- `id`, `title`, `slug`, `excerpt`, `body`, `category_id`, `subcategory_id`, `author_id`, `status`
- `pov_tag`, `human_signature`, `fact_check_status`, `review_status`
- `source_references` (JSONB array, BUKAN string)
- `seo_meta_title`, `seo_meta_description`, `seo_keywords` (text[]), `reading_time`
- `og_headline`, `og_card_url`, `og_feature_url`, `og_image_url`, `cover_image_url`, `cover_image_alt`, `is_premium`, `is_sponsored`
- `sponsor_name`, `sponsor_url`, `sponsor_disclosure`, `premium_excerpt`
- `series_id`, `series_order`, `published_at`, `created_at`, `updated_at`, `featured`

**Kolom TIDAK ADA:** `tags`

**Subcategory (Pillar) Reference:**
17 pillars di DB (tabel `subcategories`). Query by category_id untuk pilih pillar yang relevan:
```bash
curl -s "$SUPA_URL/rest/v1/subcategories?category_id=eq.CATEGORY_UUID&select=id,title,slug&order=sort_order.asc" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
d.forEach(s => console.log(s.slug + ' | ' + s.title + ' | ' + s.id));
"
```

Daftar lengkap 17 pillars:
| Slug | Title |
|------|-------|
| `mindset-realita` | Mindset & Realita |
| `karier-dunia-kerja` | Karier & Dunia Kerja |
| `keuangan-uang` | Keuangan & Uang |
| `bisnis` | Bisnis |
| `teknologi-ai` | Teknologi & AI |
| `hubungan-sosial` | Hubungan Sosial |
| `produktivitas` | Produktivitas |
| `psikologi` | Psikologi |
| `analisis-fenomena` | Analisis Fenomena |
| `lifestyle` | Lifestyle |
| `skill-masa-depan` | Skill Masa Depan |
| `sejarah-orang-sukses` | Sejarah Orang Sukses |
| `komunikasi` | Komunikasi |
| `filosofi-hidup` | Filosofi Hidup |
| `tamparan` | Tamparan |
| `ulasan-buku` | Ulasan Buku |
| `pendidikan` | Pendidikan |

**CRITICAL rules:**
- `source_references`: HARUS JSON array, bukan string. Format: `[{"type":"link","url":"...","label":"..."}]`
- `excerpt`: MAX 160 karakter (DB constraint `char_length <= 160`)
- `seo_meta_description`: MAX 160 karakter (DB constraint)
- `reading_time`: Auto-calculated by DB trigger, tidak perlu manual insert
- `published_at`: WAJIB set ke `new Date().toISOString()`. Jika null, artikel tidak muncul di top homepage (sort by `published_at DESC`). Jika `status='scheduled'`, set `published_at` ke waktu publish di masa depan. Cron job akan auto-publish saat `published_at <= now()`.

## Step 0.5: Draft Writing Guidelines

Aturan formatting markdown body artikel sebelum masuk ke QC.

**Word Count (STANDAR TAM):**
- Target: 1.000-2.500 kata (5-12 menit baca)
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`, `files/ContentCalendar.md`
- Artikel di bawah 1.000 kata = perlu expand depth (data tambahan, contoh kasus, elaborasi argumentasi)
- Artikel di atas 2.500 kata = perlu trim atau pecah jadi multi-part series

**Heading Structure (CRITICAL untuk Table of Contents):**
- Gunakan `##` (h2) untuk section utama, `###` (h3) untuk sub-section
- JANGAN gunakan `#` (h1) di body, h1 sudah dipakai untuk title
- TableOfContents parse h2 dan h3. Jika tidak ada, TOC kosong
- Minimal 3 heading h2 untuk TOC berfungsi

**Internal Linking (Wajib):**
- Minimal 2 link ke artikel TAM lain di body
- Format: `[judul](/artikel/slug-artikel)`
- Cek artikel relevan:
```bash
curl -s "$SUPA_URL/rest/v1/posts?status=eq.published&select=title,slug&limit=20" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
d.forEach(p => console.log(p.title + ' -> /artikel/' + p.slug));
"
```

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`

**Punctuation:**
- Tidak pakai em dash (—) atau en dash (–)
- Maks 1 exclamation mark per artikel
- Tidak pakai ellipsis (...) sebagai desain

**OG Headline (CRITICAL):**
- `og_headline` HARUS berbeda dari `title`. Jangan copy-paste title ke og_headline
- `og_headline` harus lebih pendek, punchy, dan conversational (max 50 karakter, sesuai card template `titleMaxChars=50`)
- Fungsi: hook untuk OG image yang membuat orang klik saat share di social media
- Format: kalimat langsung, bukan judul formal. Contoh:
  - title: "Perbandingan Diri di Era Media Sosial: Kenapa Kamu Merasa Tidak Cukup"
  - og_headline: "Scroll media sosial bikin kamu merasa gagal?"
  - title: "PHK Membongkar Ilusi: Kerja Keras Tidak Menjamin Aman"
  - og_headline: "Kerja keras tidak menjamin kamu aman dari PHK"
- Jika `og_headline` null, OG image akan fallback ke `title` (tidak ideal untuk social click-through)

**Command cek heading + internal links:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const b = a.body;
const h1 = (b.match(/^# /gm) || []).length;
const h2 = (b.match(/^## /gm) || []).length;
const h3 = (b.match(/^### /gm) || []).length;
console.log('h1:', h1, h1 > 0 ? 'WARNING: jangan pakai h1' : 'OK');
console.log('h2:', h2, h2 < 3 ? 'WARNING: butuh min 3' : 'OK');
console.log('h3:', h3);
const il = (b.match(/\]\(\/artikel\//g) || []).length;
console.log('internal links:', il, il < 2 ? 'WARNING: butuh min 2' : 'OK');
// Cek og_headline vs title
const og = a.og_headline || '';
console.log('og_headline:', og ? og : 'MISSING');
console.log('og_headline == title?', og === a.title ? 'WARNING: harus berbeda!' : 'OK');
console.log('og_headline length:', og.length, og.length > 50 ? 'WARNING: max 50' : 'OK');
// Cek word count
const wc = b.split(/\s+/).length;
console.log('word count:', wc, wc < 1000 ? 'WARNING: butuh min 1.000' : wc > 2500 ? 'WARNING: max 2.500' : 'OK');
"
```

## Step 1: Editorial QC Audit

Validasi semua data dan klaim dalam artikel sebelum masuk ke database.

**Humanizer rules lengkap:** Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori + audit script).

**Checklist Faktual:**
- [ ] Setiap angka punya sumber yang bisa ditrace (URL aktif)
- [ ] POV tag dipilih: kontra-narasi / refleksi / data / framework / tamparan / riset / opini / panduan / inspirasi
- [ ] Heading structure: h2/h3 only, minimal 3 h2, tidak ada h1
- [ ] Internal linking: minimal 2 link ke artikel TAM lain
- [ ] Tidak ada raw HTML script/iframe/style di body
- [ ] OG headline berbeda dari title, max 50 karakter, conversational
- [ ] Word count: 1.000-2.500 kata (di bawah 1.000 = expand, di atas 2.500 = trim)

**Checklist Humanizer (detail di `files/HumanizerRules.md`):**
- [ ] Punctuation: no em dash (—), no en dash (–), no curly quotes, max 1 exclamation, sentence case headings
- [ ] AI vocabulary EN: no crucial, pivotal, vibrant, tapestry, delve, showcase, underscore, dll (lihat HumanizerRules.md section 2)
- [ ] AI vocabulary ID: no signifikan, krusial, esensial, vital, mendalam, memperhatikan, pada dasarnya, dll (lihat HumanizerRules.md section 3)
- [ ] Structural: no staccato drama, no rule-of-three abuse (>2x), no fragmented headers, no negative parallelisms (>1x), no aphorism formulas
- [ ] Promotional: no game-changing, revolutionary, groundbreaking, seamless, empower, transform, unlock, dll
- [ ] Vague attribution: "studi menunjukkan" wajib sebut nama studi + tahun + link
- [ ] Copula avoidance: no "serves as", "stands as", "represents a" -> gunakan "adalah" atau kalimat aktif
- [ ] Signposting: no "let's dive in", "marilah kita bahas", "berikut hal yang perlu kamu tahu"
- [ ] Filler: no "in order to", "due to the fact", "perlu diketahui bahwa"
- [ ] Generic conclusions: no "masa depan cerah", "exciting times", "peluang tak terbatas"
- [ ] Authority tropes: no "the real question is", "pada hakikatnya", "inti permasalahannya"
- [ ] Conversational openers: no "Honestly?", "Jujur saja,", "Begini"
- [ ] Hyphenated pairs: maks 2x per artikel
- [ ] Boldface: hanya untuk key terms/angka penting, bukan istilah umum
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik, gunakan "kita"/"kamu" (bukan "Anda")
- [ ] Tone check: jujur, rasional, berani, tidak menggurui
- [ ] Ada opinions/reactions, bukan hanya neutral reporting
- [ ] Ada acknowledgment of uncertainty atau mixed feelings jika relevan
- [ ] Sentence length variety: campuran kalimat pendek dan panjang

**Command:**
```bash
# Cek heading + internal links + word count
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const b = a.body;
const h1 = (b.match(/^# /gm) || []).length;
const h2 = (b.match(/^## /gm) || []).length;
const h3 = (b.match(/^### /gm) || []).length;
const il = (b.match(/\]\(\/artikel\//g) || []).length;
const words = b.split(/\s+/).filter(w => w.length > 0).length;
console.log('h1:', h1, h1 > 0 ? 'WARNING' : 'OK');
console.log('h2:', h2, h2 < 3 ? 'WARNING: need 3+' : 'OK');
console.log('h3:', h3);
console.log('internal links:', il, il < 2 ? 'WARNING: need 2+' : 'OK');
console.log('word count:', words, words < 1000 ? 'WARNING: need 1000+' : words > 2500 ? 'WARNING: trim to 2500' : 'OK');
"

# Cek humanizer patterns (full audit dari HumanizerRules.md)
python3 -c "
import json, re, sys
d = json.load(open('$ARTICLE_JSON'))
body = d.get('body', '')
title = d.get('title', '')
excerpt = d.get('excerpt', '')
full = body + ' ' + title + ' ' + excerpt
issues = []

# 1. Em/en dash
if '\u2014' in full or '\u2013' in full:
    issues.append('Em/en dash found')

# 2. AI vocab EN
ai_en = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash']
found_en = [w for w in ai_en if w in body.lower()]
if found_en: issues.append('AI vocab EN: ' + ', '.join(found_en))

# 3. AI vocab ID
ai_id = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri']
found_id = [w for w in ai_id if w in body.lower()]
if found_id: issues.append('AI vocab ID: ' + ', '.join(found_id))

# 4. Staccato drama
sentences = re.split(r'[.!?]\s+', body)
current_run = max_run = 0
for s in sentences:
    if len(s.split()) <= 6: current_run += 1; max_run = max(max_run, current_run)
    else: current_run = 0
if max_run >= 3: issues.append('Staccato drama (max run: %d)' % max_run)

# 5. Rule of three
triples = re.findall(r'(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)', body)
if len(triples) > 2: issues.append('Rule of three: %d' % len(triples))

# 6. Negative parallelisms
neg = re.findall(r'(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)', body, re.I)
if neg: issues.append('Negative parallelisms: %d' % len(neg))

# 7. Curly quotes
if '\u201c' in body or '\u201d' in body:
    issues.append('Curly quotes')

# 8. -ing superficial
ing = re.findall(r'(\w+ing (?:the|its|a|this|that))', body)
if len(ing) > 2: issues.append('-ing superficial: %d' % len(ing))

# 9. Promotional
promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket']
found_promo = [w for w in promo if w in body.lower()]
if found_promo: issues.append('Promotional: ' + ', '.join(found_promo))

# 10. Signposting
signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar']
found_signs = [w for w in signs if re.search(w, body, re.I)]
if found_signs: issues.append('Signposting')

# 11. Filler
fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa']
found_fillers = [w for w in fillers if w in body.lower()]
if found_fillers: issues.append('Filler: ' + ', '.join(found_fillers))

# 12. Generic conclusions
generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas']
found_generic = [w for w in generic if w in body.lower()]
if found_generic: issues.append('Generic conclusion: ' + ', '.join(found_generic))

# 13. Exclamation marks
if body.count('!') > 1: issues.append('Exclamation marks: %d' % body.count('!'))

# 14. Human signature check
personal = len(re.findall(r'\bkita\b|\bkamu\b|\bsaya\b', body, re.I))
if personal < 3: issues.append('Human signature weak (kita/kamu/saya: %d)' % personal)

# 15. Fragmented headers
lines = body.split('\n')
for i, line in enumerate(lines):
    if line.startswith('## ') and i+1 < len(lines):
        next_line = lines[i+1].strip() if lines[i+1].strip() else (lines[i+2].strip() if i+2 < len(lines) else '')
        heading_text = line.replace('## ','').lower()
        if next_line and len(next_line) < 50:
            words_overlap = set(heading_text.split()) & set(next_line.lower().split())
            if len(words_overlap) >= 2:
                issues.append('Fragmented header: \"%s\"' % line.strip())

print('=== HUMANIZER AUDIT ===')
if issues:
    for i in issues: print('  FAIL:', i)
    print('\nTOTAL ISSUES:', len(issues))
else:
    print('  CLEAN: No issues detected.')
"
```

**Content Quality Score (0-100, target > 80):**

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Angle test | 25 | Lolos percobaan pertama (25), kedua (15), ketiga+ (5) |
| Human signature | 25 | Pengalaman personal (25), observasi (20), opini spesifik (15), tidak ada (0) |
| Fact-check | 25 | Semua klaim terverifikasi (25), minor issues (15), flagged (0) |
| POV clarity | 25 | POV tag dipilih dan konsisten (25), tidak konsisten (10), tidak ada (0) |

## Step 2: Source Verification (Tier System)

Klasifikasi semua sumber ke dalam tier reliability.

**Tier 1: Terverifikasi langsung dari publikasi asli**
- URL aktif dan bisa diakses
- Data bisa dikonfirmasi di halaman sumber
- Tidak ada perantara (artikel sekunder yang mengutip)

**Tier 2: Tidak terverifikasi langsung, digunakan dengan atribusi jelas**
- Data dikutip dari media sekunder (contoh: "menurut data Jakpat yang dikutip Mojok.co")
- Tidak bisa konfirmasi langsung dari publikasi primer
- Wajib label atribusi di body artikel

**Yang harus dihapus:**
- Sumber yang URL-nya dead link
- Data dari survei internal dengan sample terlalu kecil (n < 5.000 untuk klaim general)
- Blog post tanpa data primer
- Artikel sekunder yang tidak menambah data unik

**Output:** Update `source_references` di JSON dengan hanya sumber yang lulus verifikasi.

**Command cek HTTP status semua source references:**
```bash
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));
const refs = a.source_references || [];
(async () => {
  for (const ref of refs) {
    try {
      const res = await fetch(ref.url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(10000) });
      const status = res.status;
      const tag = status >= 200 && status < 400 ? 'OK' : 'DEAD';
      console.log(tag + ' [' + status + '] ' + ref.url);
    } catch (e) {
      // HEAD might not be supported, try GET
      try {
        const res = await fetch(ref.url, { redirect: 'follow', signal: AbortSignal.timeout(10000) });
        const tag = res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD';
        console.log(tag + ' [' + res.status + '] ' + ref.url);
      } catch (e2) {
        console.log('DEAD [ERR] ' + ref.url + ' (' + e2.message + ')');
      }
    }
  }
})();
"

## Step 3: SEO Metadata Finalization

Pastikan semua metadata SEO optimal sebelum insert ke database.

### 3a. Keyword Research

Target 3-8 keyword long-tail dalam Bahasa Indonesia. Prioritas: keyword dengan search volume tinggi + competition rendah.

**Tools:**
- Google Keyword Planner (gratis, butuh Google Ads account)
- Ubersuggest (free tier 3x/hari)
- Google autocomplete (ketik keyword utama, liati saran)
- Related searches di Google SERP

**Simpan ke `seo_keywords` field:** array string, contoh: `["hustle culture gen z", "dampak hustle culture", "burnout gen z indonesia"]`

### 3b. Meta Title & Description

**Meta Title Formula:** `[Keyword Utama] + [Hook] | TAM` (max 70 karakter)
- Contoh: `Hustle Culture Bikin Gen Z Berhenti Berlari | TAM`
- Keyword utama di awal untuk SEO weight

**Meta Description Formula:** `[Konteks Keyword] + [Value Proposition] + [CTA]` (max 160 karakter, DB constraint)
- Contoh: `Hustle culture menjual mimpi sukses tanpa henti. Tapi data menunjukkan gen Z sudah berhenti berlari. Baca analisis lengkapnya di sini.`
- Mengandung keyword utama secara natural
- Jangan copy paste excerpt

### 3c. Slug Optimization

- Kebab-case: `hustle-culture-gen-z-berhenti-berlari`
- Keyword utama di awal slug
- Max 60 karakter
- Unique (cek di Step 0)

### 3d. Heading SEO

- h2 mengandung secondary keyword (variasi dari keyword utama)
- h3 untuk long-tail keyword variations
- Jangan repeat keyword utama berlebihan (keyword stuffing)
- Natural reading flow > keyword density

### 3e. Image Alt Text

- Deskriptif + keyword when natural: `Infografik hustle culture dan dampaknya ke gen z Indonesia`
- Jangan keyword stuffing di alt text
- Setiap gambar wajib punya alt text

### 3f. Internal Linking

- Minimal 2 link ke artikel TAM lain di body
- Anchor text bervariasi (jangan selalu "baca juga" atau judul persis)
- Link dari konteks yang relevan, bukan di akhir artikel saja
- Cek artikel relevan via command di Step 0.5

**Checklist:**
- [ ] `seo_keywords`: 3-8 keyword long-tail, Bahasa Indonesia
- [ ] `seo_meta_title`: max 70 karakter, keyword utama di awal, ada `| TAM`
- [ ] `seo_meta_description`: **MAX 160 karakter** (DB constraint), mengandung keyword
- [ ] `slug`: kebab-case, keyword di awal, max 60 karakter, **unique**
- [ ] `excerpt`: **MAX 160 karakter** (DB constraint)
- [ ] `og_headline`: max 50 karakter untuk OG image (fallback ke title)
- [ ] h2 mengandung secondary keyword
- [ ] Internal linking: minimal 2 link, anchor text bervariasi
- [ ] Image alt text: deskriptif + keyword when natural
- [ ] `category_id`: sudah di-query dari Step 0
- [ ] `author_id`: sudah di-query dari Step 0 (default: Yovie Setiawan)

### 3g. SEO Scoring Rubric (0-100, target > 80)

| Komponen | Max | Kriteria |
|----------|-----|----------|
| Keyword research | 20 | 5-8 keyword long-tail (20), 3-4 keyword (15), <3 (5) |
| Meta title | 15 | Keyword di awal + hook + max 70 (15), keyword ada tapi tidak di awal (10), >70 chars (0) |
| Meta description | 15 | Keyword + value prop + CTA + max 160 (15), ada keyword (10), >160 (0) |
| Heading SEO | 15 | h2 ada secondary keyword (15), h2 ada tapi no keyword (10), no h2 (0) |
| Internal linking | 15 | 3+ link bervariasi (15), 2 link (10), <2 (0) |
| Slug | 10 | Kebab-case + keyword di awal + max 60 (10), ada keyword (7), >60 (0) |
| Alt text | 10 | Semua gambar punya alt + keyword natural (10), ada alt (5), ada gambar tanpa alt (0) |

**Command:**
```bash
python3 -c "
import json
d = json.load(open('$ARTICLE_JSON'))
print(f'SEO title: {len(d[\"seo_meta_title\"])} chars (max 70)')
print(f'SEO desc: {len(d[\"seo_meta_description\"])} chars (max 160)')
print(f'Slug: {len(d[\"slug\"])} chars (max 60)')
excerpt_len = len(d['excerpt'])
print(f'Excerpt: {excerpt_len} chars (max 160)')
if excerpt_len > 160:
    print('WARNING: Excerpt exceeds 160 chars! Will fail DB insert.')
    print('Trim to:', d['excerpt'][:157] + '...')
seo_desc_len = len(d['seo_meta_description'])
if seo_desc_len > 160:
    print('WARNING: SEO description exceeds 160 chars! Will fail DB insert.')
"
```

## Step 4: Database Insert

Insert artikel ke Supabase database. Gunakan **service role key** (bukan anon key) untuk bypass RLS.

**CRITICAL - Gunakan `$SUPA_KEY` (SUPABASE_SERVICE_ROLE_KEY), bukan anon key.**

**Article JSON Template (simpan ke `$ARTICLE_JSON`):**
```json
{
  "title": "Judul Artikel",
  "slug": "slug-artikel-kebab-case",
  "excerpt": "Excerpt max 160 karakter",
  "body": "## Heading 1\n\nKonten...\n\n## Heading 2\n\nKonten...\n\n### Sub-heading\n\nKonten...",
  "category_id": "UUID dari Step 0",
  "subcategory_id": "UUID pillar dari Step 0 (opsional, null jika tidak relevan)",
  "author_id": "UUID dari Step 0",
  "status": "published",
  "seo_keywords": ["keyword 1", "keyword 2", "keyword 3"],
  "pov_tag": "data",
  "human_signature": true,
  "fact_check_status": "verified",
  "review_status": "publish",
  "source_references": [
    {"type": "link", "url": "https://sumber.com", "label": "Nama Sumber"}
  ],
  "featured": true,
  "seo_meta_title": "SEO Title max 70",
  "seo_meta_description": "SEO desc max 160",
  "og_headline": "OG headline max 50",
  "published_at": "2026-01-01T00:00:00.000Z"
}
```

**Optional fields (tambah hanya jika perlu):**
- `cover_image_url`, `cover_image_alt`: null (OG image auto-generate via R2)
- `og_card_url`, `og_feature_url`, `og_image_url`: null (auto-populated by OG generate step)
- `is_premium`, `premium_excerpt`: false, null
- `is_sponsored`, `sponsor_name`, `sponsor_url`, `sponsor_disclosure`: false, null
- `series_id`, `series_order`: null (untuk multi-part articles)

**Scheduling (opsional):**
- Untuk publish langsung: `"status": "published"`, `"published_at": "2026-01-01T00:00:00.000Z"` (now atau past)
- Untuk schedule: `"status": "scheduled"`, `"published_at": "2026-01-15T08:00:00.000Z"` (future date)
- Cron job berjalan tiap jam (:00), auto-publish artikel dengan `status='scheduled'` dan `published_at <= now()`
- Max delay: 60 menit dari waktu scheduled

**Catatan:**
- `reading_time`: Tidak perlu insert. DB trigger auto-calculate dari body
- `published_at`: WAJIB set. Jika null, artikel tidak muncul di top homepage
- `source_references`: Field di DB pakai `label`, bukan `title`

**Insert command:**
```bash
# 1. Prepare payload
node -e "
const fs = require('fs');
const article = JSON.parse(fs.readFileSync('$ARTICLE_JSON', 'utf8'));

const payload = {
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  body: article.body,
  category_id: article.category_id,
  subcategory_id: article.subcategory_id || null,
  author_id: article.author_id,
  status: article.status === 'scheduled' ? 'scheduled' : 'published',
  seo_keywords: article.seo_keywords || null,
  pov_tag: article.pov_tag || 'data',
  human_signature: article.human_signature !== false,
  fact_check_status: 'verified',
  review_status: 'publish',
  source_references: article.source_references.map(r => ({
    type: r.type || 'link',
    url: r.url,
    label: r.label || r.title
  })),
  featured: article.featured || false,
  seo_meta_title: article.seo_meta_title,
  seo_meta_description: article.seo_meta_description,
  og_headline: article.og_headline || article.title,
  published_at: article.published_at || new Date().toISOString()
};

// VALIDASI
if (payload.excerpt.length > 160) {
  console.error('FATAL: excerpt > 160 chars (' + payload.excerpt.length + ')');
  process.exit(1);
}
if (payload.seo_meta_description && payload.seo_meta_description.length > 160) {
  console.error('FATAL: seo_meta_description > 160 chars');
  process.exit(1);
}
if (!Array.isArray(payload.source_references)) {
  console.error('FATAL: source_references must be array');
  process.exit(1);
}
if (!payload.published_at) {
  console.error('FATAL: published_at is required');
  process.exit(1);
}

fs.writeFileSync('/tmp/tam-payload.json', JSON.stringify(payload));
console.log('Payload ready. Array:', Array.isArray(payload.source_references));
"

# 2. Insert via curl
curl -s -X POST "$SUPA_URL/rest/v1/posts" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d @/tmp/tam-payload.json | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if (d.message) { console.error('INSERT FAILED:', d.message); process.exit(1); }
console.log('Inserted:', d[0].slug);
console.log('source_references isArray:', Array.isArray(d[0].source_references));
console.log('published_at:', d[0].published_at);
console.log('author_id:', d[0].author_id);
if (!Array.isArray(d[0].source_references)) {
  console.error('WARNING: source_references not array! Will cause 500.');
}
if (!d[0].published_at) {
  console.error('WARNING: published_at is null! Article will not appear on homepage.');
}
"
```

## Step 4.5: Post-Insert Data Verification

Verifikasi data yang masuk DB sudah benar sebelum lanjut.

**Command:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=*" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const p = d[0];
if (!p) { console.error('NOT FOUND'); process.exit(1); }
console.log('=== Post-Insert Verification ===');
console.log('slug:', p.slug);
console.log('status:', p.status);
console.log('published_at:', p.published_at);
console.log('author_id:', p.author_id);
console.log('category_id:', p.category_id);
console.log('source_references isArray:', Array.isArray(p.source_references));
console.log('excerpt length:', p.excerpt ? p.excerpt.length : 'null', '(max 160)');
console.log('reading_time:', p.reading_time, '(auto-calculated)');
console.log('featured:', p.featured);

const issues = [];
if (!p.published_at) issues.push('published_at is null');
if (!p.author_id) issues.push('author_id is null');
if (!p.category_id) issues.push('category_id is null');
if (!Array.isArray(p.source_references)) issues.push('source_references not array');
if (p.excerpt && p.excerpt.length > 160) issues.push('excerpt > 160');

if (issues.length > 0) {
  console.error('ISSUES:', issues.join(', '));
  process.exit(1);
} else {
  console.log('All checks passed.');
}
"
```

**Checklist:**
- [ ] Response tidak ada `message` field (error)
- [ ] `source_references` isArray = `true`
- [ ] `published_at` tidak null
- [ ] `author_id` tidak null
- [ ] `category_id` tidak null
- [ ] `excerpt` length <= 160
- [ ] `reading_time` terisi (auto-calculated by trigger)

## Step 4.6: Scheduling Verification

Jika artikel di-insert dengan `status='scheduled'`, verifikasi scheduling akan berjalan.

**Cek status & published_at:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=status,published_at" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const p = d[0];
if (!p) { console.error('NOT FOUND'); process.exit(1); }
console.log('status:', p.status);
console.log('published_at:', p.published_at);
if (p.status === 'scheduled') {
  const now = new Date();
  const pubDate = new Date(p.published_at);
  if (pubDate <= now) {
    console.error('WARNING: published_at is in the past but status is scheduled! Cron should have published this.');
  } else {
    const hoursUntil = Math.ceil((pubDate - now) / 3600000);
    console.log('Will auto-publish in ~' + hoursUntil + ' hours (cron runs at :00)');
  }
} else if (p.status === 'published') {
  console.log('Already published');
}
"
```

**Checklist (if scheduled):**
- [ ] `status` = `scheduled` di DB
- [ ] `published_at` di masa depan
- [ ] `CRON_SECRET` env var set di Vercel dashboard
- [ ] `vercel.json` cron config deployed
- [ ] Frontend tidak menampilkan artikel (safety filter `published_at <= now()` aktif)

**Checklist (if published directly):**
- [ ] `status` = `published` di DB
- [ ] `published_at` di now atau past
- [ ] Artikel muncul di homepage/article list

## Step 5: OG Image Generation (WebP via R2 CDN)

Setelah artikel di-insert, generate OG images ke R2 CDN. Sistem menghasilkan **2 WebP images per post**:
- **Card** (800x450) → `og/{slug}-card.webp` → untuk thumbnail article list
- **Feature** (1600x900) → `og/{slug}-feature.webp` → untuk header artikel + social meta tags

**Generate via API (admin auth required):**
```bash
curl -s -X POST "https://tamparananakmuda.com/api/og/generate" \
  -H "Content-Type: application/json" \
  -H "Cookie: <admin-session-cookie>" \
  -d '{"slug":"SLUG"}'
```

**Atau via batch script (local, semua post):**
```bash
npx tsx scripts/generate-all-og.ts
```

**Verify di R2 CDN:**
```bash
curl -s -o /dev/null -w "card: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -o /dev/null -w "feature: %{http_code} (%{size_download} bytes)\n" "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"
```

**Verify DB updated:**
```bash
curl -s "$SUPA_URL/rest/v1/posts?slug=eq.SLUG&select=og_card_url,og_feature_url,og_image_url" \
  -H "apikey: $SUPA_KEY" -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
const p=d[0];
console.log('card:', p.og_card_url);
console.log('feature:', p.og_feature_url);
console.log('og:', p.og_image_url);
"
```

**Checklist:**
- [ ] API/batch script sukses generate (no errors)
- [ ] `og/{slug}-card.webp` HTTP 200 di CDN
- [ ] `og/{slug}-feature.webp` HTTP 200 di CDN
- [ ] DB: `og_card_url` = `https://cdn.tamparananakmuda.com/og/{slug}-card.webp`
- [ ] DB: `og_feature_url` = `https://cdn.tamparananakmuda.com/og/{slug}-feature.webp`
- [ ] DB: `og_image_url` = sama dengan `og_feature_url` (untuk social meta)
- [ ] Category color ter-aplikasi di accent pillar
- [ ] Headline tidak terpotong
- [ ] Brand mark (TAMPARAN ANAK MUDA) terlihat
- [ ] `og_headline` dipakai jika ada (fallback ke `title`)

## Step 6: Production Deployment Check

Setelah artikel live di local, deploy dan verifikasi production.

**Deploy:**
```bash
git add -A && git commit -m "feat: add new article SLUG" && git push origin main
```

**Tunggu Vercel auto-deploy, lalu verifikasi:**
```bash
# HTTP status
curl -s -o /dev/null -w "article: %{http_code}\n" "https://tamparananakmuda.com/artikel/SLUG"

# JSON-LD schema present
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o '"@type":"Article"' && echo "Schema OK" || echo "Schema MISSING"

# OG meta tags
curl -s "https://tamparananakmuda.com/artikel/SLUG" | grep -o 'og:title' && echo "OG tags OK" || echo "OG tags MISSING"

# Sitemap includes new article
curl -s "https://tamparananakmuda.com/sitemap.xml" | grep "SLUG" && echo "Sitemap OK" || echo "Sitemap MISSING"

# RSS feed includes new article
curl -s "https://tamparananakmuda.com/rss.xml" | grep "SLUG" && echo "RSS OK" || echo "RSS MISSING"
```

**Checklist:**
- [ ] `git push` sukses
- [ ] Vercel deploy sukses (cek GitHub deployment status)
- [ ] HTTP 200 di production `/artikel/SLUG`
- [ ] JSON-LD schema `@type:Article` present di page source
- [ ] OG meta tags present (`og:title`, `og:description`, `og:image`)
- [ ] Sitemap includes new slug
- [ ] RSS feed includes new article
- [ ] Jika 500: cek Vercel serverless issues di bawah

**Note: `llms.txt` dan `llms-full.txt` tidak perlu update per artikel.** Hanya update jika ada perubahan struktur (kategori baru, halaman baru).

**Scheduling note:** Jika artikel di-insert sebagai `status='scheduled'`, tidak perlu code deploy. Cron job akan auto-publish saat `published_at <= now()`. Tapi OG images tetap perlu di-generate (Step 5) sebelum atau setelah cron publish.

**Known Vercel serverless issues:**
- `isomorphic-dompurify` crash di Vercel (jsdom dependency). Sudah diganti regex sanitizer di `components/markdown-content.tsx`. Jangan import library ini lagi.
- `cookies()` dari `next/headers` bisa fail di `generateMetadata` saat static generation. Gunakan `createPublicClient` dari `@/lib/supabase/public` (no cookies) untuk page components.

## Step 6.5: SEO Indexing

Submit URL baru ke Google dan cek indexing.

**Submit ke Google Search Console (manual via browser):**
1. Buka https://search.google.com/search-console
2. Masukkan URL: `https://tamparananakmuda.com/artikel/SLUG`
3. Klik "Request Indexing"

**Ping sitemap:**
```bash
curl -s "https://www.google.com/ping?sitemap=https://tamparananakmuda.com/sitemap.xml" && echo "Sitemap pinged"
```

**Cek robots.txt accessible:**
```bash
curl -s -o /dev/null -w "robots: %{http_code}\n" "https://tamparananakmuda.com/robots.txt"
```

**Checklist:**
- [ ] URL submitted ke Google Search Console
- [ ] Sitemap pinged
- [ ] robots.txt HTTP 200

## Step 7: Content Atomization

Pecah artikel jadi format distribusi multi-platform.

### 7a. Instagram Carousel (5-8 slides)
- Slide 1: Hook headline + visual (brand colors, Syne font)
- Slide 2-6: Key data points (1 per slide, max 3 angka per slide)
- Slide 7: Pertanyaan refleksi
- Slide 8: CTA ke full article (`tamparananakmuda.com/artikel/SLUG`)

**Spec:** 1080x1080px, OLED black background, category color accent

### 7b. Newsletter (400-600 words)
- Subject line: 1 insight utama, bukan judul artikel
- Opening: 1 paragraf hook (bukan copy artikel)
- Body: 1 insight + 1 quote yang striking
- Closing: 1 pertanyaan untuk subscriber
- CTA: Link ke full article

**Kirim via:** Brevo dashboard (manual, bukan automated API)

### 7c. IG Stories (3-5 stories)
- Story 1: Polling question terkait topik
- Story 2-3: Key takeaways dengan visual
- Story 4: Q&A sticker
- Story 5: Link sticker ke artikel

### 7d. TikTok/Reels Script (Phase 2)
- Generate via `/api/tiktok/generate-script`
- 30-60 detik, 1 insight per video
- Hook line wajib di 3 detik pertama
- CTA: "Baca full artikel di bio"

### 7e. X/Twitter Thread (3-5 tweets)
- Tweet 1: Hook (1 kalimat tajam + angka/data yang mengejutkan)
- Tweet 2-3: Key insight (1 insight per tweet, max 280 chars, pakai thread numbering)
- Tweet 4: Quote atau data yang striking dari artikel
- Tweet 5: CTA ke full article (`tamparananakmuda.com/artikel/SLUG`)
- Tone: langsung, no fluff, pakai bahasa Indonesia
- Posting: manual via X app atau scheduler (Buffer/Hootsuite)

### 7f. LinkedIn Post (200-400 words)
- Hook line: 1 kalimat yang relevan untuk professional audience (karir, bisnis, keuangan)
- Body: 1 insight utama dengan sudut pandang professional (bukan copy artikel)
- Format: short paragraphs, no bullet spam, conversational tone
- CTA: "Baca analisis lengkapnya di sini: tamparananakmuda.com/artikel/SLUG"
- Hashtags: 3-5 relevant hashtags (contoh: #GenZ #Karir #Mindset #Indonesia)
- Posting: manual via LinkedIn atau scheduler

## Step 8: Distribution Schedule

Jadwalkan distribusi sesuai content calendar.

**Timeline:**
```
Hari 1 (Senin): Publish artikel di website
Hari 2 (Selasa): Post IG Carousel + Stories + X/Twitter thread
Hari 3 (Rabu): Kirim newsletter + LinkedIn post
Hari 4 (Kamis): TikTok/Reels video (jika Phase 2 aktif)
Hari 7 (Senin): Review analytics awal
```

**Tools:**
- IG posting: Manual atau Meta Business Suite
- X/Twitter: Manual via X app atau Buffer/Hootsuite
- LinkedIn: Manual via LinkedIn atau scheduler
- Newsletter: Brevo dashboard
- TikTok: Manual upload (jika Phase 2)

## Step 9: Analytics Tracking

Monitor performa artikel 7 hari setelah publish.

**Metrics to track (via Umami):**
- Page views
- Unique visitors
- Average reading time
- Scroll depth
- Email subscribe rate dari artikel
- Social referral traffic
- Bounce rate

**Events to verify:**
- `article_published` fired saat publish
- `newsletter_sent` fired saat newsletter dikirim
- `tiktok_video_published` fired saat video upload (Phase 2)

**Review schedule:**
- H+1: Cek apakah artikel ter-index Google (site:search)
- H+3: Cek social engagement (likes, shares, saves)
- H+7: Review metrics awal vs target
- H+30: Full performance review, decide if refresh needed

## Step 10: Post-Publish Maintenance

**Monthly:**
- Cek apakah data di artikel masih relevan
- Update jika ada survei baru yang relevan
- Cek internal links masih aktif
- Refresh SEO jika ranking turun

**Quarterly:**
- Review artikel di cluster topik yang sama
- Identifikasi artikel untuk update vs archive
- Plan seri konten baru berdasarkan performa

## Step 11: Rollback Procedure

Jika insert gagal atau artikel salah publish, undo dengan:

**Delete post dari DB:**
```bash
curl -s -X DELETE "$SUPA_URL/rest/v1/posts?slug=eq.SLUG" \
  -H "apikey: $SUPA_KEY" \
  -H "Authorization: Bearer $SUPA_KEY" | node -e "
const d = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
if (d.message) console.error('DELETE FAILED:', d.message);
else console.log('Deleted:', d.length, 'rows');
"
```

**Delete OG images dari R2:**
```bash
# OG images sekarang disimpan di R2, bukan Vercel cache
# Hapus card + feature WebP untuk slug tersebut
curl -s -X DELETE "https://cdn.tamparananakmuda.com/og/SLUG-card.webp"
curl -s -X DELETE "https://cdn.tamparananakmuda.com/og/SLUG-feature.webp"

# Atau jalankan via script (otomatis hapus semua varian OG untuk slug):
npx tsx -e "
require('fs').readFileSync('.env.local','utf8').split('\n').forEach(l => { const i=l.indexOf('='); if(i>0) process.env[l.substring(0,i).trim()] = l.substring(i+1).trim(); });
const { deleteOldOGImages } = require('./lib/cdn/r2');
deleteOldOGImages('SLUG').then(() => console.log('OG images deleted from R2'));
"
```

**Note:** Setelah rollback, slug bisa dipakai ulang karena row sudah dihapus.

## Error Prevention Reference

Bug yang pernah terjadi dan cara mencegah:

| Bug | Penyebab | Pencegahan |
|-----|----------|------------|
| 500 di production (semua artikel) | `post.tags` di-reference di page.tsx tapi kolom tidak ada | Step 0: cek kolom yang ada |
| 500 di production (semua artikel) | `isomorphic-dompurify` crash di Vercel serverless | Sudah diganti regex sanitizer, jangan import lagi |
| `citations.map is not a function` | `source_references` di-insert sebagai string, bukan array | Step 4: verifikasi isArray setelah insert |
| DB insert ditolak | `excerpt` > 160 karakter (constraint violation) | Step 3: cek excerpt length sebelum insert |
| DB insert ditolak | `seo_meta_description` > 160 karakter (constraint violation) | Step 3: cek seo_meta_description length |
| DB insert ditolak (RLS) | Pakai anon key untuk insert | Step 4: selalu pakai service role key |
| 500 setelah deploy | Code belum di-deploy ke production | Step 6: commit + push, tunggu Vercel deploy |
| Artikel tidak muncul di homepage | `published_at` null saat insert | Step 4: WAJIB set `published_at` |
| Artikel tidak punya penulis | `author_id` null saat insert | Step 0: query author_id, Step 4: include di payload |
| TOC kosong di artikel | Heading pakai h1 atau tidak ada h2 | Step 0.5: h2/h3 only, min 3 h2 |
| Internal link kurang dari 2 | Tidak ada validasi internal linking | Step 0.5: cek min 2 link ke `/artikel/` |
| Slug duplikat, insert fail | Tidak cek slug uniqueness sebelum insert | Step 0: cek slug uniqueness |
| Scheduled article muncul sebelum waktunya | Frontend query tidak filter `published_at <= now()` | Semua frontend query sudah pakai `.lte('published_at', new Date().toISOString())` |
| Scheduled article tidak auto-publish | `CRON_SECRET` belum set di Vercel | Set `CRON_SECRET` di Vercel dashboard, verifikasi cron config di `vercel.json` |
| SEO keywords tidak tersimpan | `seo_keywords` column belum ada di DB | Run migration: `ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_keywords text[] DEFAULT null;` |
| Artikel terdeteksi AI-generated | AI vocabulary (EN+ID), staccato drama, copula avoidance, significance inflation, signposting, filler, promotional language | Step 1: jalankan humanizer audit script (15 kategori di `files/HumanizerRules.md`), fix semua FAIL sebelum insert |
| AI vocab Indonesia (signifikan, krusial, mendalam) | Kata-kata formal yang sering dihasilkan AI bahasa Indonesia | Step 1: audit script cek AI vocab ID, ganti dengan kata natural |
| Curly quotes di body | Editor/CMS auto-convert straight quotes | Step 1: cek curly quotes, replace dengan straight quotes |
| Fragmented headers (heading + 1 kalimat restates) | AI pattern: heading diikuti kalimat yang hanya mengulang heading | Step 1: hapus kalimat restates, langsung masuk konten |
| Rule of three overuse | AI pattern: memaksakan 3 item beruntun | Step 1: max 2x per artikel, pecah jadi 2 item atau kalimat terpisah |
| Negative parallelisms ("not only...but also") | AI pattern: konstruksi "tidak hanya...tapi juga" berlebihan | Step 1: rewrite jadi kalimat langsung tanpa parallel construction |
| Aphorism formulas ("X is the Y of Z") | AI pattern: kalimat terdengar profound tapi tidak presisi | Step 1: ganti dengan klaim konkret tanpa formula |
| Vague attribution ("studi menunjukkan") | AI pattern: klaim tanpa sumber spesifik | Step 1: wajib sebut nama studi + tahun + link |
| Generic conclusions ("masa depan cerah") | AI pattern: penutup generic dan tidak spesifik | Step 1: ganti dengan perspektif spesifik TAM |
| OG headline sama dengan title | Copy-paste title ke og_headline, OG image tidak optimal untuk social CTR | Step 0.5: og_headline HARUS berbeda, lebih pendek, punchy, conversational (max 50 chars) |
