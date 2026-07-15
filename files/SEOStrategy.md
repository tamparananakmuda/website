# SEO Strategy TAM

Strategi SEO untuk TAMPARAN ANAK MUDA: pillar-cluster model, keyword research, internal linking, dan technical SEO.

---

## 1. Pendekatan: Pillar-Cluster Model

Setiap pillar = 1 hub page. Sub-topik dalam pillar = cluster articles. Semua cluster articles link ke hub page dan ke each other.

```
Hub Page (/kategori/[slug])
  ├── Cluster Article 1 (/artikel/[slug-1])
  ├── Cluster Article 2 (/artikel/[slug-2])
  ├── Cluster Article 3 (/artikel/[slug-3])
  └── ...
```

**Tujuan:** Topical authority. Saat Google melihat TAM punya 10+ artikel mendalam tentang "uang anak muda", TAM dianggap otoritas untuk topik itu.

## 2. Hub Pages (Kategori)

6 kategori utama = 6 hub pages:

| Kategori | URL | Pillar Count | Target Authority |
|---|---|---|---|
| Mindset | /kategori/mindset | 3 pillars | Mindset, psikologi, filosofi |
| Karier | /kategori/karier | 4 pillars | Karier, produktivitas, komunikasi, pendidikan |
| Uang | /kategori/uang | 1 pillar | Keuangan + cara dapat uang |
| Bisnis | /kategori/bisnis | 2 pillars | Bisnis, skill masa depan |
| Teknologi | /kategori/teknologi | 2 pillars | Teknologi, analisis fenomena |
| Kehidupan | /kategori/kehidupan | 4 pillars | Hubungan, lifestyle, sejarah, ulasan buku |

## 3. Keyword Strategy

### Priority Keywords (berdasarkan search volume + relevance)

**Tier 1: Quick wins (low competition, decent volume)**
- "cara mengatur gaji pertama"
- "impostor syndrome kerja"
- "freelance untuk pemula"
- "pinjaman online bahaya"
- "deep work cara fokus"

**Tier 2: Strategic (medium competition, high volume)**
- "mindset sukses anak muda"
- "finansial anak muda indonesia"
- "cara mulai bisnis online"
- "skill masa depan 2025"
- "quarter life crisis"

**Tier 3: Authority building (high competition, high volume)**
- "cara sukses di usia muda"
- "investasi untuk pemula"
- "pengembangan diri"
- "productivity tips"

### Keyword Research Workflow

1. Mulai dari pillar (contoh: "Uang")
2. Brainstorm topik dalam pillar (budgeting, investasi, hutang, dll)
3. Riset keyword per topik pakai Google Keyword Planner / Ahrefs / Ubersuggest
4. Pilih keyword dengan intent yang cocok dengan angle TAM
5. Isi SEO brief (`files/templates/seo-brief-template.md`)
6. Cek top 3 di Google untuk keyword tersebut
7. Tulis artikel yang lebih baik dari ketiganya

### Search Intent Mapping

| Intent | Jenis Artikel | POV Tag | Contoh |
|---|---|---|---|
| Informational | Analisis, refleksi | kontra-narasi, refleksi, data | "Kenapa Gen Z sulit beli rumah" |
| Comparison | VS, pilihan | data, framework | "Nabung vs investasi: mana duluan?" |
| Transactional | Panduan, tutorial | panduan, framework | "Cara buat CV yang dilirik HRD" |

## 4. Internal Linking Rules

### Wajib
- Setiap artikel: minimal 2 link ke artikel TAM lain
- Setiap artikel: 1 link ke kategori/pillar page (hub page)
- Seri konten: link antar artikel dalam seri (prev/next)

### Best Practices
- Anchor text deskriptif, bukan "klik di sini" atau "baca selengkapnya"
- Link natural dalam konteks kalimat, bukan di footer atau sidebar
- Link ke artikel yang relevan secara topik, bukan forced
- Jangan over-link: max 5 internal links per 1.000 kata

### Auto-Suggest (Fase 2)
Saat writer drafting di admin panel, sistem auto-suggest artikel terkait dari:
- Subcategory yang sama
- Tags yang sama
- Keyword yang overlap

## 5. URL Structure

| Content Type | URL Pattern | Contoh |
|---|---|---|
| Artikel | /artikel/[slug] | /artikel/kenapa-kerja-keras-tidak-cukup |
| Kategori | /kategori/[slug] | /kategori/mindset |
| Seri | /seri/[slug] | /seri/dari-0-sampai-kerja |
| Whitepaper | /whitepaper/[slug] | /whitepaper/guide-keuangan-anak-muda |
| Sosial | /sosial/[id] | /sosial/123 |

**Aturan slug:**
- lowercase, hyphen-separated
- max 60 karakter
- include keyword utama jika natural
- no stop words (yang, di, ke, dari) kecuali judul terdengar aneh tanpa itu

## 6. Meta Tags Template

### SEO Title (max 70 karakter)
```
[Judul Artikel] | TAMPARAN ANAK MUDA
```
Atau tanpa brand jika judul sudah panjang:
```
[Judul Artikel]
```

### Meta Description (max 160 karakter)
```
[1-2 kalimat yang menjelaskan angle TAM, bukan rangkuman generic]
```

### OG Title (max 50 karakter)
```
[Judul Artikel]
```

### OG Description
```
[Excerpt artikel, max 180 karakter]
```

## 7. Schema Markup

Sudah diimplementasi di website:
- `ArticleSchema` untuk artikel
- `OrganizationSchema` untuk organisasi
- `AboutPageSchema` untuk halaman tentang
- `CollectionPageSchema` untuk halaman kategori

**To-do (Fase 2):**
- `BreadcrumbSchema` untuk navigasi
- `FAQSchema` untuk artikel dengan Q&A format
- `ItemListSchema` untuk halaman seri

## 8. Technical SEO Checklist

- [ ] Sitemap auto-generate (`app/sitemap.ts`) - sudah ada
- [ ] Robots.txt (`app/robots.ts`) - sudah ada
- [ ] RSS feed (`app/rss.xml`) - sudah ada
- [ ] Canonical URLs di semua halaman - sudah ada
- [ ] Open Graph images auto-generate - sudah ada
- [ ] Mobile responsive - sudah ada
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Image optimization (next/image) - sudah ada
- [ ] Page speed: target < 3s LCP di mobile 4G

## 9. Content Refresh Strategy

Artikel evergreen perlu di-refresh setiap 6-12 bulan:

1. Identifikasi artikel dengan traffic menurun (Google Search Console)
2. Update data, statistik, dan contoh terbaru
3. Tambah internal links ke artikel baru yang relevan
4. Update `updated_at` timestamp
5. Re-submit ke Google via Search Console

**Prioritas refresh:** Artikel dengan pageview > 100/bulan yang belum di-update > 12 bulan.

## 10. Measurement

| Metric | Tool | Frekuensi |
|---|---|---|
| Organic traffic | Google Search Console | Mingguan |
| Keyword ranking | GSC / Ahrefs | Mingguan |
| CTR (impressions vs clicks) | GSC | Bulanan |
| Average position | GSC | Bulanan |
| Page views per pillar | Internal analytics | Bulanan |
| Internal link clicks | Internal analytics | Bulanan |
| Time on page | Internal analytics | Bulanan |
| Bounce rate | Internal analytics | Bulanan |

Target:
- Organic traffic tumbuh 20% per bulan
- 10 keyword di top 3 Google dalam 6 bulan
- 50 keyword di top 10 Google dalam 12 bulan
- CTR > 3% untuk artikel di top 10
