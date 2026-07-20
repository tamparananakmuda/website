---
description: Workflow lengkap untuk eksekusi artikel TAM, dari riset topik sampai distribusi multi-platform
---

# Post-Article Execution Workflow

Workflow ini mencakup seluruh pipeline: riset, drafting, QC, insert database, deploy, distribusi, dan maintenance. Setiap step harus complete sebelum lanjut.

## Env Var Reference

**Database (Drizzle ORM):** Project sudah migrasi ke Drizzle ORM. Semua DB operations menggunakan `lib/db/index.ts` yang connect ke PostgreSQL langsung. Env vars DB ada di `.env.local`.

**Supabase (auth only):** Supabase hanya digunakan untuk auth/session (`@supabase/ssr`). Tidak ada lagi Supabase DB queries di project code.

| Env Var | Fungsi | Scope |
|---------|--------|-------|
| `DATABASE_URL` | PostgreSQL connection string untuk Drizzle | Server only |
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase project (auth only) | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (auth only) | Public |
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
export ARTICLE_JSON="/tmp/tam-article.json"
```

**CRITICAL:** Semua DB commands di workflow ini menggunakan Drizzle ORM via `npx tsx -e "..."`. Jangan pakai Supabase REST API (`curl $SUPA_URL/rest/v1/...`) karena sudah deprecated.

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

**Category Reference (updated via migration 000003):**
| Slug | Title | Color |
|------|-------|-------|
| `mindset` | Mindset | #D13A3A |
| `karier` | Karier | #4080D9 |
| `kehidupan` | Kehidupan | #40B880 |
| `uang` | Uang | #D9A040 |
| `bisnis` | Bisnis | #A040D9 |
| `teknologi` | Teknologi | #6040D9 |

**Checklist:**
- [ ] Angle test lolos (kedua pertanyaan)
- [ ] POV tag dipilih
- [ ] Category dipilih
- [ ] Keyword target ditentukan (long-tail, Bahasa Indonesia)
- [ ] Minimal 1 insight unik yang tidak ada di 3 artikel pertama Google

## Step 0: Pre-Flight Database Check

Verifikasi struktur data sesuai schema database aktual. Mencegah error 500 di production.

**Cek koneksi database + slug uniqueness + category + author (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { posts, categories, authors } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); async function check() { const cats = await db.select().from(categories); cats.forEach(c => console.log('CATEGORY:', c.slug, '|', c.title, '| id:', c.id, '| color:', c.color)); const auths = await db.select().from(authors); auths.forEach(a => console.log('AUTHOR:', a.slug, '|', a.name, '| id:', a.id)); const slug = 'SLUG_ARTIKEL'; const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)); console.log(existing.length > 0 ? 'FATAL: SLUG EXISTS' : 'SLUG AVAILABLE: ' + slug); } check().catch(console.error);"
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
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { subcategories } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.select().from(subcategories).where(eq(subcategories.categoryId, 'CATEGORY_UUID')).then(rows => rows.forEach(s => console.log(s.slug + ' | ' + s.title + ' | ' + s.id))).catch(console.error);"
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
- Referensi: `files/templates/article-template.md`, `files/ContentStrategy.md`, `files/ContentCalendar.md`, `files/Payment.md` (untuk CTA "Dukung TAM" di artikel)
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
- Cek artikel relevan via `files/article-inventory.md` (baca file lokal, nggak perlu query DB atau search online)
- Kalau artikel di kategori yang relevan belum ada, link ke category page: `/kategori/[kategori-slug]`

**Markdown Rules:**
- Tidak ada raw HTML `<script>`, `<iframe>`, `<style>` di body
- Gunakan `![alt](url)` untuk gambar, bukan `<img>`
- Link eksternal pakai `[text](url)`, tidak perlu `target="_blank"`
- Jangan tambahkan CTA "Dukung TAM" manual di body artikel. CTA tersebut otomatis muncul di article page (lihat `files/Payment.md` Section 10). Jika ingin referensi donasi di body, cukup link ke `/dukung`.

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

## Step 1.5: Data & Fact Verification (MANDATORY)

Setiap angka, statistik, persentase, dan klaim faktual di artikel WAJIB diverifikasi sebelum lanjut. Tidak boleh ada angka tanpa sumber.

**Kenapa ini penting:**
- Angka yang tidak akurat merusak kredibilitas TAM
- Misinterpretasi data (misal: konflasi korelasi dengan kausalitas) bisa menyesatkan pembaca
- Data outdated masih sering dipakai padahal ada update terbaru
- Cherry-picking data tanpa konteks adalah pola yang harus dihindari

**Proses:**

1. Extract setiap angka/statistik/persentase dari body artikel
2. Map setiap angka ke sumber di `source_references`
3. Verifikasi angka di artikel cocok dengan angka di sumber
4. Flag angka tanpa sumber
5. Cek apakah data masih relevan (tidak outdated)

**Command (extract semua angka dari draft):**
```bash
python3 << 'PYEOF'
import re

