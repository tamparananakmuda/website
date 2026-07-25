Artikel
artikel-01-idea
artikel-02-research
artikel-03-outline
artikel-04-draft
artikel-05-review
artikel-06-build
artikel-07-qc
artikel-08-humanizer
artikel-09-publish
artikel-10-distribution
artikel-11-monitor
artikel-12-update
Konten Berseri
series-01-theme
series-02-framework
series-03-roadmap
series-04-outline
series-05-draft
series-06-review
series-07-build
series-08-qc
series-09-humanizer
series-10-schedule
series-11-publish
series-12-distribution
series-13-monitor
series-14-iterate
White Paper
whitepaper-01-problem
whitepaper-02-research
whitepaper-03-thesis
whitepaper-04-outline
whitepaper-05-draft
whitepaper-06-sme-review
whitepaper-07-design
whitepaper-08-build
whitepaper-09-qc
whitepaper-10-humanizer
whitepaper-11-publish
whitepaper-12-promotion
whitepaper-13-update
Definisi Tiap State
artikel-01-idea
Menentukan topik
Target audience
Search intent
Goal artikel
artikel-02-research
Keyword research
Competitor analysis
Data pendukung
Referensi
artikel-03-outline
Struktur H1-H4
FAQ
CTA
Internal linking plan
artikel-04-draft
Menulis artikel lengkap
artikel-05-review
Review editorial
Validasi fakta
Cek logika
artikel-06-build
Upload ke CMS
Meta SEO
Schema
Gambar
Internal & external link
artikel-07-qc
Grammar
SEO
Broken link
Formatting
Readability
artikel-08-humanizer
Perbaiki flow
Hilangkan pola AI
Tambahkan contoh
Natural tone
artikel-09-publish
Publish
artikel-10-distribution
Social media
Newsletter
Syndication
artikel-11-monitor
Ranking
CTR
Traffic
Engagement
artikel-12-update
Refresh konten
Update data
Tambah insight
Workflow Konten Berseri
series-01-theme

Menentukan tema utama.

series-02-framework

Menentukan alur pembelajaran atau storytelling.

series-03-roadmap

Membagi menjadi episode.

series-04-outline

Outline setiap episode.

series-05-draft

Menulis seluruh episode.

series-06-review

Review kesinambungan antar episode.

series-07-build

CMS, internal link, previous/next navigation.

series-08-qc

Grammar, fakta, konsistensi.

series-09-humanizer

Menyamakan tone seluruh seri.

series-10-schedule

Jadwal rilis.

series-11-publish

Publikasi.

series-12-distribution

Promosi setiap episode.

series-13-monitor

Retention, completion rate, engagement.

series-14-iterate

Perbaikan roadmap berdasarkan data.

Workflow White Paper
whitepaper-01-problem

Identifikasi masalah utama.

whitepaper-02-research

Mengumpulkan data, jurnal, statistik, studi kasus.

whitepaper-03-thesis

Menentukan argumen utama.

whitepaper-04-outline

Executive Summary → Background → Analysis → Recommendation → Conclusion.

whitepaper-05-draft

Menulis dokumen lengkap.

whitepaper-06-sme-review

Review oleh Subject Matter Expert.

whitepaper-07-design

Layout PDF, grafik, tabel, ilustrasi.

whitepaper-08-build

Finalisasi dokumen dan landing page.

whitepaper-09-qc

Sitasi, data, tata bahasa, konsistensi visual.

whitepaper-10-humanizer

Membuat bahasa lebih natural tanpa mengurangi kredibilitas.

whitepaper-11-publish

Publikasi PDF atau landing page.

whitepaper-12-promotion

Email, webinar, media sosial, PR.

whitepaper-13-update

Revisi jika ada data atau temuan baru.

Saran untuk Devin

Kalau Devin akan mengorkestrasi seluruh pipeline, saya justru akan menyeragamkan semua workflow supaya setiap agent memakai state yang sama. Perbedaannya hanya pada state yang di-skip.

01-idea
02-research
03-strategy
04-outline
05-draft
06-review
07-design
08-build
09-qc
10-humanizer
11-publish
12-distribution
13-monitor
14-update

Lalu setiap jenis konten cukup memiliki konfigurasi:

article:
  enabled:
    - idea
    - research
    - outline
    - draft
    - review
    - build
    - qc
    - humanizer
    - publish
    - distribution
    - monitor
    - update

series:
  enabled:
    - idea
    - strategy
    - research
    - outline
    - draft
    - review
    - build
    - qc
    - humanizer
    - publish
    - distribution
    - monitor
    - update

whitepaper:
  enabled:
    - idea
    - research
    - strategy
    - outline
    - draft
    - review
    - design
    - build
    - qc
    - humanizer
    - publish
    - distribution
    - monitor
    - update