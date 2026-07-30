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

## Lapis 3: Riset Internasional (WAJIB MENDALAM)

Whitepaper TAM nggak boleh cuma bahas Indonesia. Setiap whitepaper harus posisikan Indonesia di konteks global. Pembaca profesional butuh tahu: apakah fenomena ini cuma terjadi di Indonesia atau bagian dari tren global? Apa yang bisa dipelajari dari negara lain?

### 3A. Pilih Negara Pembanding (minimum 5 negara)

Pilih minimum 5 negara dari 3 kategori region:

| Region | Kategori | Negara kandidat | Kenapa dipilih |
|--------|----------|-----------------|----------------|
| ASEAN | Regional neighbor | Singapura, Malaysia, Thailand, Vietnam, Filipina | Similar cultural/economic context, comparable development stage |
| Asia Timur | Developed Asia | Jepang, Korea Selatan, Taiwan | Advanced economy yang sudah lewat fase Indonesia, leading indicators |
| OECD/Barat | Developed West | USA, UK, Jerman, Australia, Kanada | Best practices, policy innovation, data terlengkap |
| Emerging | BRICS/developing | Brazil, India, Cina, Meksiko, Turki | Similar challenges (middle-income trap, demographic transition) |
| Nordic | Social policy | Swedia, Denmark, Finlandia | Best practice untuk social safety net, labor policy, welfare |

Pilih minimum 1 dari setiap kategori (total 5 negara). Jika topik spesifik (misal: BPJS), tambah negara yang punya sistem serupa.

### 3B. Data Global (wajib cek minimum 10 sumber)

Ini adalah database global yang punya data Indonesia + negara lain. Cek minimum 10:

