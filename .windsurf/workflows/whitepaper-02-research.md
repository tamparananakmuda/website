---
description: Whitepaper step 02 - Literature review, data collection, expert interviews, statistical analysis, dan triangulation
---

# 02-research

Literature review, data collection, expert interviews, statistical analysis, dan triangulation.

## Prev

Dari `/whitepaper-01-idea`

## Research Architecture (7 lapis)

Whitepaper TAM bukan sekadar "kumpulkan data". Riset harus melalui 7 lapis:

### Lapis 1: Literature Review (akademik + industry)
### Lapis 2: Government Data Mining (BPS, OJK, BI, Kemenkes, dll.)
### Lapis 3: International Benchmarking (ASEAN, global)
### Lapis 4: Expert Interviews / Stakeholder Input
### Lapis 5: Primary Data Collection (jika feasible)
### Lapis 6: Statistical Analysis & Triangulation
### Lapis 7: Synthesis & Gap Identification

Setiap lapis punya metodologi sendiri. Tidak semua lapis harus dilakukan (tergantung topik), tapi minimum 5 dari 7 lapis WAJIB.

---

## Lapis 1: Literature Review

### Academic Literature Search

| Database | URL | Cara search | Focus |
|----------|-----|-------------|-------|
| Google Scholar | scholar.google.com | `keyword + Indonesia + site:.ac.id OR site:.org` | Jurnal Indonesia |
| Semantic Scholar | semanticscholar.org | `keyword + Indonesia` | AI-powered search |
| DOAJ | doaj.org | `keyword + Indonesia` | Open access journals |
| SSRN | ssrn.com | `keyword + Indonesia OR Southeast Asia` | Working papers |
| ResearchGate | researchgate.net | Cari author/keyword | Pre-prints, data |

### Literature Review Process

1. **Search:** 20-30 paper relevan (keyword dari 01-idea)
2. **Screen:** Baca abstract, filter ke 10-15 paper paling relevan
3. **Deep read:** Full read 5-8 paper terpilih
4. **Extract:** Untuk setiap paper, catat:

| Paper | Tahun | Methodology | Key finding | Sample size | Limitation | Relevan ke hypothesis |
|-------|------|-------------|-------------|-------------|------------|----------------------|
| [Author] | 2024 | [Kuantitatif/kualitatif] | [finding] | [n=] | [limitation] | [H1/H2/H3] |

### Citation Tracking

Dari 5-8 paper terpilih, lakukan **backward citation tracking** (baca paper yang mereka cite) dan **forward citation tracking** (cari paper yang cite mereka). Tujuan: menemukan foundational papers dan update terbaru.

### Industry Report Search

| Sumber | Tipe | URL |
|--------|------|-----|
| McKinsey | Industry report | mckinsey.com/industries |
| Deloitte | Industry report | deloitte.com/insights |
| BCG | Industry report | bcg.com/publications |
| Bain | Industry report | bain.com/insights |
| WEF | Global report | weforum.org/reports |
| McKinsey Indonesia | Indonesia-specific | mckinsey.com/id/industries |
| Google/Temasek/Bain | e-Conomy SEA | ekonomi digital SEA |
| We Are Social | Digital/social | wearesocial.com |
| Statista | Data aggregator | statista.com (free tier) |
| Katadata Insight Center | Indonesia data | katadata.co.id/insight |

### Literature Review Output

```markdown
### Literature Review Summary

#### Academic Papers (5-8 terpilih)
| # | Paper | Tahun | Method | Key finding | Relevan ke |
|---|-------|------|--------|-------------|------------|
| 1 | [Author, "Title"] | 2024 | [method] | [finding] | H1 |
| 2 | ... | | | | |

#### Industry Reports (3-5 terpilih)
| # | Report | Publisher | Tahun | Key data | Relevan ke |
|---|--------|-----------|------|----------|------------|
| 1 | [Title] | McKinsey | 2025 | [data] | H2 |

#### Research Gap Identified
- [Gap 1: apa yang belum diteliti]
- [Gap 2: apa yang belum dianalisis untuk Indonesia]
- [Gap 3: apa angle yang belum pernah dibahas]
```

---

## Lapis 2: Government Data Mining

### Primary Government Data Sources

