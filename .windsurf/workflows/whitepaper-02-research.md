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

## Deep Research Methodology (20x Depth)

Semua section berikut wajib dipertimbangkan. Pilih minimal 5 yang paling relevan. PRISMA + Evidence Hierarchy + Reproducibility wajib semua.

### Systematic Review Standards (wajib semua)

**PRISMA-Style Systematic Review:** 8-step process: (1) Define question, (2) Protocol, (3) Systematic search (document strategy: databases, keywords, date range, filters), (4) Screening (title/abstract > full-text), (5) Quality appraisal, (6) Data extraction, (7) Synthesis, (8) Write. Document search strategy untuk reproducibility.

**Cochrane Rigor Standards:** Duplicate screening (2 reviewer, ke-3 resolve conflict). Duplicate data extraction. Risk of bias assessment per source. GRADE certainty assessment (High/Moderate/Low/Very Low).

**Grey Literature Search Protocol:** Selain jurnal akademik, cari: working papers (SSRN, NBER), policy briefs (think tanks, LSM), NGO reports, conference proceedings, government white papers, thesis/dissertasi. Grey literature = reduce publication bias. Document sources dan akses tanggal.

**Research Ethics & Bias Acknowledgment:** Acknowledge researcher POV (TAM = kontra-narasi, explicitly stated). Funding bias check (TAM = independent, no funder). Confirmation bias mitigation (null hypothesis wajib, steel-man counter-argument). Sampling bias acknowledgment. Cultural bias awareness (urban, digital-savvy audience TAM). Document di limitations section.

**Evidence Hierarchy:**

| Level | Tipe | Contoh |
|-------|------|--------|
| 1 (highest) | Original data primer | Survei TAM, data scraping |
| 2 | SME interview | Expert interview |
| 3 | Peer-reviewed | Jurnal akademik |
| 4 | Standards-based | BPS, OJK, World Bank |
| 5 | Analyst report | McKinsey, Deloitte |
| 6 (lowest) | Vendor blog, media sekunder | Katadata, Kompas |
| Flag | Unsourced claim | Tanpa data primer |

**Reproducibility Standards:** Methodology section wajib. Data sources traceable (URL + akses tanggal). Analysis steps documented. Research log / audit trail template:

```markdown
### Research Log
| Tanggal | Aktivitas | Sumber | Hasil | Catatan |
|---------|-----------|--------|-------|---------|
| [date] | Search Google Scholar | "keyword" | 20 paper | 5 relevan |
| [date] | Download BPS data | Sakernas 2024 | Excel | n=70.000 |
```

### Advanced Research Methods (pilih minimal 3)

**Bayesian Reasoning untuk Evidence:** Setiap claim: Prior (apa yang kita tahu sebelumnya) + Likelihood (berapa kuat evidence baru) = Posterior (apa yang kita percaya sekarang). Bayesian audit: apakah claim proportionate to evidence? Hindari over-claiming. Sensitivity analysis across plausible priors.

**Abductive Reasoning untuk Hypothesis:** Surprising fact (observasi) > generate hypothesis > derive testable consequences > test > verify. Untuk generate insight counter-intuitive yang menjadi "tamparan". Dokumentasi: apa yang surprising, hypothesis apa yang muncul, bagaimana diuji.

**Grounded Theory untuk Topik Baru:** Iterative design. Theoretical sampling. Constant comparison. Theory muncul dari data, bukan diterapkan dari atas. Data saturation assessment: kapan menambah data tidak lagi menghasilkan insight baru?

**Design of Experiments (DOE):** Jika original research: randomization, replication, blocking. Factorial design untuk multiple variables. ANOVA untuk analysis. Document experimental design.

**RAND Delphi Method untuk Expert Consensus:** Anonymous (expert tidak tahu siapa lain). Iterative (2-3 round). Feedback (summary dari round sebelumnya). Statistical group response (median + interquartile range). Cocok untuk topik yang belum ada consensus.