body = open('DRAFT_FILE_PATH').read()

# Extract kalimat yang mengandung angka/persentase
sentences = re.split(r'(?<=[.!?])\s+', body)
number_sentences = []
for s in sentences:
    # Cari pola: persentase, rupiah, triliun/miliar/juta, tahun, jumlah
    if re.search(r'\d+[%]|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d{4}|\d+\s*(persen|%)', s, re.I):
        number_sentences.append(s.strip())

print(f'=== DATA & FACT EXTRACTION ===')
print(f'Total sentences with numbers: {len(number_sentences)}')
print()
for i, s in enumerate(number_sentences, 1):
    # Highlight angka
    numbers = re.findall(r'\d+[%]|\d+\s*(?:triliun|miliar|juta|ribu)|Rp[\d.,]+|\d{4}|\d+\s*(?:persen|%)', s, re.I)
    print(f'{i}. Numbers: {numbers}')
    print(f'   Text: {s[:120]}...' if len(s) > 120 else f'   Text: {s}')
    print()

print('=== VERIFICATION CHECKLIST ===')
print('For each number above, verify:')
print('  [ ] Number matches source exactly')
print('  [ ] Source is listed in source_references')
print('  [ ] Source URL is active (Step 2 will check)')
print('  [ ] Data is not outdated (check publication date)')
print('  [ ] No misinterpretation (correlation vs causation)')
print('  [ ] Context is provided (not cherry-picked)')
PYEOF
```

**Command (cross-check angka vs source_references):**
```bash
python3 << 'PYEOF'
import json, re

# Load article JSON
d = json.load(open('ARTICLE_JSON_PATH'))
body = d.get('body', '')
refs = d.get('source_references', [])

print('=== SOURCE COVERAGE CHECK ===')
print(f'Source references: {len(refs)}')
for r in refs:
    print(f'  - {r.get("label", r.get("title", "?"))}: {r.get("url", "?")}')

# Extract semua angka dari body
numbers = re.findall(r'\d+(?:[.,]\d+)?\s*(?:%|persen|triliun|miliar|juta|ribu|orang|rekening|tahun)', body, re.I)
print(f'\nTotal numbers found in body: {len(numbers)}')
print('Numbers:', list(set(numbers)))

# Cek apakah ada angka tanpa atribusi sumber di kalimat yang sama
sentences = re.split(r'(?<=[.!?])\s+', body)
unattributed = []
for s in sentences:
    has_number = bool(re.search(r'\d+[%]|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+', s, re.I))
    has_source = bool(re.search(r'(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat)', s, re.I))
    if has_number and not has_source:
        unattributed.append(s.strip()[:100])

if unattributed:
    print(f'\nWARNING: {len(unattributed)} sentences with numbers but no source attribution:')
    for s in unattributed:
        print(f'  -> {s}...')