| Kategori | Sumber | URL | Tipe data | Update frequency |
|----------|--------|-----|-----------|------------------|
| Makro ekonomi | BPS | bps.go.id | Demografi, tenaga kerja, inflasi | Bulanan/Tahunan |
| Keuangan | OJK | ojk.go.id | Perbankan, fintech, literasi keuangan | Bulanan/Tahunan |
| Moneter | Bank Indonesia | bi.go.id | Suku bunga, payment systems, UMKM | Bulanan |
| Ketenagakerjaan | Kemnaker | kemnaker.go.id | Data pekerjaan, pelatihan | Tahunan |
| Pendidikan | Kemendikbud | kemendikbud.go.id | Data pendidikan, lulusan | Tahunan |
| Kesehatan | Kemenkes | kemkes.go.id | Data kesehatan, SKI | 5 tahunan |
| Sosial | Kementerian Sosial | kemsos.go.id | Data bantuan sosial | Tahunan |
| Kominfo | Kominfo | kominfo.go.id | Data digital, internet | Tahunan |

### Data Extraction Process

1. **Identifikasi dataset:** Publikasi mana yang punya data relevan?
2. **Download/akses:** BPS publikasi (PDF/Excel), OJK statistik, dll.
3. **Extract angka kunci:** Untuk setiap dataset, catat:

| Data point | Sumber | Tahun | URL | Sample size | Methodology | Limitation |
|------------|--------|------|-----|-------------|-------------|------------|
| [angka] | BPS Sakernas | 2024 | [URL] | n=70.000 | Survei | Tidak cover informal sector fully |

### Data Freshness Rules

| Tipe data | Max age | Exception |
|-----------|---------|-----------|
| Ekonomi/makro | 2 tahun | Jika tren 5-year lebih relevan |
| Demografi | 5 tahun | Sensus 10-yearan |
| Kesehatan | 5 tahun | SKI 5-yearan |
| Digital/tech | 1 tahun | Perubahan cepat |
| Ketenagakerjaan | 2 tahun | Jika ada structural change |

Jika data > 5 tahun dan tidak ada update, flag sebagai limitation.

---

## Lapis 3: International Benchmarking

### Benchmark Sources

| Tipe | Sumber | URL | Focus |
|------|--------|-----|-------|
| Global macro | World Bank | data.worldbank.org | GDP, employment, demographics |
| Labor | ILO | ilostat.ilo.org | Employment, wages, gig economy |
| OECD | OECD | data.oecd.org | Advanced economy comparison |
| UN | UNDP | hdr.undp.org | Human development |
| ASEAN | ASEANstats | data.aseanstats.org | Regional comparison |
| McKinsey | McKinsey Global Institute | mckinsey.com/mgi | Industry trends |
| WEF | World Economic Forum | weforum.org | Global risks, future of work |

### Benchmarking Framework

Pilih 3-5 negara benchmark:

| Negara | Kenapa dipilih | Data apa yang dibandingkan |
|--------|---------------|---------------------------|
| [Negara 1] | [Similar GDP / region / structure] | [Data point yang dibandingkan] |
| [Negara 2] | [Different stage of development] | [Data point] |
| [Negara 3] | [Best practice / policy innovation] | [Data point] |

### Comparison Output

```markdown
### International Benchmark

| Metric | Indonesia | [Negara 1] | [Negara 2] | [Negara 3] | Source |
|--------|-----------|-----------|-----------|-----------|--------|
| [Metric 1] | [value] | [value] | [value] | [value] | [source] |
| [Metric 2] | [value] | [value] | [value] | [value] | [source] |

### Key Insight dari Benchmark
- [Insight 1: apa yang Indonesia beda]
- [Insight 2: apa yang bisa dipelajari]
- [Insight 3: apa yang Indonesia unik]
```

---

## Lapis 4: Expert Interviews / Stakeholder Input

### Expert Identification

Identifikasi 3-5 expert/stakeholder untuk input:

| Tipe expert | Cara kontak | Pertanyaan utama |
|-------------|-------------|------------------|
| Akademisi | Email dari jurnal yang dibaca | Validasi interpretasi data |
| Industry practitioner | LinkedIn / network | Realitas lapangan vs data |
| Policy maker | Email resmi / network | Konteks regulasi, rencana kebijakan |
| NGO/think tank | Email / public contact | Data tambahan, perspective grassroots |
| International expert | Email / academic network | Benchmark internasional |