**Mixed Methods Integration:** Quant (statistik, survey) + Qual (interview, case study). Integration saat synthesis. Exploratory sequential: qual explore dulu, quant validate. Explanatory sequential: quant dulu, qual explain findings.

**Action Research Observation Phase:** Document effects (intended + unintended). Constraints yang ditemukan. Reader response (jika iterative). Basis untuk improvement cycle.

### Data Quality & Validation

**Data Validity Framework:**

| Tipe validity | Pertanyaan | Cara cek |
|---------------|------------|----------|
| Construct | Apakah mengukur apa yang seharusnya? | Cek definisi operasional |
| Internal | Apakah causal claim valid? | Cek confounders, design |
| External | Apakah bisa digeneralisasi? | Cek sample representativeness |
| Statistical | Apakah analisis statistik benar? | Cek method, sample size, power |

**Source Credibility Scoring Matrix (5-level):**

| Score | Kriteria | Contoh |
|-------|----------|--------|
| A+ | Peer-reviewed + data primer + recent | Jurnal 2024 dengan data original |
| A | Government/official + data primer | BPS, OJK, World Bank |
| B | Industry report + methodology transparent | McKinsey dengan appendix method |
| C | Media sekunder + cite primary source | Katadata yang link ke BPS |
| D | Opini/blog + tidak ada data primer | Blog post tanpa data |

Min 70% source harus A+ atau A.

**Sensitivity Analysis:** Apa yang berubah jika data berubah? Leave-one-out: exclude sumber terkuat, apakah conclusion tetap? Best-case vs worst-case scenario. Document di limitations.

**Meta-Synthesis untuk Qualitative Data:** Untuk qualitative findings dari multiple sources: identify themes across sources. Compare dan contrast. Build integrated interpretation. Acknowledge divergence.

### Data Presentation Standards

**Data Visualization Standards:** Max 5-7 data components per chart. Soft colors + bright emphasis untuk highlight. Preattentive processing design (color, size, position untuk instant recognition). Graph selection matrix:

| Data type | Chart | Contoh |
|-----------|-------|--------|
| Time series | Line chart | Tren 2020-2025 |
| Ranking | Bar chart (horizontal) | Ranking provinsi |
| Comparison | Grouped bar | Indonesia vs negara lain |
| Correlation | Scatter plot | Gaji vs kepuasan |
| Distribution | Histogram/box | Distribusi pendapatan |
| Composition | Stacked bar/area | Komposisi sektor |
| Relationship | Bubble chart | 3 variabel sekaligus |

**Cognitive Load Validation (per-section):** Intrinsic (complexity) manageable? Extraneous (format noise) minimized? Germane (schema building) maximized? Worked examples untuk complex concepts. Split-attention avoidance (jangan pakai reader lihat chart + text jauh terpisah).

**Information Scent Optimization (per-section):** Scent markers: bolded key findings, pull quotes, conclusion-first headings. Value-per-effort ratio: apakah effort baca section ini sepadan dengan insight yang didapat? Reward frequency: key insight setiap 200-300 kata.

### AI & E-E-A-T Evidence Collection

**AI Citation Optimization:** Self-contained citable passages per section (AI engines lift paragraph yang bisa stand-alone). Statistical formatting: angka spesifik ("74%" bukan "mayoritas"). Methodology documentation. Information gain density: setiap paragraph menambah info baru, bukan repetisi.

**E-E-A-T Evidence Collection:**
- Author credentials verification (link ke LinkedIn/publikasi)
- First-person experience documentation ("Kami survei 500 responden...")
- Primary source prioritization (link ke BPS, bukan media yang cite BPS)
- Expert quote attribution tracking (nama, title, organisasi, tanggal)
- Date visibility (data tahun berapa, bukan "terbaru")
- Correction transparency (jika data di-update, acknowledge)

### Claim-Source Map

Setiap major argument dari 01-idea harus dipetakan ke evidence:

| Argument (dari 01-idea) | Evidence | Source type | URL | Usage notes | Owner |
|-------------------------|---------|-------------|-----|-------------|-------|
| [Arg 1] | [data/study] | [A+/A/B/C/D] | [URL] | [cara pakai] | [siapa verifikasi] |
| [Arg 2] | [data] | [level] | [URL] | [notes] | [owner] |

### Think Tank Research Pipeline

Formal pipeline (bukan ad-hoc):
1. **Problem framing:** Ulangi dari 01-idea, pastikan masih relevan setelah riset awal
2. **Data acquisition:** Systematic search + government data + expert input
3. **Analysis:** Statistical analysis + qualitative synthesis + triangulation
4. **Peer review:** Internal review (tim TAM) + external (expert yang diwawancara)
5. **Publication:** Whitepaper + derivative assets

### Risk Presentation Framework

Untuk setiap key claim dengan uncertainty:

| Claim | Central estimate | Upper bound | Lower bound | Confidence | Unknowns |
|-------|-----------------|-------------|-------------|------------|----------|
| [claim] | [best estimate] | [skenario tinggi] | [skenario rendah] | High/Med/Low | [apa yang tidak diketahui] |

Flag uncertainties secara explicit. Acknowledge unknowns. Jangan present single number jika range lebar.

### Epistemology Integration (dari 01-idea)

**Popper Falsifiability Test untuk Evidence:** Untuk setiap evidence, tanya: apa data yang bisa falsify claim ini? Jika evidence tidak punya potential falsifier, lemah.

**Kuhn Anomaly Documentation:** Collect anomalies (data yang tidak cocok narasi populer). Document dengan context. Akumulasi anomalies = basis "tamparan".

**Lakatos Novel Prediction Verification:** Apakah thesis predicts something new? Jika evidence hanya explain retroactively, thesis degenerating. Cari evidence yang confirm novel prediction.

**Toulmin Warrant Verification:** Logic bridge antara evidence dan claim harus eksplisit. Warrant = "karena [logic], maka [evidence] mendukung [claim]". Jika warrant tidak clear, argument lemah.

**Aristotle Logos Evidence Collection:** Enthymeme patterns (argument dengan implicit premise). Topoi (common argumentative patterns untuk topic ini).

### Behavioral & Narrative Evidence

**Narrative Transportation Evidence:** Case studies dengan story arc (protagonist, conflict, resolution). Transportation reduces counter-arguing. Cari case study yang reader bisa identify dengan protagonist.

**Loss Aversion Data Collection:** Apa reader sudah punya dan bisa hilang? Opportunity cost data. "Setiap hari menunda = kehilangan X." Frame sebagai loss, bukan gain.

**Information Entropy Audit:** Information value per source. Noise vs signal. Hapus source yang tidak menambah information. Redundancy check: apakah 3 source mengatakan hal yang sama? Cukup 1 + note "corroborated by 2 others".

### Sociology & Systems Evidence

**Semiotic Deconstruction Research:** Denotation (literal meaning) vs connotation (cultural meaning) dalam topic discourse. Identifikasi myth (ideology disguised as natural). TAM: decode connotations yang generasi muda terima sebagai denotation.

**Social Construction Tracing:** How institutions created "reality" reader operates in. Externalization > objectivation > internalization. Document process: siapa yang menciptakan, kapan, kenapa, bagaimana menyebar.

**Capital Distribution Mapping (Bourdieu):** Economic capital (money), cultural capital (knowledge, skills, education), social capital (connections). Map capital dynamics dalam topic. TAM: reveal invisible advantages.

**Discourse Archaeology (Foucault):** Historical emergence of current "common sense". Genealogy: trace how present practices emerged from contingent historical processes. Who benefits from current discourse?

**Systems Mapping:** Feedback loops (balancing vs reinforcing) dalam topic. Stocks and flows. Leverage points (12 levels, Meadows). System traps: limits to growth, shifting burden, tragedy of commons, fixes that fail.

