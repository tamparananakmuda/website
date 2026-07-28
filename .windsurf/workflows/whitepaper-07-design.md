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

## Interactive Chart Component System

Whitepaper TAM punya sistem interactive chart yang di-render langsung dari markdown. Tidak perlu buat image statis, upload ke R2, atau embed manual. Cukup tulis `chart:type` code block di markdown.

### Architecture

| Component | File | Role |
|-----------|------|------|
| `WhitepaperContent` | `components/charts/whitepaper-content.tsx` | Server component, parse markdown + chart blocks |
| `WhitepaperChartRenderer` | `components/charts/chart-renderer.tsx` | Client component, render chart via recharts |
| `TAMBarChart` | `components/charts/bar-chart.tsx` | Bar chart dengan TAM theme |
| `TAMLineChart` | `components/charts/line-chart.tsx` | Line chart dengan TAM theme |
| `TAMPieChart` | `components/charts/pie-chart.tsx` | Pie/donut chart dengan TAM theme |
| `TAMStackedBarChart` | `components/charts/stacked-bar-chart.tsx` | Stacked bar chart dengan TAM theme |
| `TAMRadarChart` | `components/charts/radar-chart.tsx` | Radar chart dengan TAM theme |
| `tam-theme.ts` | `components/charts/tam-theme.ts` | Color palette, fonts, shared config |

### TAM Chart Theme

| Element | Value |
|---------|-------|
| Primary (amber) | `#f4a825` |
| Secondary (red) | `#ef4444` |
| Tertiary (blue) | `#3b82f6` |
| Quaternary (green) | `#22c55e` |
| Quinary (purple) | `#a855f7` |
| Grid | `#ffffff0d` |
| Axis | `#ffffff40` |
| Text | `#ffffff80` |
| Tooltip bg | `#0A0A0A` |
| Font | `var(--font-display), system-ui, sans-serif` |

### Chart Block Syntax

Tulis langsung di markdown file:

````markdown
```chart:bar
{"title":"...","subtitle":"...","source":"...","data":[...]}
```
````

Tipe chart yang tersedia: `bar`, `line`, `area`, `pie`, `grouped-bar`, `stacked-bar`, `scatter`, `funnel`, `treemap`, `radar`.

Lihat `/whitepaper-05-draft` untuk contoh lengkap JSON config per chart type.

### Kapan Pakai Interactive Chart vs Static Image

| Scenario | Use | Kenapa |
|----------|-----|--------|
| Data sederhana (3-10 points) | Interactive chart | Cepat, no upload needed, responsive |
| Data kompleks (heatmap, sankey, treemap) | Static image via R2 | Belum ada component |
| Chart untuk social media (quote card, infographic) | Static image via Figma/Canva | Format berbeda dari web |
| Chart untuk PDF download | Static image | PDF tidak render interactive SVG |

### Menambah Chart Type Baru

1. Buat component baru di `components/charts/[type]-chart.tsx`
2. Gunakan `TAM_CHART_COLORS` dan `TAM_CHART_FONTS` dari `tam-theme.ts`
3. Export component dengan prefix `TAM` (contoh: `TAMScatterChart`)
4. Tambahkan ke `chart-renderer.tsx` switch statement
5. Tambahkan type ke `ChartConfig` interface di `whitepaper-content.tsx`
6. Update regex di `splitContent()` jika type baru punya nama dengan karakter khusus

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

## 6-Stage Graph Design Process (Stephen Few)

Setiap chart di whitepaper harus melalui 6 stage:

| Stage | Pertanyaan | Output |
|-------|------------|--------|
| **1. Determine message** | Apa insight yang chart ini komunikasikan? | Message statement |
| **2. Identify data** | Data apa yang dibutuhkan? Dari sumber mana? | Data spec |
| **3. Table vs graph** | Apakah butuh graph, atau tabel cukup? | Format decision |
| **4. Best encoding** | Line length + 2D position = paling powerful untuk quantitative. Color/shape = less effective. | Encoding choice |
| **5. Where to display** | Variable mana di axis mana? X/Y mapping. | Layout spec |
| **6. Feature particular data** | Highlight data point mana yang paling important? | Emphasis design |

### 6-Stage Execution Checklist per Chart

Untuk setiap chart, jawab 6 pertanyaan ini sebelum produksi:

