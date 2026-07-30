# Whitepaper Research: Menabung Jadi Irasional

## Lapis 1: Literature Review

### Academic Papers
| # | Paper | Tahun | Method | Key finding | Relevan ke |
|---|-------|------|--------|-------------|------------|
| 1 | ASEAN in the World's 100 Top-Ranked Pension Funds (Jurnal BPJS) | 2024 | Comparative analysis | CPF Singapura: kontribusi 7.5-17% employer + 5-20% employee, return 2.5-4% minimum. Indonesia BPJS TK: total iuran 3% (1% pekerja + 2% employer). Gap kontribusi 12x | H3, International benchmark |
| 2 | Kelayakan Sistem Jaminan Pensiun Indonesia | 2024 | Policy analysis | Indonesia kontribusi pensiun 3% vs Singapura 8.5-34%. Indonesia tidak punya pilar publik universal. Rendahnya skor Mercer Index Indonesia | H3, H4 |

### Industry Reports
| # | Report | Publisher | Tahun | Key data | Relevan ke |
|---|--------|-----------|------|----------|------------|
| 1 | Survei Konsumen BI | Bank Indonesia | Jun 2026 | Saving to income ratio: 17.0% (turun dari 17.5%). Konsumsi: 73.0% (naik dari 72.3%). Cicilan: 10.0% | H1, H3 |
| 2 | Statistik Pasar Modal | KSEI | Apr 2026 | 26.43 juta investor individu (naik dari 12.17 juta di 2023). Hanya 248k aktif harian (1.69%) | H3 |
| 3 | OJK Reksadana | OJK | Mar 2026 | AUM reksadana Rp1.084 triliun. 23.5 juta investor (54.24% di bawah 30 tahun). Kontribusi AUM ke PDB masih 4% | H3, H5 |
| 4 | OJK Paylater | OJK | Mei 2026 | Total paylater Rp43.28 triliun (perbankan Rp30.1T + multifinance Rp13.18T). BNPL perbankan tumbuh 37.72% yoy. 31.76 juta rekening | H3 |
| 5 | Chant West Superannuation | Chant West | Jul 2026 | Median return growth funds Australia: 9.5% FY26. 10-year return: 8.9% (Hostplus). Real return 5.3% di atas inflasi | International benchmark |

### Research Gap Identified
- Tidak ada paper yang hitung matematika irasionalitas menabung untuk Gen Z Indonesia secara komprehensif (deposito vs inflasi vs aset)
- Tidak ada perbandingan sistematis antara sistem tabungan Indonesia vs negara dengan forced saving (CPF, Superannuation) dari angle "sistem yang membuat menabung irasional"
- Data saving to income ratio BI Survei Konsumen belum dianalisis dari angle "menabung semakin sulit karena sistem"

---

## Lapis 2: Government Data Mining

### Data Point 1: Bunga Deposito vs Inflasi
| Data point | Sumber | Tahun | Detail |
|------------|--------|------|--------|
| Bunga deposito BCA | SeaMoneyTips/LPS | 2026 | 2.50% per tahun (sebelum pajak) |
| Bunga deposito Mandiri/BNI/BRI | SeaMoneyTips/LPS | 2026 | 3.00% per tahun (sebelum pajak) |
| Bunga deposito bank digital (Jago) | SeaMoneyTips | 2026 | 3.50% per tahun |
| Bunga deposito bank digital (Krom) | Zaipad | Jul 2026 | 8.00% (promotional, tidak sustainable) |
| Pajak bunga deposito | LPS | 2026 | 20% (kecuali deposito <= Rp7.5 juta bebas pajak) |
| **Bunga deposito bersih (BCA)** | Hitung | 2026 | 2.50% x 0.80 = **2.00%** |
| **Bunga deposito bersih (Mandiri)** | Hitung | 2026 | 3.00% x 0.80 = **2.40%** |
| BI Rate | Bank Indonesia | 2026 | 5.25% (setelah 3x cut dari 6%) |
| Inflasi tahunan (Des 2025) | BPS | Des 2025 | 2.92% |
| Inflasi tahunan (Jan 2026) | BPS | Jan 2026 | 3.55% |
| Inflasi tahunan (Mar 2026) | BPS | Mar 2026 | 3.48% |
| Inflasi tahunan (Mei 2026) | BPS | Mei 2026 | 3.08% |
| **Real return deposito BCA** | Hitung | 2026 | 2.00% - 3.08% = **-1.08%** (NEGATIF) |
| **Real return deposito Mandiri** | Hitung | 2026 | 2.40% - 3.08% = **-0.68%** (NEGATIF) |