### Interview Protocol

**Tipe:** Semi-structured, 30-45 menit

**Pertanyaan utama (adaptasi per topik):**
1. "Dari pengalaman Anda, apakah data [X] konsisten dengan realitas lapangan?"
2. "Apa faktor yang tidak terlihat dari data tapi penting untuk memahami [topik]?"
3. "Apa yang salah dari narasi publik tentang [topik]?"
4. "Apa rekomendasi praktis yang bisa diimplementasi?"
5. "Apa data atau riset yang masih gap di area ini?"

**Output per interview:**

```markdown
### Interview: [Nama, Title, Organisasi]
**Tanggal:** [date]
**Durasi:** [menit]

**Key insights:**
- [Insight 1]
- [Insight 2]
- [Insight 3]

**Quotes yang bisa dipakai:**
- "[Quote 1]"
- "[Quote 2]"

**Data tambahan yang diberikan:**
- [Data/riset yang expert share]
```

Catatan: Jika expert interview tidak feasible, minimal lakukan 3-5 email correspondence untuk validasi data dan dapatkan perspective tambahan.

---

## Lapis 5: Primary Data Collection (opsional, jika feasible)

### Kapan Primary Data Diperlukan

| Kondisi | Primary data perlu? |
|---------|---------------------|
| Data sekunder tidak ada untuk Indonesia | Ya |
| Data sekunder outdated (> 5 tahun) | Ya |
| TAM punya akses ke audience untuk survei | Ya |
| Topik baru yang belum pernah diteliti | Ya |
| Data sekunder cukup dan terbaru | Tidak perlu |

### Primary Data Methods

| Method | Tool | Sample | Cost |
|--------|------|--------|------|
| Online survei | Google Forms / Typeform free | 200-500 responden | Gratis |
| Social media poll | Instagram/X poll | 500-2.000 responden | Gratis |
| Expert survey | Email questionnaire | 10-20 expert | Gratis |
| Data scraping | Python/Curl | N/A | Gratis |
| API data | Government/bank API | N/A | Gratis/berbayar |

### Survey Design (jika melakukan survei)

1. **Target sample:** Minimal 200 responden untuk validitas statistik dasar
2. **Demografi:** Catat usia, lokasi, pekerjaan, pendapatan
3. **Pertanyaan:** 10-15 pertanyaan (mix Likert scale + open-ended)
4. **Distribusi:** TAM audience (newsletter, social media) + komunitas terkait
5. **Limitation:** Acknowledge sampling bias (audience TAM = urban, digital-savvy)

---

## Lapis 6: Statistical Analysis & Triangulation

### Data Triangulation Framework

Setiap key claim harus diverifikasi via minimal 2 sumber:

| Claim | Source 1 | Source 2 | Source 3 (jika ada) | Triangulation result |
|-------|----------|----------|---------------------|----------------------|
| [Claim 1] | BPS 2024 | ILO 2023 | Expert interview | Konvergen / Divergen |
| [Claim 2] | OJK 2024 | McKinsey 2025 | - | Konvergen / Divergen |

Jika triangulation divergen, bahas discrepancy di whitepaper. Jangan sembunyikan.

### Statistical Analysis Methods (pilih sesuai data)

| Method | Kapan dipakai | Contoh |
|--------|---------------|--------|
| **Deskriptif** | Data tunggal, summary statistik | Mean, median, distribusi |
| **Komparasi temporal** | Bandingkan periode waktu | 2020 vs 2025 |
| **Komparasi cross-sectional** | Bandingkan grup | Urban vs rural, Gen Z vs Millennial |
| **Korelasi** | Hubungan 2 variabel | Jam kerja vs kepuasan |
| **Trend analysis** | Pola dari waktu ke waktu | Growth rate, proyeksi |
| **Regression (sederhana)** | Prediksi dari variabel | Gaji vs tingkat pendidikan |

### Causality vs Correlation Rules

| Aturan | Contoh |
|--------|--------|
| Jangan claim kausalitas dari korelasi | "X berkorelasi dengan Y" bukan "X menyebabkan Y" |
| Hanya claim kausalitas jika: | (1) ada teori yang mendukung, (2) temporal precedence, (3) confounders terkontrol |
| Jika tidak yakin, gunakan: | "berkaitan dengan", "berkorelasi dengan", "cenderung" |
| Confounding variables | Acknowledge di limitations section |