### Writing Process Documentation

**Research Log sebagai Part of Writing Process:** Writing = iterative problem-solving (Flower & Hayes). Plan > translate > review > re-plan. Document research decisions, evolution of understanding. Goals evolve during research. Monitor: metacognitive check "apakah ini masih aligned dengan TAM tone?"

**Meta-Analysis Data Extraction:** Untuk multiple studies/sources: effect size (Cohen's d, Pearson's r, odds ratio). Confidence interval. Heterogeneity (I-squared). Publication bias check (funnel plot asymmetry). Forest-plot thinking: visualize range across sources. Sensitivity analysis: leave-one-out.

### CAR Data Bulletproofing (ProPublica Standards)

Data journalism standards untuk semua data primer yang dikumpulkan:

- **Consistency-check all fields:** Tipe data konsisten? Format tanggal sama? Kategori tidak typo?
- **Double-check totals:** Sum manual vs sum program. Sama?
- **Check for missing data:** Baris kosong? Null values? Kenapa missing?
- **Know source:** Siapa gather data? Kapan? Untuk apa purpose? Metode collection?
- **Get similar data from another source:** Cross-check dengan sumber kedua. Beda signifikan?
- **Maintain work log:** Document setiap step: dari mana, transformasi apa, analisis apa
- **Duplicate work:** Lakukan analisis dua kali independently. Hasil sama?
- **Gut check:** Jika sesuatu tidak feel right, probably isn't. Investigate.

"Interviewing the data": treat data sebagai source. Ask: who gathered it? when? for what purpose? how? Reproducibility = key credibility signal untuk E-E-A-T.

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
- [ ] PRISMA-style systematic review: search strategy documented, screening process
- [ ] Cochrane rigor: duplicate screening, risk of bias assessment, GRADE certainty
- [ ] Grey literature search: working papers, policy briefs, NGO reports, conference proceedings
- [ ] Research ethics & bias acknowledgment: POV stated, funding bias check, confirmation bias mitigation, sampling bias, cultural bias
- [ ] Evidence hierarchy applied: min 70% source level A+ atau A
- [ ] Reproducibility: research log, data sources traceable, analysis documented
- [ ] Minimal 3 advanced research methods dipilih (Bayesian/Abductive/Grounded Theory/DOE/Delphi/Mixed Methods/Action Research)
- [ ] Data validity framework: construct, internal, external, statistical validity cek
- [ ] Source credibility scoring matrix diisi (A+ sampai D)
- [ ] Sensitivity analysis: leave-one-out, best/worst case
- [ ] Data visualization standards: graph selection, max 5-7 components, preattentive design
- [ ] Cognitive load validation per-section
- [ ] Information scent optimization per-section
- [ ] AI citation optimization: citable passages, statistical formatting
- [ ] E-E-A-T evidence: credentials, first-person markers, primary sources, expert quotes
- [ ] Claim-source map: setiap argument dipetakan ke evidence + source type + URL
- [ ] Think tank pipeline: framing > acquisition > analysis > peer review > publication
- [ ] Risk presentation: central estimate + upper/lower bound + unknowns
- [ ] Epistemology integration: Popper falsifiability, Kuhn anomaly, Lakatos novel prediction, Toulmin warrant, Aristotle logos
- [ ] Narrative evidence: case studies dengan story arc, loss aversion data, information entropy audit
- [ ] Sociology evidence: semiotic deconstruction, social construction tracing, capital mapping, discourse archaeology, systems mapping
- [ ] Writing process: research log documented, meta-analysis data extraction (effect sizes, CIs, heterogeneity)
- [ ] CAR data bulletproofing: consistency-check, double-check totals, missing data check, source verification, work log, duplicate work, gut check
- [ ] Template output research diisi lengkap

## Next

Lanjut ke `/whitepaper-03-strategy`