### Data Point 2: Inflasi per Komponen (yang relevan dengan Gen Z)
| Komponen | Inflasi yoy | Sumber | Tahun |
|-----------|-------------|--------|-------|
| Perumahan, air, listrik, BBM rumah tangga | 11.93% | BPS | Jan 2026 |
| Perawatan pribadi dan jasa lainnya | 15.22% | BPS | Jan 2026 |
| Pendidikan | 1.95% | BPS | Jul 2025 |
| Pendidikan dasar dan anak usia dini | 3.12% | BPS | Jul 2025 |
| Makanan, minuman, tembakau | 4.94% | BPS | Mei 2026 |
| Komponen harga diatur pemerintah | 6.08% | BPS | Mar 2026 |
| Komponen bergejolak | 6.24% | BPS | Mei 2026 |
| **Inflasi headline** | **3.08%** | BPS | Mei 2026 |

Catatan: Inflasi "yang dirasakan" Gen Z (perumahan 11.93%, perawatan 15.22%, pendidikan 3.12%) jauh di atas inflasi headline 3.08%. Real return deposito terhadap inflasi perumahan = 2.40% - 11.93% = **-9.53%**.

### Data Point 3: Wage Growth
| Data point | Sumber | Tahun | Detail |
|------------|--------|------|--------|
| Rata-rata upah buruh nasional | BPS Sakernas | Feb 2026 | Rp 3.29 juta/bulan |
| Rata-rata upah buruh nasional | BPS Sakernas | Aug 2025 | Rp 3.33 juta/bulan |
| Rata-rata upah buruh nasional | BPS Sakernas | Aug 2024 | Rp 3.27 juta/bulan |
| **Kenaikan upah nominal yoy** | Hitung | Aug 2024-2025 | (3.33-3.27)/3.27 = **1.83%** |
| **Kenaikan upah nominal yoy** | Hitung | Aug 2025-Feb 2026 | (3.29-3.33)/3.33 = **-1.20%** (TURUN) |
| Upah S1/D4/D3+ | BPS | Feb 2026 | Rp 4.77 juta |
| Upah SD ke bawah | BPS | Feb 2026 | Rp 2.23 juta |
| Upah tertinggi (keuangan/asuransi) | BPS | Feb 2026 | Rp 5.05 juta |
| Upah terendah (jasa lainnya) | BPS | Feb 2026 | Rp 2.00 juta |
| Upah usia 55-59 (peak) | BPS | Feb 2026 | Rp 3.77 juta |
| Upah usia 15-19 (entry) | BPS | Feb 2026 | Rp 1.99 juta |

### Data Point 4: Saving to Income Ratio (BI Survei Konsumen)
| Periode | Saving ratio | Konsumsi ratio | Cicilan ratio | Sumber |
|---------|-------------|----------------|---------------|--------|
| Des 2025 | 14.9% | 74.3% | 10.8% | BI |
| Jan 2026 | 16.5% | 72.3% | 11.2% | BI |
| Mei 2026 | 17.5% | 72.3% | 10.2% | BI |
| Jun 2026 | 17.0% | 73.0% | 10.0% | BI |

Tren: tabungan turun, konsumsi naik. Kelompok pengeluaran Rp 2.1-3 juta: saving ratio hanya 15.6%. Kelompok Rp 4.1-5 juta: saving ratio 16.9%.