else:
    print('\nAll numbers have source attribution in same sentence.')
PYEOF
```

**Checklist Data & Fact Verification:**
- [ ] Setiap angka di body punya sumber yang bisa ditrace
- [ ] Angka di artikel cocok dengan angka di sumber (bukan dibulat-bulat atau diubah)
- [ ] Tidak ada angka tanpa atribusi sumber di kalimat yang sama
- [ ] Data tidak outdated (cek tanggal publikasi sumber, max 2 tahun untuk data ekonomi)
- [ ] Tidak ada misinterpretasi: korelasi tidak diperlakukan sebagai kausalitas
- [ ] Tidak ada cherry-picking: data disajikan dengan konteks yang adil
- [ ] Persentase dijelaskan basisnya (dari berapa sampel, populasi apa)
- [ ] Klaim ekstrem (superlatif: "tertinggi", "terbesar", "pertama") punya sumber kuat
- [ ] Kutipan langsung punya nama + jabatan + institusi (bukan hanya "pakar mengatakan")

**Aturan:**
- Jika angka tidak bisa diverifikasi: **HAPUS angka tersebut** atau ganti dengan klaim yang lebih umum
- Jika sumber outdated (>2 tahun untuk data ekonomi/sosial): cari data terbaru atau beri label tahun (contoh: "data 2023" bukan "data terbaru")
- Jika ada misinterpretasi: rewrite kalimat untuk akurat
- Data & Fact Verification PASS adalah **gate** untuk lanjut ke Step 1.6

## Step 1.6: Humanizer Double Verification (MANDATORY)

Setelah Step 1 audit dijalankan dan fixes diterapkan, WAJIB re-run audit untuk konfirmasi semua issue sudah resolved. Tidak boleh lanjut ke Step 2 sebelum audit kedua CLEAN.

**Kenapa double verification diperlukan:**
- Fix untuk satu issue kadang menimbulkan issue baru (misal: gabung kalimat pendek bisa buat rule-of-three baru)
- Header rename bisa tidak sengaja buat fragmented header baru dengan kalimat pertama
- AI vocab bisa lolos saat paraphrase
- Staccato drama bisa terbentuk ulang saat edit paragraf

**Proses:**

1. Jalankan audit script yang sama dengan Step 1 (python3 humanizer audit) terhadap draft yang sudah di-fix
2. Jika masih ada FAIL: fix issue, re-run audit lagi (bisa berulang sampai CLEAN)
3. Jika CLEAN: catat "Humanizer Double Verification: PASS (round N)" di log
4. Set `human_signature: true` di article JSON hanya setelah double verification PASS

**Command (re-run audit dari file draft markdown langsung):**
```bash
python3 << 'PYEOF'
import re, sys

body = open('DRAFT_FILE_PATH').read()
title = body.split('\n')[0].replace('# ','')
full = body + ' ' + title
issues = []

if '\u2014' in full or '\u2013' in full: issues.append('Em/en dash found')

ai_en = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash']
found_en = [w for w in ai_en if w in body.lower()]
if found_en: issues.append('AI vocab EN: ' + ', '.join(found_en))

ai_id = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri']
found_id = [w for w in ai_id if w in body.lower()]
if found_id: issues.append('AI vocab ID: ' + ', '.join(found_id))

sentences = re.split(r'[.!?]\s+', body)
current_run = max_run = 0
for s in sentences:
    if len(s.split()) <= 6: current_run += 1; max_run = max(max_run, current_run)
    else: current_run = 0
if max_run >= 3: issues.append('Staccato drama (max run: %d)' % max_run)

triples = re.findall(r'(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)', body)
if len(triples) > 2: issues.append('Rule of three: %d' % len(triples))

neg = re.findall(r'(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)', body, re.I)
if neg: issues.append('Negative parallelisms: %d' % len(neg))

