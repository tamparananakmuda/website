---
description: Artikel step 08 - Perbaiki flow, hilangkan pola AI, tambahkan contoh, natural tone
---

# 08-humanizer

Perbaiki flow, hilangkan pola AI, tambahkan contoh, natural tone.

## Prev

Dari `/artikel-07-qc`

## Humanizer rules lengkap

Lihat `files/HumanizerRules.md` (single source of truth, 15 kategori).

## Tabel Pengganti Kata AI

Ganti kata formal AI dengan kata natural:

| Kata AI (ID) | Ganti dengan |
|--------------|-------------|
| signifikan | penting, nyata, besar |
| krusial | kunci, utama, inti |
| esensial | perlu, harus ada |
| vital | penting, kunci |
| mendalam | teliti, detail |
| memperhatikan | perhatikan, cermati |
| pada dasarnya | aslinya, sebenarnya |
| secara fundamental | mendasar, dari akar |
| pada intinya | intinya, pokoknya |
| pada akhirnya | akhirnya, ujungnya |
| menariknya | yang menarik |
| perlu dicatat | catat |
| perlu diingat | ingat |
| tidak dapat dipungkiri | memang, jelas |

| Kata AI (EN) | Ganti dengan |
|--------------|-------------|
| crucial | key, important |
| pivotal | central, key |
| vibrant | lively, active |
| tapestry | mix, blend |
| delve | dig, explore |
| showcase | show, highlight |
| underscore | show, prove |
| testament | proof, sign |
| foster | build, grow |
| garner | get, earn |
| intricate | complex, detailed |
| landscape | scene, world |
| additionally | also, plus |
| enduring | lasting, long |
| enhance | improve, boost |
| highlight | show, point out |
| interplay | interaction, mix |
| multifaceted | many-sided, complex |
| nuanced | subtle, detailed |
| robust | strong, solid |
| holistic | overall, full |
| paradigm | model, approach |
| leverage | use, tap |
| realm | area, field |
| seamless | smooth, easy |
| empower | enable, help |
| transform | change, shift |
| unlock | open, free |
| unleash | release, let loose |

## Yang diperbaiki di step ini

### 1. Flow kalimat
Perbaiki transisi yang terlalu formal/robotik.

**Before:** "Selain itu, penting untuk dicatat bahwa fenomena ini memiliki dampak yang signifikan."
**After:** "Fenomena ini punya dampak besar."

**Before:** "Tidak hanya itu, tetapi juga perlu diperhatikan bahwa..."
**After:** "Ada satu hal lagi..."

### 2. Hilangkan pola AI

**Staccato drama (3+ kalimat pendek berturut-turut):**
- Before: "Kamu kerja keras. Kamu taat aturan. Kamu pikir kamu aman. Tapi tidak."
- After: "Kamu kerja keras, taat aturan, pikir kamu aman. Tapi tidak."

**Rule of three abuse (>2x per artikel):**
- Before: "Kerja keras, disiplin, dan dedikasi. Komitmen, konsistensi, dan kesabaran."
- After: "Kerja keras dan disiplin. Komitmen dan konsistensi." (max 2 triples)

**Negative parallelisms:**
- Before: "Tidak hanya tentang uang, tapi juga tentang waktu."
- After: "Soal uang dan waktu."

**Fragmented headers (heading mirip kalimat pertama):**
- Before: `## Kerja Keras Tidak Menjamin Aman` lalu kalimat pertama "Kerja keras tidak menjamin kamu aman."
- After: Ganti heading jadi `## Ilusi Kerja Keras` atau ganti kalimat pertama.

### 3. Tambahkan contoh konkret
Ganti klaim abstrak dengan contoh spesifik.

- Before: "Banyak generasi muda mengalami kesulitan finansial."
- After: "Dari 10 teman saya yang lulus kuliah 2023, 7 masih tinggal dengan orang tua karena gaji tidak cukup bayar kos."

### 4. Natural tone
Ganti kata formal AI dengan tabel pengganti di atas.

### 5. Human signature
Pastikan minimal 1 paragraf pengalaman/observasi/opini spesifik.

**Teknik menambah human signature:**
- **Pengalaman personal:** "Saya ingat saat pertama kali di-PHK. Perasaan bukan marah, tapi bingung."
- **Observasi spesifik:** "Di kantor saya, 3 dari 5 anak muda sudah punya side hustle sebelum umur 25."
- **Opini tajam:** "Menurut saya, masalahnya bukan generasi yang malas, tapi sistem yang tidak memberi ruang."

## Command auto-check pola AI (humanizer-specific)

```bash
export ARTICLE_JSON="/tmp/tam-article.json"
node -e "
const fs = require('fs');
const a = JSON.parse(fs.readFileSync(process.env.ARTICLE_JSON || '/tmp/tam-article.json', 'utf8'));
const body = a.body || '';
const issues = [];

// Em/en dash
if (body.includes('\u2014') || body.includes('\u2013')) issues.push('Em/en dash found');

// Curly quotes
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('Curly quotes');

// Exclamation marks
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');

// AI vocab EN
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

// AI vocab ID
const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

// Staccato drama
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama (max run: ' + maxRun + ')');

// Rule of three
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');

// Negative parallelisms
const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also|it.s not just.*it.s)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

// Promotional
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','state-of-the-art','world-class','seamless','empower','transform','unlock','unleash','supercharge','skyrocket'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

// Signposting
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

// Fillers
const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

// Generic conclusions
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

// Human signature
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak (kita/kamu/saya: ' + personal + ', need 3+)');

// Fragmented headers
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      if ([...hw].filter(w => nw.has(w)).length >= 2) issues.push('Fragmented header: \"' + lines[i].trim() + '\"');
    }
  }
}

console.log('=== HUMANIZER CHECK ===');
if (issues.length) {
  console.log('FAIL (' + issues.length + '):');
  issues.forEach(i => console.log('  - ' + i));
  process.exit(1);
} else {
  console.log('CLEAN: All humanizer checks passed.');
}
"
```

## Setelah humanizer

1. Set `human_signature: true` di article JSON
2. **WAJIB re-run `/artikel-07-qc`** untuk verifikasi semua pola AI sudah hilang
3. Jika QC audit masih FAIL, kembali ke step ini, fix, re-run. Maksimal 5 round.

## Checklist

- [ ] No em dash, no en dash, no curly quotes
- [ ] No AI vocab EN/ID (cek via command di atas)
- [ ] No staccato drama, rule-of-three abuse (>2x), negative parallelisms
- [ ] No promotional language, signposting, filler, generic conclusions
- [ ] Max 1 exclamation mark
- [ ] Human signature: minimal 1 paragraf pengalaman/observasi/opini spesifik
- [ ] Tone: jujur, rasional, berani, tidak menggurudi
- [ ] `human_signature: true` di JSON
- [ ] Re-run `/artikel-07-qc` dan hasil CLEAN

## Next

Lanjut ke `/artikel-09-publish`