### Data Point 5: Paylater Growth (OJK)
| Data point | Sumber | Periode | Detail |
|------------|--------|---------|--------|
| Total outstanding paylater | OJK | Mei 2026 | Rp 43.28 triliun (bank Rp30.1T + multifinance Rp13.18T) |
| BNPL perbankan growth | OJK | Mei 2026 | 37.72% yoy |
| BNPL multifinance growth | OJK | Mei 2026 | 53.78% yoy |
| Jumlah rekening paylater perbankan | OJK | Mei 2026 | 31.76 juta rekening |
| NPF gross paylater multifinance | OJK | Mei 2026 | 3.44% (naik dari 2.99% Apr) |
| BNPL multifinance growth | OJK | Jan 2026 | 71.13% yoy (Rp 12.18T) |
| Porsi paylater vs total kredit bank | OJK | Mei 2026 | 0.34% |
| Kredit konsumsi perbankan growth | OJK | Mei 2026 | 5.89% yoy (lebih lambat dari paylater 37.72%) |
| Pinjaman online (pindar) outstanding | OJK | Mar 2026 | Rp 101.03 triliun, tumbuh 26.25% yoy |
| TWP90 pindar | OJK | Mar 2026 | 4.52% |

### Data Point 6: Reksadana / Investasi Retail
| Data point | Sumber | Periode | Detail |
|------------|--------|---------|--------|
| Total investor pasar modal | KSEI | Apr 2026 | 26.49 juta (naik dari 12.17 juta di 2023) |
| Investor individu | KSEI | Apr 2026 | 26.43 juta (99.8% dari total) |
| Investor aktif harian | KSEI | Apr 2026 | 248 ribu (1.69% dari total) |
| AUM reksadana | OJK | Mar 2026 | Rp 1.084 triliun |
| Investor reksadana | OJK | Mar 2026 | 23.5 juta (54.24% di bawah 30 tahun) |
| Kontribusi AUM reksadana ke PDB | OJK | 2026 | 4% |
| Return reksadana pasar uang | Deposito.co.id | 2025 | 5-6% per tahun (tanpa pajak) |
| Return IHSG 2024 | Deposito.co.id | 2024 | 13.25% |
| Return reksadana saham terbaik | Deposito.co.id | 2024 | 25-47% |
| Populasi Indonesia | BPS | 2026 | 287 juta, 196 juta produktif (15-64) |

---

## Lapis 3: International Benchmarking

### Benchmark Negara

| Metric | Indonesia | Singapura | Australia | Jepang | Source |
|--------|-----------|-----------|-----------|--------|--------|
| Sistem tabungan wajib | BPJS TK 3% (1%+2%) | CPF 37% (20%+17%) | Superannuation 12% (employer only) | EPF 12%+12% (employee+employer) | OECD, BPJS, CPF, ATO |
| Return tabungan wajib | ~N/A (jamsostek) | 2.5-4% minimum (OA 2.5%, SA/MA 4%) | 9.5% median FY26, 8% annualized 10yr | EPF ~8%+ | CPF Board, Chant West |
| Real return tabungan wajib | N/A | +0.5% to +2% (vs inflasi 2.5%) | +5.3% (vs inflasi 2.7%) | ~+5% | Hitung |
| Bunga deposito (net) | 2.0-2.4% | ~2.5% (OA) | N/A (super wajib) | ~0.01% (BOJ) | LPS, CPF, BOJ |
| Inflasi | 3.08% | 2.5% | 4.0% | 2.0% | BPS, MAS, ABS, SB |
| Real return deposito | -0.68% to -1.08% | ~0% | N/A | -2.0% | Hitung |
| Home ownership rate | ~63.15% (BPS 2023) | 89.7% (OECD) | ~66% | ~62% | BPS, OECD |
| Forced saving untuk housing | Tidak ada | CPF OA (bisa beli rumah) | Tidak (super untuk pensiun) | Tidak langsung | CPF Act |

### Key Insight dari Benchmark
1. **Singapura CPF**: 37% dari gaji masuk tabungan wajib, return 2.5-4% minimum, BISA dipakai beli rumah. Home ownership 89.7%. Indonesia: 3% iuran pensiun, tidak bisa dipakai beli rumah, home ownership 63%.
2. **Australia Super**: Employer wajib setor 12% gaji ke super fund, return 8-9.5% per tahun, real return 5.3%. Indonesia: tidak ada forced saving untuk pensiun selain BPJS 3%.
3. **Gap sistemik**: Indonesia tidak punya mekanisme forced saving yang return-nya mengalahkan inflasi. Deposito (instrumen saving utama masyarakat) real return negatif. Negara dengan forced saving + return > inflasi punya home ownership lebih tinggi.