if '\u201c' in body or '\u201d' in body: issues.append('Curly quotes')

ing = re.findall(r'(\w+ing (?:the|its|a|this|that))', body)
if len(ing) > 2: issues.append('-ing superficial: %d' % len(ing))

promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket']
found_promo = [w for w in promo if w in body.lower()]
if found_promo: issues.append('Promotional: ' + ', '.join(found_promo))

signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar']
found_signs = [w for w in signs if re.search(w, body, re.I)]
if found_signs: issues.append('Signposting')

fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa']
found_fillers = [w for w in fillers if w in body.lower()]
if found_fillers: issues.append('Filler: ' + ', '.join(found_fillers))

generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas']
found_generic = [w for w in generic if w in body.lower()]
if found_generic: issues.append('Generic conclusion: ' + ', '.join(found_generic))

if body.count('!') > 1: issues.append('Exclamation marks: %d' % body.count('!'))

personal = len(re.findall(r'\bkita\b|\bkamu\b|\bsaya\b', body, re.I))
if personal < 3: issues.append('Human signature weak (kita/kamu/saya: %d)' % personal)

lines = body.split('\n')
for j, line in enumerate(lines):
    if line.startswith('## ') and j+1 < len(lines) and j+2 < len(lines):
        next_line = lines[j+1].strip() if lines[j+1].strip() else (lines[j+2].strip() if j+2 < len(lines) else '')
        if next_line:
            header_words = set(line.replace('#','').lower().split())
            next_words = set(next_line.lower().split())
            overlap = header_words & next_words
            if len(overlap) >= 2:
                issues.append('Fragmented header: "%s"' % line.strip())

words = len(body.split())
print('=== HUMANIZER DOUBLE VERIFICATION ===')
print(f'Word count: {words}')
if issues:
    for i in issues: print('  FAIL:', i)
    print(f'\nTOTAL ISSUES: {len(issues)}')
    print('ACTION: Fix issues above, then re-run this audit.')
    sys.exit(1)
else:
    print('  CLEAN: Double verification PASSED.')
    print('  Safe to proceed to Step 2.')
PYEOF
```

**Checklist Double Verification:**
- [ ] Audit re-run setelah semua fixes dari Step 1 diterapkan
- [ ] Hasil: CLEAN (0 issues)
- [ ] Word count: 1.000-2.500 kata
- [ ] `human_signature: true` di-set di article JSON
- [ ] Catat round number (berapa kali audit dijalankan sampai CLEAN)

**Aturan:**
- Maksimal 5 round audit. Kalau setelah 5 round masih ada issue, hentikan dan review manual.
- Setiap round: fix semua FAIL, re-run audit.
- Jika fix di round N menimbulkan issue baru di round N+1, fix issue baru tersebut juga.
- Double verification PASS adalah **gate** untuk lanjut ke Step 2.

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

Insert artikel ke database via Drizzle ORM. Semua DB operations menggunakan server-side Drizzle queries.

**CRITICAL - Gunakan Drizzle ORM (`npx tsx -e "..."`), bukan Supabase REST API.**

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

**Scheduling Strategy (WAJIB BACA):**
- **Setiap hari harus ada minimal 1 artikel di-publish.** Kalau hari ini sudah publish langsung, artikel berikutnya harus scheduled untuk hari berikutnya.
- **Jam posting ideal:** Pagi 08:00 WIB (01:00 UTC) atau Siang 12:00 WIB (05:00 UTC) atau Sore 17:00 WIB (10:00 UTC)
- **Publish langsung:** `"status": "published"`, `"published_at": "2026-01-01T00:00:00.000Z"` (now atau past)
  - **WARNING: `published_at` HARUS di masa lalu atau sekarang (UTC).** Jika di masa depan, artikel tidak muncul karena query DB memfilter `published_at <= now()`. Gunakan format UTC yang sudah lewat, contoh: `new Date().toISOString()` saat insert.
  - QC harus dilakukan SEBELUM insert (draft review, editorial QC, SEO validation). Begitu insert, langsung live.
- **Scheduled:** `"status": "scheduled"`, `"published_at": "2026-07-18T01:00:00.000Z"` (future date, 08:00 WIB)
  - GitHub Actions cron job berjalan every 5 minutes, auto-publish artikel dengan `status='scheduled'` dan `published_at <= now()`
  - Cron job juga auto-generate OG images untuk setiap artikel yang di-publish
  - Max delay: 5 menit dari waktu scheduled
  - Tidak perlu manual Step 5 (OG generation) untuk scheduled articles
  - Tidak perlu code deploy, cron yang handle publish + OG

**Catatan:**
- `reading_time`: Tidak perlu insert. DB trigger auto-calculate dari body
- `published_at`: WAJIB set. Jika null, artikel tidak muncul di top homepage
- `source_references`: Field di DB pakai `label`, bukan `title`

**Insert command (via Drizzle ORM):**
```bash
npx tsx -e "
const { readFileSync } = require('fs');
const { join } = require('path');