### Error Margin & Confidence

Untuk data survei, catat:
- Sample size (n)
- Confidence level (biasanya 95%)
- Margin of error (biasanya +/- 3-5%)
- Sampling method (random vs convenience)

---

## Lapis 7: Synthesis & Gap Identification

### Synthesis Process

Setelah semua data terkumpul, lakukan synthesis:

1. **Map data ke hypothesis:** Hypothesis mana yang didukung, mana yang dibantah?
2. **Identifikasi pattern:** Pola apa yang muncul dari multiple data sources?
3. **Identifikasi anomaly:** Data mana yang tidak sesuai ekspektasi? Kenapa?
4. **Gap analysis:** Apa yang TIDAK bisa dijawab dari data yang ada?

### Hypothesis Testing Output

| Hypothesis | Data support? | Source(s) | Confidence | Catatan |
|------------|---------------|-----------|------------|---------|
| H1 | Didukung / Dibantah / Mixed | [sources] | High/Medium/Low | [catatan] |
| H2 | ... | | | |
| H5 (null) | Dibantah / Tidak dibantah | [sources] | | [catatan] |

Jika H5 (null hypothesis) TIDAK bisa dibantah, thesis perlu di-revise. Ini bukan kegagalan, ini integritas riset.

### Research Limitations Documentation

Setiap whitepaper HARUS punya section limitations:

```markdown
### Limitations

1. **Data gap:** [data apa yang tidak tersedia]
2. **Sample bias:** [jika survei, bias apa]
3. **Temporal limitation:** [data terbaru tahun berapa]
4. **Scope limitation:** [apa yang tidak dianalisis]
5. **Confounding variables:** [variabel yang tidak terkontrol]
6. **Generalizability:** [apakah temuan bisa digeneralisasi]
```

---

## Keyword Research (tanpa paid tools)

1. **Google Suggest:** Ketik topik di Google, catat autocomplete suggestions
2. **People Also Ask:** Buka PAA section, catat semua pertanyaan
3. **Related Searches:** Scroll ke bawah Google, catat related searches
4. **Google Trends:** Cek tren topik (trends.google.com), bandingkan dengan topik terkait
5. **Answer The Public:** answerthepublic.com (free tier) untuk pertanyaan WH-questions

Catat 10-15 keyword utama + 5-10 long-tail keywords.

## Competitor Analysis Framework (6 aspek)

| Aspek | Yang dicari | Tool |
|-------|-------------|------|
| **Siapa** | Top 5 whitepaper/report di topik yang sama | Google: "topik + whitepaper/report/riset Indonesia" |
| **Sudut** | Angle mereka (pro/kontra/netral) | Baca executive summary |
| **Data** | Data apa yang mereka pakai | Cek sources/bibliography |
| **Gap** | Apa yang tidak mereka bahas | Bandingkan dengan daftar sub-topik |
| **Tone** | Formal/akademis/jurnalistik/populer | Baca 2-3 paragraf |
| **Distribution** | Di mana mereka publish | LinkedIn/Medium/website sendiri/journal |

Isi tabel ini untuk top 3 competitor. TAM angle harus berbeda dari semua 3.

## AI SEO/AEO Research

Cek apakah AI search engines (ChatGPT, Perplexity, Google AI Overviews) sudah cite sumber untuk topik ini:

1. Tanya ChatGPT: "Apa data terbaru tentang [topik] di Indonesia?"
2. Tanya Perplexity: "Riset terbaru tentang [topik] Indonesia"
3. Cek Google AI Overviews: search topik di Google (desktop, US/ID)

Catat: sumber mana yang AI cite? TAM perlu muncul di sumber-sumber itu atau menjadi sumber yang lebih authoritative.

## Source Verification

- **Tier 1:** Terverifikasi langsung dari publikasi asli (BPS, OJK, jurnal)
- **Tier 2:** Kutipan media sekunder, wajib label atribusi
- **Tier 3:** Blog post, opini, tidak ada data primer (HINDARI untuk whitepaper)
- Hapus: dead link, sample terlalu kecil (n < 1.000 untuk klaim nasional), blog post tanpa data primer