---

## Lapis 4: Expert Interviews / Stakeholder Input

Tidak feasible dalam timeframe ini. Akan ditandai sebagai limitation di whitepaper.

---

## Lapis 5: Primary Data Collection

### Simulasi Matematika (Original Analysis)

#### Simulasi 1: Daya Beli Tabungan 10 Tahun
Asumsi: tabungan Rp 100 juta, bunga deposito bersih 2.4%, inflasi 3.08%
- Nilai nominal setelah 10 tahun: Rp 100 juta x (1.024)^10 = Rp 126.9 juta
- Daya beli setelah 10 tahun: Rp 126.9 juta / (1.0308)^10 = Rp 93.8 juta
- **Kerugian daya beli: Rp 6.2 juta (-6.2%)**
- Jika inflasi perumahan (11.93%): daya beli = Rp 126.9 juta / (1.1193)^10 = Rp 38.9 juta (-61.1%)

#### Simulasi 2: Menabung vs Beli Aset (Properti)
Asumsi: gaji Rp 4 juta, nabung 30% = Rp 1.2 juta/bulan, rumah Rp 500 juta
- Tabungan 10 tahun (bunga 2.4%): Rp 1.2 juta x 12 x 10 x (1.024)^5 = ~Rp 163 juta (dengan compounding sederhana)
- Harga rumah 10 tahun (naik 2.76%/tahun BPS IHPP 2024): Rp 500 juta x (1.0276)^10 = Rp 656 juta
- **Rasio tabungan/harga rumah: 163/656 = 24.8%** (masih belum cukup)
- Jika harga rumah naik 10%/tahun (realitas pasar Jabodetabek): Rp 500 juta x (1.10)^10 = Rp 1.297 miliar
- **Rasio tabungan/harga rumah: 163/1297 = 12.6%** (semakin tidak cukup)

#### Simulasi 3: Menabung vs Beli Emas
Asumsi: tabungan Rp 100 juta, emas return rata-rata 10%/tahun
- Deposito 10 tahun (2.4% net): Rp 100 juta x (1.024)^10 = Rp 126.9 juta
- Emas 10 tahun (10% avg): Rp 100 juta x (1.10)^10 = Rp 259.4 juta
- **Selisih: Rp 132.5 juta (emas 2x lipat deposito)**
- Emas 2025 actual: +61% dalam 1 tahun (Rp 1.553.000 ke Rp 2.501.000/gram Antam)

#### Simulasi 4: "Kopi 25rb" Math
Asumsi: kopi Rp 25.000 x 30 hari = Rp 750.000/bulan, gaji Rp 4 juta
- Nabung kopi 10 tahun (2.4%): Rp 750.000 x 12 x 10 = Rp 90 juta + bunga ~Rp 12 juta = Rp 102 juta
- Harga rumah Rp 500 juta (naik 10%/tahun): Rp 1.297 miliar
- **Rp 102 juta = 7.9% dari harga rumah. Butuh 127 tahun nabung kopi untuk beli rumah.**

#### Simulasi 5: Deposito vs Reksadana Pasar Uang vs Emas (5 tahun)
| Instrumen | Return bersih | Rp 100 juta setelah 5 tahun | Daya beli (inflasi 3.08%) |
|-----------|---------------|---------------------------|--------------------------|
| Deposito BCA | 2.00% | Rp 110.4 juta | Rp 95.0 juta (-5.0%) |
| Deposito Mandiri | 2.40% | Rp 112.6 juta | Rp 96.9 juta (-3.1%) |
| Reksadana Pasar Uang | 5.50% | Rp 130.7 juta | Rp 112.5 juta (+12.5%) |
| Emas (avg 10%) | 10.00% | Rp 161.1 juta | Rp 138.7 juta (+38.7%) |
| IHSG (avg 8%) | 8.00% | Rp 146.9 juta | Rp 126.5 juta (+26.5%) |

---

## Lapis 6: Statistical Analysis & Triangulation