// Load .env.local manually BEFORE requiring DB modules
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.substring(0, eqIdx).trim();
  const value = trimmed.substring(eqIdx + 1).trim();
  if (!process.env[key]) process.env[key] = value;
});

const { db } = require('./lib/db');
const { posts } = require('./lib/db/schema');
const { eq } = require('drizzle-orm');

const article = JSON.parse(readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));

// VALIDASI
if (article.excerpt && article.excerpt.length > 160) {
  console.error('FATAL: excerpt > 160 chars (' + article.excerpt.length + ')'); process.exit(1);
}
if (article.seo_meta_description && article.seo_meta_description.length > 160) {
  console.error('FATAL: seo_meta_description > 160 chars'); process.exit(1);
}
if (!Array.isArray(article.source_references)) {
  console.error('FATAL: source_references must be array'); process.exit(1);
}
if (!article.published_at) {
  console.error('FATAL: published_at is required'); process.exit(1);
}

const [inserted] = await db.insert(posts).values({
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  body: article.body,
  categoryId: article.category_id,
  subcategoryId: article.subcategory_id || null,
  authorId: article.author_id,
  status: article.status === 'scheduled' ? 'scheduled' : 'published',
  seoKeywords: article.seo_keywords || null,
  povTag: article.pov_tag || 'data',
  humanSignature: article.human_signature !== false,
  factCheckStatus: 'verified',
  reviewStatus: 'publish',
  sourceReferences: article.source_references.map((r: any) => ({ type: r.type || 'link', url: r.url, label: r.label || r.title })),
  featured: article.featured || false,
  seoMetaTitle: article.seo_meta_title,
  seoMetaDescription: article.seo_meta_description,
  ogHeadline: article.og_headline || article.title,
  publishedAt: article.published_at || new Date().toISOString(),
}).returning();

console.log('Inserted:', inserted.slug);
console.log('source_references isArray:', Array.isArray(inserted.sourceReferences));
console.log('published_at:', inserted.publishedAt);
if (!Array.isArray(inserted.sourceReferences)) console.error('WARNING: source_references not array!');
if (!inserted.publishedAt) console.error('WARNING: published_at is null!');
"

## Step 4.5: Post-Insert Data Verification

Verifikasi data yang masuk DB sudah benar sebelum lanjut.