```
Chart: [nama chart]
1. Message: [1 kalimat insight yang chart ini komunikasikan]
2. Data: [source + variabel + periode]
3. Format: [graph / tabel / kedua] + alasan
4. Encoding: [x = ?, y = ?, color = ?, size = ?]
5. Layout: [axis mapping, scale, grid]
6. Emphasis: [data point yang di-highlight + cara highlight]
```

Jika 1 stage tidak bisa dijawab: chart belum siap produksi.

## Chart Quality Score (0-12)

Score setiap chart sebelum publish. Target: minimal 8.

| Factor | 0 (fail) | 1 (weak) | 2 (strong) |
|--------|----------|----------|------------|
| **Message clarity** | Tidak jelas insight apa | Insight ada tapi buried | Conclusion-titled, 1 insight |
| **Data accuracy** | Data tidak match source | Data match tapi rounding tidak dijelaskan | Exact match + rounding explained |
| **Encoding appropriateness** | Wrong chart type | Chart type OK tapi suboptimal | Optimal encoding untuk data type |
| **Emphasis** | No highlight | Highlight ada tapi tidak clear | Key data point突出, rest muted |
| **Label completeness** | Missing axis/legend | Sebagian ada | Title + axis + legend + source |
| **Color discipline** | Rainbow / too many colors | 3-5 colors tapi tidak konsisten | Max 5 colors, soft base + bright emphasis |
| **Cognitive load** | Cluttered, > 7 components | 5-7 components | Max 5-7, "Others" untuk sisanya |
| **Accessibility** | No contrast, no alt text | Contrast OK tapi no alt text | WCAG AA contrast + alt text |
| **Text integration** | Chart berdiri sendiri | Chart disebut tapi tidak di-integrate | Data di chart = data di narasi |
| **Conclusion title** | "Chart 1" / "Data X" | Descriptive tapi bukan insight | Insight sebagai title |
| **Source citation** | No source | Source disebut tapi tidak spesifik | Source + tahun + akses tanggal |
| **Redundancy check** | Chart ulang info yang sama di text | Sebagiane overlap | Chart + text saling melengkapi |

Jika score < 8: revisi chart atau hapus. Whitepaper tidak butuh chart yang tidak komunikatif.

## Data Visualization Integrity Check

Pastikan chart tidak menyesatkan reader:

| Check | Pertanyaan | Jika gagal |
|-------|------------|-----------|
| **Y-axis scale** | Bar chart Y-axis mulai dari 0? | Fix scale (misleading jika tidak) |
| **Truncated axis** | Apakah axis dipotong untuk exaggerate? | Hanya jika justified + label "axis break" |
| **Cherry-picked range** | Apakah time range dipilih untuk bias? | Tunjukkan full range atau explain pilihan |
| **Proportion distortion** | Apakah pie chart proportion accurate? | Verify total = 100% |
| **Correlation vs causation** | Apakah chart imply causation? | Tambah caveat jika korelasi saja |
| **Sample size hidden** | Apakah n disebutkan? | Tambah n jika < 1.000 |
| **Missing baseline** | Apakah ada comparison baseline? | Tambah baseline (tahun sebelumnya, average, target) |
| **Dual axis** | Apakah dual axis misleading? | Hindari dual axis, atau label sangat jelas |

**TAM principle:** Chart harus jujur. Tidak boleh exaggerate untuk dramatic effect. Jika data tidak dramatic, tidak boleh dibuat dramatic via visual trick.

## Chart-Text Integration Protocol

Chart dan text saling melengkapi, bukan redundant:

| Pattern | Cara | Contoh |
|---------|------|--------|
| **Chart as evidence** | Text membuat claim, chart sebagai proof | "74% lulusan menganggur (Chart 1)." Chart menampilkan data. |
| **Chart as context** | Chart memberi konteks, text interpretasi | Chart: trend 2020-2025. Text: "Trend naik tajam setelah 2023." |
| **Chart as comparison** | Chart bandingkan, text highlight gap | Chart: freelance vs tetap. Text: "Gap BPJS coverage: 78% vs 12%." |
| **Chart standalone** | Chart self-explanatory, text hanya refer | "Seperti chart di bawah menunjukkan..." lalu chart berbicara sendiri. |