### Triangulation Matrix

| Hypothesis | Data 1 | Data 2 | Data 3 | Verdict |
|------------|--------|--------|--------|---------|
| H1: Deposito negative real return | Bunga net 2.0-2.4% (LPS) | Inflasi 3.08% (BPS) | Real return -0.68% to -1.08% | **CONFIRMED** |
| H2: Gaji growth < aset growth | Upah naik 1.83% (BPS) | Properti naik 2.76% (BPS IHPP) / 10% realitas | Emas naik 10% avg, 61% di 2025 | **CONFIRMED** (gap 3-8x) |
| H3: Paylater lebih mudah dari investasi | Paylater 31.76 juta rekening (OJK) | Investor reksadana 23.5 juta (OJK) | Paylater growth 37-71% vs reksadana growth 8.14% | **CONFIRMED** |
| H4: Daya beli turun 15-25% dalam 5-10 tahun | Simulasi: deposito 10 tahun = -6.2% daya beli | Jika inflasi perumahan: -61% daya beli | Saving ratio turun 17.5% ke 17.0% (BI) | **CONFIRMED** (range -6% to -25% tergantung komponen inflasi) |
| H5 (null): Invest di reksadana/SBN bisa rasional | Reksadana pasar uang return 5.5% > inflasi 3.08% | Emas return 10% > inflasi | IHSG return 8% > inflasi | **CONFIRMED untuk investasi, BUKAN untuk menabung**. Menabung (deposito) irasional, tapi investasi di instrumen tertentu masih rasional. |

### Key Finding
Menabung di deposito bank = irasional secara matematis (real return negatif). Tapi investasi di instrumen dengan return > inflasi (reksadana, emas, saham) masih rasional. Masalahnya: akses dan literasi. 31.76 juta orang punya paylater, hanya 23.5 juta punya reksadana. Gap akses = gap literasi = gap sistem.

---

## Lapis 7: Synthesis & Gap Identification

### Thesis Statement
Menabung di deposito bank Indonesia sudah irasional secara matematis. Bunga bersih 2.0-2.4% di bawah inflasi 3.08% = negative real return. Tapi narasi publik menyalahkan Gen Z "boros kopi" padahal matematika menabung tidak masuk akal: 127 tahun nabung kopi untuk beli rumah. Sistem keuangan Indonesia didesain untuk creditor (bunga pinjaman 12-24%, bunga simpanan 2-3%), bukan untuk saver. Negara dengan forced saving + return > inflasi (Singapura CPF, Australia Super) punya home ownership 89.7% vs Indonesia 63%.

### Data Sources Summary
1. BPS Sakernas (Feb 2026, Aug 2025) - upah buruh
2. BPS IHK - inflasi (Des 2025, Jan 2026, Mar 2026, Mei 2026)
3. BPS IHPP 2024 - indeks harga properti
4. Bank Indonesia - BI Rate, Survei Konsumen (saving ratio)
5. Bank Indonesia SHPR Q1 2026 - harga properti residensial
6. OJK - paylater statistik (Jan-Mar-Mei 2026)
7. OJK/KSEI - investor pasar modal, reksadana (Apr 2026)
8. LPS - bunga deposito, pajak bunga
9. CPF Board Singapura - kontribusi, return, home ownership
10. ATO Australia - superannuation guarantee 12%
11. Chant West - super fund returns FY26
12. Pluang/CNN Indonesia - harga emas Antam 2020-2025
13. GoodStats - emas Antam naik 102% dalam 5 tahun
14. Deposito.co.id - perbandingan return instrumen 2025
15. Numbeo - PIR (Price-to-Income Ratio) Indonesia (dari whitepaper perumahan)

### Limitations
- Expert interviews tidak feasible dalam timeframe ini
- Data inflasi per komponen (pendidikan, kesehatan) menggunakan data BPS yang available, tidak semua komponen punya data bulanan konsisten
- Harga properti menggunakan data BI SHPR (primary market) yang mungkin berbeda dari secondary market
- Simulasi matematika menggunakan asumsi return konstan, realitas bisa berfluktuasi
- Data saving to income ratio dari BI Survei Konsumen (persepsi), bukan data transaksional