## Primary vs Secondary Source Ratio (whitepaper-specific)

| Tipe | Definisi | Rasio ideal |
|------|----------|-------------|
| **Primary** | Publikasi asli: jurnal, laporan resmi, data BPS/OJK, studi asli, expert interview | Min 70% |
| **Secondary** | Media yang mengutip primary source (Katadata, Kompas, dll.) | Max 30% |

Jika rasio primary < 50%, pertimbangkan: apakah topik ini cukup untuk whitepaper, atau lebih cocok jadi artikel?

## Command cek HTTP status inline links

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

## Template Output Research

```markdown
## Riset Whitepaper: [Judul working]

### Keywords
**Utama (10-15):** [daftar keyword]
**Long-tail (5-10):** [daftar keyword]

### Literature Review
#### Academic Papers (5-8)
| # | Paper | Tahun | Method | Key finding | Relevan ke |
|---|-------|------|--------|-------------|------------|
| 1 | [Author, "Title"] | 2024 | [method] | [finding] | H1 |

#### Industry Reports (3-5)
| # | Report | Publisher | Tahun | Key data | Relevan ke |
|---|--------|-----------|------|----------|------------|
| 1 | [Title] | McKinsey | 2025 | [data] | H2 |

#### Research Gap
- [Gap 1]
- [Gap 2]

### Government Data
| Data point | Sumber | Tahun | URL | Sample | Limitation |
|------------|--------|------|-----|--------|------------|
| [angka] | BPS | 2024 | [URL] | n= | [limit] |

### International Benchmark
| Metric | Indonesia | [Negara 1] | [Negara 2] | Source |
|--------|-----------|-----------|-----------|--------|
| [metric] | [value] | [value] | [value] | [source] |

### Expert Interviews (jika dilakukan)
| Expert | Title | Org | Key insight | Quote |
|--------|-------|-----|-------------|-------|
| [Nama] | [title] | [org] | [insight] | "[quote]" |

### Primary Data (jika dilakukan)
- Method: [survei/poll/scraping]
- Sample: [n=, demografi]
- Key findings: [3-5 findings]
- Limitations: [sampling bias, scope]

### Hypothesis Testing
| Hypothesis | Result | Sources | Confidence |
|------------|--------|---------|------------|
| H1 | Didukung | [sources] | High |
| H5 (null) | Dibantah | [sources] | Medium |

### Data Triangulation
| Claim | Source 1 | Source 2 | Result |
|-------|----------|----------|--------|
| [claim] | [source] | [source] | Konvergen |

### Competitor Analysis
| Kompetitor | Angle | Data | Gap (TAM bisa isi) | Tone |
|------------|-------|------|---------------------|------|
| [Nama] | [Angle] | [Data] | [Gap] | [Tone] |

### AI SEO Check
- ChatGPT cite: [sumber mana yang AI cite]
- Perplexity cite: [sumber mana]
- Google AI Overviews: [ada/tidak]

### Research Limitations
1. [Limitation 1]
2. [Limitation 2]
3. [Limitation 3]

### Primary/Secondary Ratio
- Primary: [N] sumber ([X]%)
- Secondary: [N] sumber ([Y]%)
```

## Checklist

- [ ] Literature review: 5-8 academic papers + 3-5 industry reports
- [ ] Government data: minimal 5 data points dari sumber resmi
- [ ] International benchmark: 3-5 negara comparison
- [ ] Expert interviews: 3-5 expert/stakeholder (atau email correspondence)
- [ ] Primary data: survei/poll (jika feasible, minimal 200 responden)
- [ ] Statistical analysis: triangulation setiap key claim (min 2 sources)
- [ ] Hypothesis testing: semua hypothesis diuji, termasuk null hypothesis
- [ ] Research limitations didokumentasikan
- [ ] Primary source ratio > 70%
- [ ] Data tidak outdated (cek freshness rules)
- [ ] Semua source URL aktif (command HTTP check)
- [ ] Keyword research selesai (10-15 utama + 5-10 long-tail)
- [ ] Competitor analysis top 3 selesai
- [ ] AI SEO check selesai
- [ ] Template output research diisi lengkap

## Next

Lanjut ke `/whitepaper-03-strategy`