**Jangan:** Chart dan text mengatakan hal yang sama dengan cara yang sama. Redundancy = cognitive waste.

### Annotation Strategy

| Annotation type | Kapan dipakai | Contoh |
|----------------|---------------|--------|
| **Callout label** | Highlight 1 key data point | "74%" dengan arrow ke bar tertinggi |
| **Reference line** | Tambah context line | Average line, target line, threshold |
| **Shaded region** | Highlight periode/event penting | Shaded area untuk "Pandemi 2020-2021" |
| **Data label** | Direct label pada bar/point | Angka di atas bar, no need legend |
| **Trend arrow** | Indikasi arah perubahan | Panah naik/turun dengan % change |

Max 2 annotation per chart. Lebih dari 2 = clutter.

## Perceptual Edge Design

| Principle | Application di whitepaper |
|-----------|--------------------------|
| **Preattentive processing** | Color, shape, position = perceived tanpa conscious effort. Design untuk instant comprehension. |
| **Max 5-7 components** | Short-term memory limit. >7 colored lines = reader tidak bisa hold meaning. Sisanya jadi "Others". |
| **Soft colors + bright emphasis** | Low-saturated colors untuk base. Reserve bright/dark untuk emphasis point. |
| **Remove distractions** | Background maps, unnecessary grid lines, jumble of bright colors = harm communication. Hapus. |
| **Conclusion-titled charts** | Judul = insight, bukan "Chart 1". "74% Lulusan Menganggur" bukan "Data Pengangguran". |
| **No redundant info** | Jangan ulang info yang sama di text + visual (redundancy effect). |

## Color System for Data Visualization

Aturan warna yang strict untuk semua chart:

| Role | Color | Hex | Kapan dipakai |
|------|-------|-----|---------------|
| **Emphasis** | TAM Red | `#E63946` | Key data point, highlight, callout |
| **Base series 1** | Slate | `#71717A` | Data utama (non-highlight) |
| **Base series 2** | Slate light | `#A1A1AA` | Data sekunder |
| **Base series 3** | Slate dark | `#52525B` | Data tersier |
| **Comparison A** | Muted blue | `#4A6FA5` | Group A dalam comparison |
| **Comparison B** | Muted amber | `#B08968` | Group B dalam comparison |
| **Background** | OLED Black | `#0A0A0A` | Chart background |
| **Grid lines** | Subtle | `#27272A` | Grid (minimal, hanya jika perlu) |
| **Text** | White | `#FFFFFF` | Title, labels |
| **Source text** | Dim | `#71717A` | Citation di bawah chart |

**Dilarang:**
- Rainbow palette (6+ warna berbeda)
- Red + green bersamaan (color blindness)
- Pure saturated colors untuk base series
- Lebih dari 1 emphasis color per chart

## Typography in Charts

| Element | Font | Size | Color | Rule |
|---------|------|------|-------|------|
| **Chart title** | Syne Bold 700 | 18-24px | `#FFFFFF` | Conclusion-first, max 60 char |
| **Subtitle** | Jakarta Sans | 12-14px | `#A1A1AA` | Context, opsional |
| **Axis label** | Jakarta Sans | 10-12px | `#A1A1AA` | Singkat, unit di label |
| **Data label** | JetBrains Mono | 10-12px | `#FFFFFF` | Angka di bar/point |
| **Legend** | Jakarta Sans | 10-12px | `#A1A1AA` | Hanya jika > 1 series |
| **Source citation** | Jakarta Sans | 8-9px | `#71717A` | "Sumber: BPS, 2025" |
| **Annotation** | Jakarta Sans | 10-12px | `#E63946` | Callout, max 2 per chart |

**Aturan:**
- Font size hierarchy: title > subtitle > axis/legend > source
- Jangan pakai bold untuk body text di chart (hanya title)
- Angka di data label: JetBrains Mono untuk alignment
- Max 3 font sizes per chart (title, body, source)

## Accessibility Standards (WCAG AA)

Setiap chart harus accessible:

| Standard | Requirement | Cara verify |
|----------|-------------|-------------|
| **Color contrast** | Min 4.5:1 untuk text, 3:1 untuk large text dan graphics | Contrast checker |
| **Color blindness** | Informasi tidak rely pada color saja | Test dengan simulator (deuteranopia, protanopia) |
| **Alt text** | Setiap gambar punya alt text deskriptif | `<img alt="Bar chart: 74% lulusan menganggur vs 26% employed, BPS 2025">` |
| **Text alternative** | Data di chart juga ada di text | Reader screen reader bisa akses data tanpa chart |
| **Readable at 200%** | Chart masih understandable di 200% zoom | Test zoom browser |
| **No color-only encoding** | Pattern/label sebagai backup untuk color | Tambah pattern atau direct label |

**Alt text format:** "[Chart type]: [key insight], [source]."

## Mobile-First Chart Design

Whitepaper bisa di-read di mobile. Chart harus readable di small screen:

| Rule | Cara | Kenapa |
|------|------|-------|
| **Min font 10px** | Axis label, data label tidak boleh < 10px | Readability di mobile |
| **Simplify untuk mobile** | Max 5 components di mobile view | Small screen limit |
| **Stack vertical** | Legend di bawah chart, bukan di samping | Mobile portrait |
| **Touch-friendly** | Data label direct di bar/point, no hover-only | Mobile tidak ada hover |
| **Responsive sizing** | Chart width 100% container, height fixed | Adapt ke screen |
| **Test di 375px** | Test render di iPhone SE width | Worst case screen |

## Content Atomization Visual Assets

Eksekusi extraction points dari 04-outline. Buat visual assets untuk derivative content:

| Asset | Source | Format | Tool |
|-------|--------|--------|------|
| **Quote card 1** | Data paling striking dari Executive Summary | 1080x1080 | Figma/Canva |
| **Quote card 2** | Kontra-narasi claim dari Analysis | 1080x1080 | Figma/Canva |
| **Carousel** | 3-5 key steps dari Recommendation | 1080x1080 x 8-12 | Figma/Canva |
| **Infographic** | Key chart + summary | 1080x1920 | Figma/Canva |
| **Thread cards** | Narrative arc dari Analysis | 1200x675 per tweet | Figma/Canva |

Pre-production: extraction points sudah ditandai di 04-outline. Eksekusi di step ini, bukan cari setelah draft selesai.

### Derivative Content Quality Standards

Setiap visual asset harus pass quality bar:

| Standard | Quote card | Carousel | Infographic | Thread card |
|----------|-----------|----------|-------------|-------------|
| **Brand mark** | Wajib | Wajib | Wajib | Wajib |
| **Data citation** | Wajib | Wajib | Wajib | Wajib |
| **Max text** | 20 kata | 30 kata/slide | 50 kata total | 15 kata/card |
| **Color** | TAM palette | TAM palette | TAM palette | TAM palette |
| **Font** | Syne + Jakarta | Syne + Jakarta | Syne + Jakarta | Syne + Jakarta |
| **Contrast** | WCAG AA | WCAG AA | WCAG AA | WCAG AA |
| **CTA** | Link ke whitepaper | Swipe prompt | Link + QR | Thread continuation |
| **Standalone** | Bisa tanpa whitepaper context | Bisa tanpa whitepaper | Bisa tanpa whitepaper | Bisa tanpa whitepaper |

**TAM rule:** Derivative content tidak boleh clickbait. Data di asset harus match data di whitepaper. Tidak boleh exaggerate untuk engagement.

## Layered Reading Visual Design

Visual cues untuk 3 layer reader:

| Layer | Visual cue | Design |
|-------|-----------|--------|
| **Skim (5 min)** | Bolded key findings, pull quotes, charts, section headings | Key insights visible tanpa baca body |
| **Strategic (20-30 min)** | First paragraph per section, charts, Recommendations | Conclusion-first opening per section |
| **Deep (1-2 hours)** | Full read, Methodology, Limitations, references | Detail tersedia untuk verify |

Pull quotes = preattentive "scent markers" untuk information foraging. Tempatkan 1 per 500 kata.

### Visual Hierarchy Architecture

Sistem hierarchy visual yang konsisten di seluruh whitepaper:

```
Level 1: H2 heading (Syne Bold, 28px, white)
  Level 2: H3 heading (Syne Bold, 22px, white)
    Level 3: Body text (Jakarta Sans, 16px, white)
      Level 4: Bold key finding (Jakarta Sans Bold, 16px, white)
      Level 5: Pull quote (Jakarta Sans Italic, 18px, slate grey)
      Level 6: Data label (JetBrains Mono, 14px, white)
        Level 7: Source citation (Jakarta Sans, 12px, dim grey)
        Level 8: Annotation (Jakarta Sans, 12px, TAM red)
```