**Command (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { posts } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); async function verify() { const result = await db.select().from(posts).where(eq(posts.slug, 'SLUG')); const p = result[0]; if (!p) { console.error('NOT FOUND'); process.exit(1); } console.log('=== Post-Insert Verification ==='); console.log('slug:', p.slug); console.log('status:', p.status); console.log('published_at:', p.publishedAt); console.log('author_id:', p.authorId); console.log('category_id:', p.categoryId); console.log('source_references isArray:', Array.isArray(p.sourceReferences)); console.log('excerpt length:', p.excerpt ? p.excerpt.length : 'null', '(max 160)'); console.log('reading_time:', p.readingTime); console.log('featured:', p.featured); const issues = []; if (!p.publishedAt) issues.push('published_at is null'); if (!p.authorId) issues.push('author_id is null'); if (!p.categoryId) issues.push('category_id is null'); if (!Array.isArray(p.sourceReferences)) issues.push('source_references not array'); if (p.excerpt && p.excerpt.length > 160) issues.push('excerpt > 160'); if (issues.length > 0) { console.error('ISSUES:', issues.join(', ')); process.exit(1); } else { console.log('All checks passed.'); } } verify().catch(console.error);"
```

**Checklist:**
- [ ] Response tidak ada `message` field (error)
- [ ] `source_references` isArray = `true`
- [ ] `published_at` tidak null
- [ ] `author_id` tidak null
- [ ] `category_id` tidak null
- [ ] `excerpt` length <= 160
- [ ] `reading_time` terisi (auto-calculated by trigger)

**Update article inventory (WAJIB):**
Setelah verifikasi lolos, update `files/article-inventory.md` dengan baris baru:
```
| [N] | [Title] | [slug] | [Kategori] | [Pillar] | [POV] | [YYYY-MM-DD] |
```
File ini dipakai workflow untuk internal linking di artikel selanjutnya, jadi harus selalu up-to-date.

## Step 4.6: Scheduling Verification

Jika artikel di-insert dengan `status='scheduled'`, verifikasi scheduling akan berjalan.

**Cek status & published_at (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { posts } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); async function check() { const result = await db.select({ status: posts.status, publishedAt: posts.publishedAt }).from(posts).where(eq(posts.slug, 'SLUG')); const p = result[0]; if (!p) { console.error('NOT FOUND'); process.exit(1); } console.log('status:', p.status); console.log('published_at:', p.publishedAt); if (p.status === 'scheduled') { const now = new Date(); const pubDate = new Date(p.publishedAt!); if (pubDate <= now) { console.error('WARNING: published_at is in the past but status is scheduled! Cron should have published this.'); } else { const minsUntil = Math.ceil((pubDate.getTime() - now.getTime()) / 60000); console.log('Will auto-publish in ~' + minsUntil + ' minutes (GitHub Actions cron runs every 5 min)'); } } else if (p.status === 'published') { console.log('Already published'); } } check().catch(console.error);"
```

**Checklist (if scheduled):**
- [ ] `status` = `scheduled` di DB
- [ ] `published_at` di masa depan
- [ ] `CRON_SECRET` env var set di Vercel dashboard dan GitHub Secrets
- [ ] GitHub Actions workflow `.github/workflows/publish-scheduled.yml` deployed
- [ ] Frontend tidak menampilkan artikel (safety filter `published_at <= now()` aktif)
- [ ] OG images akan auto-generate saat cron publish artikel (tidak perlu manual Step 5 untuk scheduled articles)

**Checklist (if published directly):**
- [ ] `status` = `published` di DB
- [ ] `published_at` di now atau past
- [ ] Artikel muncul di homepage/article list

## Step 5: OG Image Generation (WebP via R2 CDN)

Setelah artikel di-insert, generate OG images ke R2 CDN. Sistem menghasilkan **2 WebP images per post**:
- **Card** (800x450) → `og/{slug}-card.webp` → untuk thumbnail article list
- **Feature** (1600x900) → `og/{slug}-feature.webp` → untuk header artikel + social meta tags

**Note: Untuk artikel scheduled (status='scheduled'), OG images akan di-auto-generate oleh cron job saat artikel di-publish.** Step ini hanya wajib untuk artikel yang di-publish langsung (status='published').

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