| Kategori | Sumber | URL | Tipe data | Prioritas |
|----------|--------|-----|-----------|-----------|
| Makro ekonomi | World Bank Open Data | data.worldbank.org | GDP, inequality, demographics, employment | WAJIB |
| Labor/kerja | ILOSTAT | ilostat.ilo.org | Employment, wages, gig economy, labor force | WAJIB |
| OECD data | OECD Data | data.oecd.org | Advanced economy comparison, policy outcomes | WAJIB |
| Demografi | UN Population Division | population.un.org | Demographic projections, aging, fertility | WAJIB |
| Kesehatan | WHO Global Observatory | who.int/data | Health systems, mental health, health spending | WAJIB (topik kesehatan) |
| Moneter | IMF Data | data.imf.org | Financial stability, debt, monetary policy | WAJIB (topik keuangan) |
| Financial stability | BIS (Bank for Int'l Settlements) | bis.org | Banking, fintech, financial regulation | Tinggi (topik keuangan) |
| Pendidikan | UNESCO UIS | uis.unesco.org | Education stats, literacy, enrollment | Tinggi (topik pendidikan) |
| Inequality | World Inequality Database | wid.world | Income/wealth inequality, top 1% share | Tinggi (topik ekonomi) |
| Happiness/wellbeing | World Happiness Report | worldhappiness.report | Subjective wellbeing, social support | Sedang |
| Corruption | Transparency International | transparency.org | CPI, corruption metrics | Sedang |
| Competitiveness | WEF Global Competitiveness | weforum.org | Competitiveness index, ease of doing business | Sedang |
| Migration | IOM Global Migration Data | migrationdataportal.org | Migration, remittance, brain drain | Sedang |
| Digital/tech | ITU | itu.int/en/ITU-D/Statistics | Internet penetration, digital divide | Sedang |
| Housing | Numbeo + ULI | numbeo.com, uli.org | Property income ratio, housing affordability | Tinggi (topik perumahan) |
| Pensions | OECD Pensions at a Glance | oecd.org/pensions | Pension systems, coverage, replacement rate | Tinggi (topik pensiun) |
| Tax | OECD Tax Database | oecd.org/tax | Tax rates, tax-to-GDP, tax structure | Tinggi (topik pajak) |
| Mental health | WHO Mental Health Atlas | who.int/mental_health | Psychiatrist density, mental health spending | Tinggi (topik kesehatan mental) |
| Demographics/fertility | UN World Population Prospects | population.un.org/wpp | Fertility rate, demographic dividend, aging | Tinggi (topik demografi) |

### 3C. Think Tank & Lembaga Riset Global

Think tank = lembaga riset independen yang terbitkan policy paper. Beda dari jurnal akademik: lebih praktis, lebih kebijakan-oriented. Cek minimum 3:

| Think tank | Focus | URL | Region coverage |
|------------|-------|-----|-----------------|
| Brookings Institution | Economic policy, social policy | brookings.edu | US + global |
| Peterson Institute (PIIE) | International economics | piie.com | Global trade, finance |
| RAND Corporation | Public policy, defense, health | rand.org | US + global |
| Center for Global Development | Development policy | cgdev.org | Developing countries |
| Bruegel | European economic policy | bruegel.org | EU |
| ERIA (Economic Research Institute for ASEAN) | ASEAN economic integration | eria.org | ASEAN |
| ADBI (Asian Development Bank Institute) | Asian development | adbi.org | Asia |
| Lowy Institute | Asia-Pacific foreign policy | lowyinstitute.org | Asia-Pacific |
| ISEAS-Yusof Ishak Institute | Southeast Asia studies | iseas.edu.sg | ASEAN |
| Chatham House | International affairs | chathamhouse.org | Global |
| Council on Foreign Relations | US foreign policy | cfr.org | Global |
| Carnegie Endowment | International peace | carnegieendowment.org | Global |
| NBER (National Bureau of Economic Research) | Economics working papers | nber.org | US + global academic |
| CESifo | European economic research | cesifo.org | EU + global |
| IZA (Institute of Labor Economics) | Labor economics | iza.org | Global labor |

### 3D. Jurnal & Paper Akademik Global (bukan cuma Indonesia)

Cari paper dari luar Indonesia. Minimum 5 paper. Ini database tempat cari:

| Database | URL | Cara search | Focus |
|----------|-----|-------------|-------|
| Google Scholar | scholar.google.com | `keyword + [country name] OR "cross-country" OR "international comparison"` | Global academic |
| NBER Working Papers | nber.org | Search by topic | US economic research, often global implications |
| SSRN | ssrn.com | `keyword + international OR cross-country` | Working papers, pre-prints |
| RePEc (IDEAS) | ideas.repec.org | Search by JEL code + topic | Economics literature |
| CEPR (Centre for Economic Policy Research) | cepr.org | Search by topic | European economic research |
| JSTOR | jstor.org | `keyword + [country] OR comparative` | Historical + current academic |
| PubMed | pubmed.ncbi.nlm.nih.gov | `keyword + [country] OR systematic review` | Health/medical research |
| Cochrane Library | cochranelibrary.com | Search by topic | Systematic reviews (health) |
| EconLit | (via AEA) | Search by JEL code | Economics literature |
| World Bank Policy Research | documents.worldbank.org | Search by topic + country | Development policy research |

Cara cari paper global:
1. Search dengan keyword + nama negara (misal: `"quiet quitting" Japan Korea Singapore`)
2. Search dengan keyword + `"cross-country"` atau `"international comparison"` atau `"comparative study"`
3. Search dengan keyword + `"systematic review"` atau `"meta-analysis"` untuk rangkuman yang sudah ada
4. Search dengan keyword + `"policy intervention"` atau `"policy evaluation"` untuk lihat apa yang sudah dicoba
5. Cek citation network: paper global mana yang cite paper Indonesia dan sebaliknya

### 3E. Database Kebijakan Negara Lain (apa yang sudah dicoba + hasilnya)

Untuk setiap negara pembanding, cari kebijakan yang sudah dicoba:

| Negara | Policy/intervention | Tahun | Hasil (berhasil/gagal/mixed) | Evidence level | Relevan ke Indonesia? |
|--------|---------------------|------|------------------------------|----------------|----------------------|
| [Negara] | [policy name] | [year] | [outcome] | [study quality] | [ya/tidak + kenapa] |

Sumber policy database:
- OECD Policy Library (oecd.org/policy) - policy papers per topic
- World Bank Doing Business (doingbusiness.org) - regulatory reform outcomes
- ILO NATLEX (natlex.ilo.org) - labor law database per country
- WHO Policy Database (who.int/policies) - health policy per country
- Social Policy Reform Database (UNRISD) - social protection reforms
- JSTOR + Google Scholar: `[country] + policy reform + [topic] + evaluation`

### 3F. Tabel Perbandingan Statistik (Indonesia vs Negara Lain)

Bandingkan Indonesia dengan negara pembanding di minimum 5 metrik:

| Metric | Indonesia | [Negara 1] | [Negara 2] | [Negara 3] | [Negara 4] | [Negara 5] | Source | Year |
|--------|-----------|-----------|-----------|-----------|-----------|-----------|--------|------|
| [Metric 1] | [value] | [value] | [value] | [value] | [value] | [value] | [source] | [year] |
| [Metric 2] | [value] | [value] | [value] | [value] | [value] | [value] | [source] | [year] |
| [Metric 3] | [value] | [value] | [value] | [value] | [value] | [value] | [source] | [year] |
| [Metric 4] | [value] | [value] | [value] | [value] | [value] | [value] | [source] | [year] |
| [Metric 5] | [value] | [value] | [value] | [value] | [value] | [value] | [source] | [year] |

Aturan metrik:
- Minimum 5 metrik, ideal 8-10
- Metrik harus normalized (per capita, % GDP, per 100k population, dll.) untuk comparability
- Sumber harus sama untuk semua negara (misal: semua dari World Bank) untuk consistency
- Tahun data harus dicatat, ideal sama untuk semua negara
- Jika data Indonesia tidak ada di source internasional, cari source domestik (BPS/OJK) dan note discrepancy

### 3G. Tren Global dari Waktu ke Waktu

Selain perbandingan antar negara, lihat juga tren dari waktu ke waktu:

| Metric | Indonesia 2010 | Indonesia 2020 | Indonesia 2025 | Global avg 2025 | Trend (naik/turun/stagnan) | Source |
|--------|----------------|----------------|----------------|-----------------|---------------------------|--------|
| [Metric] | [value] | [value] | [value] | [value] | [trend] | [source] |

Pertanyaan kunci:
1. Apakah Indonesia konvergen atau divergen dari global average?
2. Apakah Indonesia mengikuti tren global atau berbeda?
3. Jika berbeda, kenapa? (cultural, structural, policy, institutional?)
4. Jika mengikuti, berapa lag time (Indonesia berapa tahun di belakang)?

### 3H. Rangkuman Insight dari Riset Internasional

```markdown
### International Benchmark Summary

#### Cross-Country Comparison (5 negara, 5+ metrics)
[table 3F]

#### Global Trend Analysis
[table 3G]

#### Policy Lessons dari Negara Lain
| Negara | Policy | Hasil | Lesson untuk Indonesia |
|--------|--------|-------|------------------------|
| [Negara] | [policy] | [hasil] | [lesson] |

#### Key Insights
- [Insight 1: apa yang Indonesia beda dari global]
- [Insight 2: apa yang Indonesia bisa pelajari dari negara lain]
- [Insight 3: apa yang Indonesia unik (tidak bisa copy-paste policy)]
- [Insight 4: apakah fenomena ini global atau lokal Indonesia]
- [Insight 5: leading indicator dari negara yang lebih advanced]

#### Research Gaps (international)
- [Gap 1: data internasional apa yang tidak ada untuk Indonesia]
- [Gap 2: negara mana yang belum dibandingkan tapi seharusnya]
- [Gap 3: policy intervention mana yang belum dievaluasi]
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

## Lapis 5: Data Primer (Riset Sendiri, Research-Grade)

### Kapan Butuh Data Primer?

| Kondisi | Butuh data primer? |
|---------|---------------------|
| Data sekunder nggak ada untuk Indonesia | Ya |
| Data sekunder outdated (> 5 tahun) | Ya |
| TAM punya akses ke audience untuk survei | Ya |
| Topik baru yang belum pernah diteliti | Ya |
| Data sekunder cukup dan terbaru | Nggak perlu |

### 5A. Hitung Sample Size Sebelum Survei (WAJIB)

Sebelum bikin survei, hitung dulu berapa minimal orang yang harus di survei:

| Parameter | Nilai typical | Penjelasan |
|-----------|---------------|------------|
| Effect size (Cohen's d) | 0.2 (small) / 0.5 (medium) / 0.8 (large) | Smallest effect yang ingin dideteksi |
| Alpha (significance) | 0.05 | Probability of false positive |
| Power (1-beta) | 0.80 / 0.90 | Probability of detecting true effect |
| Number of groups | 2+ | Untuk comparison studies |

Rumus: `n = (Z_alpha/2 + Z_beta)^2 * 2 * sigma^2 / delta^2`

Atau gunakan: G*Power (free), `pwr` package di R, atau calculator online (stat.ubc.ca/~rollin/stats/size/)

| Effect size | Minimum n (power=0.80) | Minimum n (power=0.90) |
|-------------|------------------------|------------------------|
| 0.2 (small) | ~788 per group | ~1054 per group |
| 0.5 (medium) | ~64 per group | ~86 per group |
| 0.8 (large) | ~26 per group | ~34 per group |

Jika TAM audience survei dengan n < 200, acknowledge sebagai exploratory, bukan confirmatory.

### 5B. Metode Sampling (jangan asal ambil responden)

| Sampling method | Kapan dipakai | Kelebihan | Kekurangan |
|-----------------|---------------|-----------|------------|
| **Simple random** | Population homogen | Unbiased | Butuh sampling frame |
| **Stratified** | Population heterogen (sub-grup) | Representatif per strata | Butuh info strata |
| **Cluster** | Geographically dispersed | Practical | Cluster effect |
| **Quota** | Target demografi spesifik | Controlled | Non-random |
| **Convenience** | TAM audience | Mudah | Bias (urban, digital) |
| **Snowball** | Hidden population | Reach inaccessible | Bias network |

Untuk TAM: stratified sampling ideal (strata: usia 18-24, 25-30, 31-35; lokasi: Jawa/Luar Jawa; pendapatan: <5jt, 5-10jt, >10jt). Jika tidak feasible, convenience + acknowledge bias.

### 5C. Desain Survei (Research-Grade)

**Prinsip bikin pertanyaan:**
1. **Operasionalkan variabel:** Setiap variabel harus punya definisi jelas. "Kesejahteraan finansial" = skor dari 5 pertanyaan Likert (daya beli, tabungan, kemampuan darurat, kecemasan finansial, outlook masa depan)
2. **Hindari pertanyaan menuntun:** Bukan "Apakah kamu setuju sistem kerja eksploitatif?" tapi "Bagaimana pengalaman kamu dengan sistem kerja saat ini?"
3. **Hindari pertanyaan ganda:** Satu pertanyaan = satu konsep. Bukan "Apakah kamu puas dengan gaji dan jam kerja?"
4. **Likert scale:** 5-point (Sangat Tidak Setuju sampai Sangat Setuju) atau 7-point untuk lebih detail
5. **Reverse-coded items:** 20-30% pertanyaan dibalik untuk deteksi responden yang asal jawab
6. **Attention checks:** Sisipkan 1-2 cek perhatian ("Pilih 'Sangat Setuju' untuk pertanyaan ini")
7. **Demografi:** Usia, gender, lokasi (provinsi), pendapatan, pendidikan, pekerjaan, status pekerjaan
8. **Pre-test:** Pilot dengan 20-30 responden, cek reliability (Cronbach's alpha > 0.70 untuk multi-item scales)

**Instrumen yang sudah teruji (pakai yang ini, jangan bikin sendiri kalau sudah ada):**

| Construct | Instrument | Referensi |
|-----------|------------|-----------|
| Financial well-being | CFPB Financial Well-Being Scale | CFPB (2015) |
| Job satisfaction | Job Descriptive Index (JDI) | Smith et al. (1969) |
| Mental health | PHQ-9 (depression), GAD-7 (anxiety), K10 (distress) | WHO |
| Burnout | Maslach Burnout Inventory (MBI) | Maslach (1981) |
| Work engagement | Utrecht Work Engagement Scale (UWES) | Schaufeli & Bakker (2003) |
| Social media use | Bergen Social Media Addiction Scale (BSMAS) | Andreassen et al. (2016) |
| Consumer behavior | Compulsive Buying Scale | Faber & O'Guinn (1992) |
| Housing affordability | Housing Affordability Index | Demographia |
| Life satisfaction | Satisfaction with Life Scale (SWLS) | Diener et al. (1985) |

Selalu cite instrument yang dipakai. Modifikasi instrument wajib documented + pre-tested.

### 5D. Metode Eksperimen & Quasi-Eksperimen

| Method | Kapan dipakai | Internal validity | Contoh TAM |
|--------|---------------|-------------------|------------|
| **RCT (Randomized Controlled Trial)** | Bisa randomize treatment | Tinggi | A/B test newsletter framing |
| **Quasi-experimental** | Tidak bisa randomize, tapi ada natural experiment | Sedang | Before/after policy change |
| **Difference-in-Differences (DiD)** | Policy change, ada treatment & control group | Sedang-Tinggi | Efek UU Cipta Kerja |
| **Regression Discontinuity (RDD)** | Threshold/cutoff policy | Tinggi | Efek program berdasarkan batas pendapatan |
| **Instrumental Variables (IV)** | Endogeneity concern | Sedang-Tinggi | Efek pendidikan ke income (instrument: jarak sekolah) |
| **Synthetic Control** | Single treatment unit, multiple comparison | Sedang | Efek policy di satu provinsi vs weighted average provinsi lain |

### 5E. Metode Data Science & Komputasi

| Method | Tool | Kapan dipakai | Contoh |
|--------|------|---------------|--------|
| **Web scraping** | Python (BeautifulSoup, Scrapy, Selenium) | Data tidak tersedia via API | Scrape job listings, property listings |
| **API data collection** | Python (requests), Postman | Data tersedia via API | BPS API, Bank Indonesia API, OpenStreetMap |
| **NLP/Sentiment analysis** | Python (spaCy, transformers, BERT) | Analisis teks besar | Sentiment Twitter/Reddit tentang topik |
| **Topic modeling** | Python (LDA, BERTopic) | Identifikasi tema dari teks besar | Tema keluhan pekerja dari review Glassdoor |
| **Network analysis** | Python (NetworkX), Gephi | Hubungan antar entitas | Network penyebaran misinformasi |
| **Spatial analysis/GIS** | QGIS, Python (GeoPandas) | Data geografis | Peta akses layanan per provinsi |
| **Time series forecasting** | Python (statsmodels, Prophet) | Proyeksi masa depan | Proyeksi demografi, ekonomi |
| **Machine learning** | Python (scikit-learn, XGBoost) | Pattern recognition, prediction | Prediksi probability default KPR |

### 5F. Primary Data Methods

| Method | Tool | Sample | Cost |
|--------|------|--------|------|
| Online survei | Google Forms / Typeform / Qualtrics | 200-1000+ responden | Gratis - berbayar |
| Social media poll | Instagram/X poll | 500-2.000 responden | Gratis |
| Expert survey (Delphi) | Email questionnaire / Google Forms | 10-30 expert | Gratis |
| Data scraping | Python/Curl | N/A | Gratis |
| API data | Government/bank API | N/A | Gratis/berbayar |
| NLP/sentiment analysis | Python + NLP libraries | N/A | Gratis |
| Spatial analysis | QGIS / GeoPandas | N/A | Gratis |
| A/B testing | Newsletter / website | TAM audience | Gratis |

---

## Lapis 6: Analisis Statistik & Triangulasi (Research-Grade)

### Triangulasi Data (setiap claim harus diverifikasi)

Setiap claim utama harus diverifikasi via minimal 3 sumber (upgrade dari 2):

| Claim | Source 1 | Source 2 | Source 3 | Source 4 (jika ada) | Triangulation result |
|-------|----------|----------|----------|---------------------|----------------------|
| [Claim 1] | BPS 2024 (domestic) | ILO 2023 (international) | Academic paper | Expert interview | Konvergen / Divergen |
| [Claim 2] | OJK 2024 (domestic) | World Bank 2024 (international) | McKinsey 2025 | - | Konvergen / Divergen |

Jika triangulation divergen, bahas discrepancy di whitepaper. Jangan sembunyikan. Divergence = insight opportunity.

### 6A. Metode Statistik Lanjutan (pilih minimum 3)

| Method | Kapan dipakai | Tool | Contoh TAM |
|--------|---------------|------|------------|
| **Deskriptif** | Data tunggal, summary statistik | Excel, R, Python | Mean, median, distribusi |
| **Komparasi temporal** | Bandingkan periode waktu | R, Python (statsmodels) | 2020 vs 2025 |
| **Komparasi cross-sectional** | Bandingkan grup | R, Python (scipy) | Urban vs rural, Gen Z vs Millennial |
| **Korelasi (Pearson/Spearman)** | Hubungan 2 variabel | R, Python | Jam kerja vs kepuasan |
| **Partial correlation** | Korelasi setelah kontrol variabel | R (ppcor), Python | Gaji vs kepuasan, kontrol pendidikan |
| **Multiple regression (OLS)** | Prediksi multi-variabel | R (lm), Python (sklearn) | Gaji dari pendidikan, pengalaman, gender |
| **Logistic regression** | Binary outcome | R (glm), Python (sklearn) | Probability punya BPJS dari demografi |
| **Panel data analysis** | Data cross-section + time series | R (plm), Python (linearmodels) | Efek policy lintas provinsi 2015-2025 |
| **Difference-in-Differences (DiD)** | Causal inference dari policy | R, Python (diff-in-diff) | Efek UU Cipta Kerja |
| **Instrumental Variables (2SLS)** | Endogeneity | R (AER), Python (linearmodels) | Efek pendidikan ke income |
| **Time series (ARIMA/Prophet)** | Forecasting | R (forecast), Python (Prophet) | Proyeksi demografi 2030 |
| **Survival analysis** | Time-to-event | R (survival), Python (lifelines) | Durasi nganggur lulusan |
| **Hierarchical/multilevel modeling** | Nested data (individu dalam provinsi) | R (lme4), Python (statsmodels) | Variasi antar provinsi |
| **Bayesian inference** | Uncertainty quantification | R (brms), Python (PyMC) | Posterior distribution effect size |
| **Structural Equation Modeling (SEM)** | Latent constructs + causal paths | R (lavaan), Python (semopy) | Model kesejahteraan finansial |
| **Propensity score matching** | Observational causal inference | R (MatchIt), Python (causalinference) | Efek training ke income |

### 6B. Lapor Effect Size (WAJIB, bukan cuma p-value)

P-value cuma bilang "signifikan atau nggak". Effect size bilang "berapa besar efeknya". Whitepaper TAM wajib lapor keduanya.

| Effect size metric | Kapan dipakai | Interpretasi |
|--------------------|---------------|--------------|
| **Cohen's d** | Mean difference 2 grup | 0.2 small, 0.5 medium, 0.8 large |
| **Pearson's r** | Korelasi 2 variabel | 0.1 small, 0.3 medium, 0.5 large |
| **R-squared** | Regression model | % varians yang dijelaskan |
| **Odds ratio (OR)** | Logistic regression | OR > 2 = meaningful, OR > 5 = strong |
| **Eta-squared** | ANOVA | % varians dari grup difference |
| **Cramér's V** | Chi-square association | 0.1 small, 0.3 medium, 0.5 large |

Format reporting: "Korelasi antara X dan Y adalah r = 0.34 (p < 0.001, n = 500), menunjukkan efek moderate."

### 6C. Kerangka Sebab-Akibat (bukan cuma korelasi)

| Approach | Requirement | Validity | Contoh |
|----------|-------------|----------|--------|
| **Randomization (RCT)** | Random assignment | Gold standard | A/B test newsletter |
| **Natural experiment** | Exogenous shock | Tinggi | Covid-19 sebagai shock |
| **DiD** | Pre/post + treatment/control | Tinggi | Policy before/after |
| **RDD** | Threshold/cutoff | Tinggi | Program berdasarkan batas |
| **IV** | Valid instrument | Sedang-Tinggi | Jarak sekolah sebagai instrument |
| **Matching** | Observational, no randomization | Sedang | Match demografi similar |
| **Interrupted time series** | Longitudinal, single intervention | Sedang | Efek regulasi overtime |

Aturan kausalitas:
1. Jangan claim kausalitas dari korelasi. "X berkorelasi dengan Y" bukan "X menyebabkan Y"
2. Hanya claim kausalitas jika: (1) ada teori yang mendukung, (2) temporal precedence, (3) confounders terkontrol
3. Jika tidak yakin, gunakan: "berkaitan dengan", "berkorelasi dengan", "cenderung"
4. Confounding variables: acknowledge di limitations section
5. Gunakan DAG (Directed Acyclic Graph) untuk map causal assumptions

### 6D. DAG (Diagram Sebab-Akibat) untuk Setiap Claim Kausal

Untuk setiap claim sebab-akibat, gambar DAG yang nunjukin:
- Treatment variable (X)
- Outcome variable (Y)
- Confounders (C): variabel yang mempengaruhi X dan Y
- Mediators (M): variabel di jalur X → Y
- Colliders (K): variabel yang dipengaruhi oleh X dan Y (JANGAN condition on colliders)

Tools: dagitty.net (online), R (dagitty package), Python (causalgraph)

### 6E. Cek Ketahanan Hasil (WAJIB untuk setiap model regresi)

| Check | Cara | Tujuan |
|-------|------|--------|
| **Leave-one-out** | Exclude 1 observasi, re-run | Apakah 1 data point drive hasil? |
| **Alternative specifications** | Ubah control variables | Apakah hasil robust ke spesifikasi? |
| **Sub-sample analysis** | Run per sub-grup (gender, lokasi) | Apakah efek homogen atau heterogen? |
| **Sensitivity to outliers** | Winsorize 1%/5%, re-run | Apakah outlier drive hasil? |
| **Alternative functional forms** | Log vs linear, quadratic | Apakah bentuk fungsi benar? |
| **Placebo test** | Fake treatment, real outcome | Apakah hasil 0 untuk fake treatment? |
| **Oster test** | Calculate bias from unobservables | Berapa besar unobserved confounder yang bisa reverse hasil? |

### 6F. Margin Error & Confidence (Research-Grade)

Untuk data survei, catat:
- Sample size (n)
- Confidence level (biasanya 95%)
- Margin of error (biasanya +/- 3-5%)
- Sampling method (random vs convenience)
- Design effect (untuk complex surveys): DEFF > 1 means effective sample size < nominal
- Weighting (jika digunakan): post-stratification weights

Untuk regression:
- Report coefficient + standard error + p-value + confidence interval
- Report R-squared + adjusted R-squared
- Report F-statistic untuk overall model
- Report VIF (Variance Inflation Factor) untuk multicollinearity (VIF > 5 = concern)

### 6G. Paket Reproduksibilitas (biar orang bisa verifikasi)

Setiap whitepaper yang pakai analisis statistik wajib punya:

```markdown
### Reproducibility Package
- **Data:** [URL atau cara akses data]
- **Code:** [GitHub repo atau ZIP file]
- **Environment:** Python 3.x / R 4.x, packages + versions
- **Random seed:** [jika ada randomization]
- **Analysis script:** Step-by-step dari raw data ke results
- **Output:** Tables + figures yang bisa di-regenerate
```

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

## Lapis 8: Hubungi Ilmuwan & Kolaborasi Akademik (100x Depth)

Whitepaper TAM bukan jurnal akademik, tapi rigor-nya harus mendekati. Untuk naik ke level ilmuwan, TAM harus engage langsung sama komunitas riset, bukan cuma baca paper mereka.

### 8A. Strategi Hubungi Ilmuwan & Peneliti

**Target:** Hubungi minimum 5-10 peneliti/ilmuwan per whitepaper (upgrade dari 3-5 expert).

| Tipe expert | Cara kontak | Platform cari | Pertanyaan utama |
|-------------|-------------|---------------|------------------|
| Akademisi Indonesia | Email (cek di kampus .ac.id) | SINTA (sinta.kemdikbud.go.id), Google Scholar | Validasi data, konteks lokal |
| Akademisi internasional | Email (cek university page) | Google Scholar, ResearchGate, LinkedIn | Benchmark internasional, theory |
| Peneliti think tank | Email / LinkedIn | Think tank websites | Policy analysis, data tambahan |
| Peneliti government | Email resmi / LinkedIn | BPS, OJK, BI, Kemenkes publication authors | Data interpretation, methodology |
| PhD candidate/Postdoc | Email / Twitter/X academic | Academic Twitter, PhD forums | Cutting-edge research, fresh data |
| Independent researcher | Email / blog contact | Substack, Medium, personal blogs | Alternative perspective, contrarian |
| Practitioner-expert | LinkedIn / industry network | LinkedIn, industry associations | Realitas lapangan vs data |

**Email Template untuk Academic Outreach:**

```
Subject: TAM Research Inquiry - [Topic] - Validating data from your [Year] study

Dear [Name],

I'm researcher at TAMPARAN ANAK MUDA (TAM), an independent Indonesian youth
research platform. We're preparing a whitepaper on [topic] and your work
on [specific paper/research] is directly relevant.

Specifically, we're trying to verify/expand on [specific finding from their work].

Questions:
1. [Specific question about their data/methodology]
2. [Has there been updated data since publication?]
3. [Are you aware of similar research in [country/region]?]
4. [Would you be open to reviewing our draft for factual accuracy?]

We acknowledge your work in the whitepaper and share all findings openly.
Our methodology is available at [URL].

Thank you for your time.
[Name], TAM Research Team
```

**Response Rate Expectation:**
- Cold email akademisi: 20-30% response rate
- Follow-up setelah 1 minggu: +10-15%
- Dari yang respond, 50% akan engage substantively
- Target: 3-5 substantive responses dari 10 outreach

### 8B. Peta Jaringan Akademik (siapa siapa di topik ini)

Sebelum kontak orang, petakan dulu siapa aja yang riset di topik ini:

1. **Google Scholar:** Search topik, sort by citations. Top 10 author = primary targets
2. **SINTA (sinta.kemdikbud.go.id):** Cari peneliti Indonesia di topik ini
3. **ResearchGate:** Cari author, lihat network (co-author, follower)
4. **Connected Papers (connectedpapers.com):** Visual map paper yang cite dan di-cite. Identifikasi cluster riset
5. **Semantic Scholar:** Author profile + influence score + co-author network
6. **OpenAlex (openalex.org):** Open scholarly graph, author + institution + topic

Output: daftar 10-20 researcher dengan:
- Nama, afiliasi, email (jika public)
- Top 1-2 paper relevan
- Apakah mereka active (publikasi dalam 3 tahun terakhir)
- Prioritas outreach (high/medium/low berdasarkan relevansi)

### 8C. Lacak Riset Terbaru (yang belum terbit di jurnal)

Working papers = riset 1-2 tahun sebelum jurnal publish. Kalau cuma baca jurnal, TAM tertinggal 2 tahun. Cari minimum 3:

| Database | URL | Cara search | Focus |
|----------|-----|-------------|-------|
| NBER Working Papers | nber.org/papers | Search by topic | Economics, US + global |
| SSRN | ssrn.com | Search by topic | Multi-disciplinary, pre-prints |
| arXiv | arxiv.org | Search by category (econ, stat) | Quantitative, pre-prints |
| RePEc Working Papers | ideas.repec.org | Search by JEL code | Economics |
| CEPR Discussion Papers | cepr.org | Search by topic | European economics |
| IZA Discussion Papers | iza.org/publications | Search by topic | Labor economics |
| BIS Working Papers | bis.org/list/wppubls | Search by topic | Finance, banking |
| IMF Working Papers | imf.org/en/Publications/WP | Search by topic | Macro, finance |
| World Bank Policy Research | documents.worldbank.org | Search by topic + country | Development |
| ADBI Discussion Papers | adbi.org/working-papers | Search by topic | Asia development |
| Conference proceedings | Google: `topic + "conference proceedings" + year` | Manual search | Cutting-edge, belum di jurnal |

### 8D. Simulasi Peer Review (sebelum publish, wajib di-review)

Sebelum publish, lakukan review internal + external:

**Internal Review (wajib):**
1. **Fact-check pass:** Setiap angka, claim, dan citation diverifikasi independen
2. **Logic check:** Setiap argument dicek untuk logical fallacies
3. **Counter-argument steel-man:** Tulis strongest possible counter-argument, lalu respond
4. **Tone check:** Apakah tone konsisten TAM voice? Tidak menggurui, tidak clickbait?
5. **Data freshness check:** Apakah ada data lebih baru yang kontradiksi?

**External Review (wajib, minimum 2 reviewer):**
1. **Send draft ke 2-3 expert** yang sudah diwawancara (atau baru diidentifikasi)
2. **Ask specific questions:** "Apakah ada data yang salah?" "Apakah interpretasi valid?" "Apakah ada angle yang terlewat?"
3. **Document feedback:** Catat siapa review, apa feedback, apa yang diubah/tidak diubah
4. **Acknowledge reviewers:** Di whitepaper, mention "Reviewed by [nama, afiliasi]" (dengan izin)

**Review Protocol:**

```markdown
### Peer Review Log
| Reviewer | Afiliasi | Tanggal | Feedback summary | Action taken |
|----------|----------|---------|------------------|-------------|
| [Nama 1] | [afiliasi] | [date] | [feedback] | [revised / acknowledged / rejected + kenapa] |
| [Nama 2] | [afiliasi] | [date] | [feedback] | [action] |
```

### 8E. Riset Lintas Disiplin (jangan cuma dari 1 sudut)

Setiap topik TAM punya dimensi multi-disiplin. Jangan cuma riset dari 1 sudut.

| Disiplin | Pertanyaan yang dijawab | Sumber riset |
|----------|------------------------|--------------|
| **Ekonomi** | Berapa besar dampak finansial? | Jurnal ekonomi, World Bank, BPS |
| **Sosiologi** | Kenapa fenomena ini terjadi secara sosial? | Jurnal sosiologi, cultural studies |
| **Psikologi** | Bagaimana ini mempengaruhi mental/behavior? | Jurnal psikologi, WHO, validated instruments |
| **Politik/Policy** | Apa policy yang relevan/bisa diubah? | Policy journals, think tanks, ILO, OECD |
| **Hukum** | Apa kerangka hukum yang relevan? | Jurnal hukum, UU, peraturan |
| **Demografi** | Siapa terdampak, berapa banyak? | BPS, UN Population, census data |
| **Public health** | Apa dampak kesehatan? | WHO, Kemenkes, jurnal kesehatan |
| **Anthropology/cultural** | Bagaimana konteks budaya Indonesia? | Jurnal antropologi, cultural studies Indonesia |
| **Data science/computational** | Apa pattern dari big data? | NLP, scraping, computational social science |
| **Historical** | Bagaimana fenomena ini berkembang historically? | Historical journals, arsip |

Pilih minimum 3 disiplin per whitepaper. Untuk setiap disiplin, cari minimum 2-3 sumber.

### 8F. Kolaborasi dengan Institusi

| Tipe institusi | Cara kolaborasi | Benefit untuk TAM |
|----------------|-----------------|-------------------|
| **Universitas** (UI, UGM, ITB, UNPAD, dll.) | MoU riset, guest lecture, data sharing | Akses data, expert network, credibility |
| **Think tank** (CSIS, SMERU, CORE, dll.) | Joint publication, data exchange | Policy expertise, data tambahan |
| **Government research arm** (BPS, LIPI/BRIN, Bank Indonesia Institute) | Data request, research collaboration | Data resmi, methodology guidance |
| **International organization** (World Bank, ILO, UN, ADB) | Research partnership, data access | Global benchmark, credibility |
| **NGO/grassroots** | Field data, community insight | Ground-level validation |
| **Industry association** (APINDO, KADIN, dll.) | Industry data, practitioner input | Realitas sektor privat |

### 8G. Pre-Registration & Transparansi Riset

Untuk data primer (survei, eksperimen):

1. **Pre-registration:** Sebelum collect data, publish hipotesis + rencana analisis di:
   - OSF (Open Science Framework): osf.io/registries
   - AsPredicted: aspredicted.org
   - Ini mencegah HARKing (Hypothesizing After Results are Known)

2. **Open data:** Setelah publish, share raw data (anonymous) di:
   - OSF, GitHub, atau Zenodo
   - Dengan DOI untuk citation

3. **Open code:** Share analysis script (R/Python) di GitHub

4. **Conflict of interest statement:** TAM = independent, no funder. Tapi acknowledge jika ada bias (e.g., TAM audience = urban, digital-savvy)

### 8H. Standar Sitasi & Referensi (Level Akademik)

**Format sitasi:** APA 7th edition atau Chicago Author-Date

**Syarat kualitas referensi:**
- Minimum 30 referensi per whitepaper
- Minimum 50% dari jurnal peer-reviewed
- Minimum 10 sumber internasional (di luar Indonesia)
- Minimum 5 sumber yang terbit dalam 2 tahun terakhir
- Maksimum 20% dari media/populer
- Setiap referensi wajib: Author, Year, Title, Journal/Publisher, URL/DOI

**Tools manajemen referensi:**
- Zotero (free, recommended) - zotero.org
- Mendeley (free) - mendeley.com
- Google Scholar (untuk lacak sitasi)

**DOI wajib:** Setiap paper yang punya DOI wajib include DOI. Kalau nggak ada DOI, include URL + tanggal akses.

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
- [ ] International benchmark: 5 negara dari 3 region (ASEAN, Asia Timur/OECD, Emerging)
- [ ] Global data sources: minimum 10 sumber dicek (World Bank, ILO, OECD, UN, WHO, IMF wajib)
- [ ] Think tank research: minimum 3 think tank global dicek (Brookings, NBER, IZA, dll.)
- [ ] Global academic literature: minimum 5 paper dari luar Indonesia
- [ ] Policy intervention database: minimum 3 policy dari negara lain dengan hasil evaluasi
- [ ] Cross-country statistical comparison: minimum 5 metrik, 5 negara, normalized
- [ ] Global trend analysis: Indonesia vs global average, konvergen/divergen analysis
- [ ] Key insights: minimum 5 insight dari international benchmark (termasuk "unik Indonesia atau global?")
- [ ] Expert interviews: 5-10 researcher/ilmuwan dihubungi (upgrade dari 3-5)
- [ ] Academic network mapping: 10-20 researcher diidentifikasi via Google Scholar, SINTA, Connected Papers
- [ ] Working paper tracking: minimum 3 working paper dari NBER/SSRN/IZA/BIS/IMF dicek
- [ ] Peer review simulation: internal review (fact-check, logic, steel-man) + external review (2+ reviewer)
- [ ] Peer review log documented (reviewer, feedback, action taken)
- [ ] Interdisciplinary research: minimum 3 disiplin per whitepaper (ekonomi, sosiologi, psikologi, dll.)
- [ ] Institutional collaboration: minimum 1 institusi diidentifikasi untuk kolaborasi (universitas, think tank, government)
- [ ] Pre-registration: jika primary data, pre-register di OSF/AsPredicted
- [ ] Open data + open code: data dan script siap untuk share (OSF/GitHub/Zenodo)
- [ ] Citation standards: minimum 30 references, 50% peer-reviewed, 10 international, 5 dalam 2 tahun terakhir
- [ ] Reference management tool: Zotero/Mendeley dipakai
- [ ] DOI included untuk setiap paper yang punya DOI
- [ ] Primary data: power analysis sebelum survei (effect size, alpha, power, sample size)
- [ ] Sampling design: stratified atau documented convenience + bias acknowledgment
- [ ] Survey design: validated instruments dipakai (PHQ-9, MBI, SWLS, dll.) + pre-test (Cronbach alpha > 0.70)
- [ ] Experimental/quasi-experimental method dipertimbangkan (RCT, DiD, RDD, IV, matching)
- [ ] Computational methods dipertimbangkan (NLP, scraping, GIS, time series, ML)
- [ ] Statistical analysis: triangulation setiap key claim (min 3 sources, upgrade dari 2)
- [ ] Advanced statistical methods: minimum 3 dipilih (regression, panel, DiD, survival, Bayesian, SEM, dll.)
- [ ] Effect size reporting: Cohen's d / r / R-squared / OR untuk setiap statistical result
- [ ] Causal inference framework: DAG untuk setiap causal claim
- [ ] Robustness checks: leave-one-out, alternative specifications, sub-sample, placebo test
- [ ] Reproducibility package: data + code + environment + random seed documented
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