**Aturan:**
- Size contrast antar level: minimal 4px difference
- Color hierarchy: white > slate grey > dim grey
- Bold hanya untuk key findings dan emphasis, bukan entire paragraph
- Italic hanya untuk pull quotes
- TAM red hanya untuk annotation dan emphasis point

## Cognitive Load Visual Management

| Technique | Visual application |
|-----------|-------------------|
| **Section breaks** | Visual breathing room setiap 300-500 kata. Spacer, divider, atau full-width chart. |
| **Visual hierarchy** | H2 > H3 > body text. Size contrast = cognitive cue untuk importance level. |
| **Progressive disclosure** | Simple chart dulu, complex chart kemudian. Jangan front-load semua visual complexity. |
| **Split-attention avoidance** | Jangan paksa reader lihat chart + text + footnote sekaligus. Integrate annotation ke chart. |

## Chart Inventory Audit

Sebelum finalize, audit semua chart di whitepaper:

| Chart # | Section | Type | Message | Source | Quality Score | Integrity Check |
|---------|---------|------|---------|--------|---------------|-----------------|
| 1 | Background | Line | Trend pengangguran 2020-2025 | BPS | __/12 | Pass/Fail |
| 2 | Analysis Arg 1 | Bar | 74% vs 26% gap | BPS | __/12 | Pass/Fail |
| 3 | Analysis Arg 2 | Comparison | Freelance vs tetap BPJS | OJK | __/12 | Pass/Fail |
| ... | ... | ... | ... | ... | ... | ... |

**Aturan:**
- Setiap chart harus punya entry di inventory
- Quality Score > 8 untuk publish
- Integrity Check harus Pass
- Jika chart tidak advance argument: hapus

## PDF Layout (jika akan di-download)

- Cover page dengan title + subtitle + brand mark
- Table of contents
- Section breaks dengan heading yang jelas
- Page numbers
- Footer: `tamparananakmuda.com`

## Checklist

- [ ] Brand colors reference dipakai untuk semua visual
- [ ] Chart types sesuai dengan data type
- [ ] 6-stage graph design process applied per chart (message, data, format, encoding, layout, emphasis)
- [ ] 6-stage execution checklist diisi per chart
- [ ] Chart Quality Score: > 8 per chart (dari 12)
- [ ] Data Visualization Integrity Check: 8 checks passed per chart
- [ ] Chart-Text Integration: 4 patterns applied, no redundancy
- [ ] Annotation Strategy: max 2 annotation per chart
- [ ] Perceptual edge: max 5-7 components, soft colors + bright emphasis, conclusion-titled charts
- [ ] No redundant info (text + visual redundancy effect dihindari)
- [ ] Color System: TAM palette, no rainbow, no red+green, max 1 emphasis color
- [ ] Typography in Charts: 3 font sizes max, Syne title + Jakarta body + Mono data
- [ ] Accessibility: WCAG AA contrast, alt text, color blindness safe, no color-only encoding
- [ ] Mobile-First: min 10px font, max 5 components, legend stacked, test di 375px
- [ ] Content atomization visual assets dibuat (quote cards, carousel, infographic, thread cards)
- [ ] Derivative Content Quality Standards: 8 standards passed per asset
- [ ] Layered reading visual design: bolded findings, pull quotes (1 per 500 kata), section headings
- [ ] Visual Hierarchy Architecture: 8 levels, size contrast > 4px, color hierarchy
- [ ] Cognitive load visual management: section breaks, visual hierarchy, progressive disclosure
- [ ] Chart Inventory Audit: setiap chart tercatat, Quality Score > 8, Integrity Pass
- [ ] Cover page dibuat (jika PDF download)
- [ ] Infographic summary dibuat (1-page untuk social)
- [ ] Image upload ke R2 CDN (jika ada gambar)
- [ ] `coverImageUrl` di-set di `$ARTICLE_JSON` (jika ada cover)
- [ ] Data viz best practices applied
- [ ] Layout PDF final (jika ada downloadUrl)
- [ ] Visual konsisten dengan brand TAM

## Next

Lanjut ke `/whitepaper-08-build`