**Verify DB updated (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { posts } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.select({ ogCardUrl: posts.ogCardUrl, ogFeatureUrl: posts.ogFeatureUrl, ogImageUrl: posts.ogImageUrl }).from(posts).where(eq(posts.slug, 'SLUG')).then(r => { const p = r[0]; console.log('card:', p?.ogCardUrl); console.log('feature:', p?.ogFeatureUrl); console.log('og:', p?.ogImageUrl); }).catch(console.error);"
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

**Scheduling note:** Jika artikel di-insert sebagai `status='scheduled'`, tidak perlu code deploy. GitHub Actions cron job (every 5 min) akan auto-publish saat `published_at <= now()` dan langsung auto-generate OG images. Tidak perlu manual Step 5 untuk scheduled articles.

**Known Vercel serverless issues:**
- `isomorphic-dompurify` crash di Vercel (jsdom dependency). Sudah diganti regex sanitizer di `components/markdown-content.tsx`. Jangan import library ini lagi.
- `cookies()` dari `next/headers` bisa fail di `generateMetadata` saat static generation. Gunakan server-side Supabase client dari `@/lib/supabase/server.ts` dengan proper error handling.

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
- `donation_cta_click` fired saat user klik CTA "Dukung TAM" di artikel (Phase 2, lihat `files/Payment.md` Section 9)
- `donation_success` fired saat donasi berhasil settled via webhook (Phase 2)

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

**Delete post dari DB (via Drizzle ORM):**
```bash
npx tsx -e "const { readFileSync } = require('fs'); const { join } = require('path'); const envPath = join(process.cwd(), '.env.local'); const envContent = readFileSync(envPath, 'utf8'); envContent.split('\n').forEach((line) => { const t = line.trim(); if (!t || t.startsWith('#')) return; const i = t.indexOf('='); if (i === -1) return; const k = t.substring(0, i).trim(); const v = t.substring(i + 1).trim(); if (!process.env[k]) process.env[k] = v; }); const { db } = require('./lib/db'); const { posts } = require('./lib/db/schema'); const { eq } = require('drizzle-orm'); db.delete(posts).where(eq(posts.slug, 'SLUG')).then(() => console.log('Deleted: SLUG')).catch(console.error);"
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
| DB insert ditolak | Constraint violation (excerpt > 160, seo_meta_description > 160, dll) | Step 4: validasi payload sebelum insert via Drizzle ORM |
| 500 setelah deploy | Code belum di-deploy ke production | Step 6: commit + push, tunggu Vercel deploy |
| Artikel tidak muncul di homepage | `published_at` null saat insert | Step 4: WAJIB set `published_at` |
| Artikel tidak punya penulis | `author_id` null saat insert | Step 0: query author_id, Step 4: include di payload |
| TOC kosong di artikel | Heading pakai h1 atau tidak ada h2 | Step 0.5: h2/h3 only, min 3 h2 |
| Internal link kurang dari 2 | Tidak ada validasi internal linking | Step 0.5: cek min 2 link ke `/artikel/` |
| Slug duplikat, insert fail | Tidak cek slug uniqueness sebelum insert | Step 0: cek slug uniqueness |
| Scheduled article muncul sebelum waktunya | Frontend query tidak filter `published_at <= now()` | Semua frontend query sudah pakai `.lte('published_at', new Date().toISOString())` |
| Scheduled article tidak auto-publish | `CRON_SECRET` belum set atau tidak sinkron antara Vercel dan GitHub Secrets | Set `CRON_SECRET` di Vercel dashboard DAN GitHub Secrets, pastikan nilai sama. Cron dijalankan via GitHub Actions (`.github/workflows/publish-scheduled.yml`), bukan Vercel cron |
| SEO keywords tidak tersimpan | `seo_keywords` column belum ada di DB | Schema Drizzle sudah include `seoKeywords: text('seo_keywords').array()`. Jalankan `npx drizzle-kit push` jika migration belum diapply |
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
