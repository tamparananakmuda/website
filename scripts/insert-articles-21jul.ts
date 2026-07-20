const { readFileSync } = require('fs');
const { join } = require('path');
const envPath = join(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
envContent.split('\n').forEach((line) => {
  const t = line.trim();
  if (!t || t.startsWith('#')) return;
  const i = t.indexOf('=');
  if (i === -1) return;
  const k = t.substring(0, i).trim();
  const v = t.substring(i + 1).trim();
  if (!process.env[k]) process.env[k] = v;
});

const { db } = require('../lib/db');
const { posts, categories, authors, subcategories } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');

const CATEGORY_UANG = '62d4cac7-789f-4d35-9cd8-35f25a5bb042';
const CATEGORY_MINDSET = '3a71ab8a-526f-4d19-a434-f54814f233dd';
const CATEGORY_TEKNOLOGI = '92366694-94ef-419c-bb1a-cfd502b0d028';
const SUB_KEUANGAN = 'keuangan-uang';
const SUB_MINDSET_REALITA = 'mindset-realita';
const SUB_TEKNOLOGI_AI = 'teknologi-ai';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

const articles = [
  {
    title: 'Doom Spending Bukan Self-Care, Itu Gejala Menyerah',
    slug: 'doom-spending-bukan-self-care-itu-gejala-menyerah',
    excerpt: 'Belanja impulsif bukan self-reward. Itu reaksi rasional terhadap sistem yang terasa tidak rasional. Tapi reaksi yang tidak akan pernah mengubah sistem.',
    body: readFileSync('/tmp/tam-article-14-body.md', 'utf8').trim(),
    categoryId: CATEGORY_UANG,
    subcategorySlug: SUB_KEUANGAN,
    povTag: 'tamparan',
    ogHeadline: 'Belanja saat stres bukan self-care, itu gejala',
    seoMetaTitle: 'Doom Spending Bukan Self-Care, Itu Gejala Menyerah | TAM',
    seoMetaDescription: 'Belanja impulsif bukan self-reward. Itu reaksi rasional terhadap sistem yang terasa tidak rasional. Tapi reaksi yang tidak akan pernah mengubah sistem.',
    seoKeywords: ['doom spending gen z', 'belanja impulsif gen z', 'gen z keuangan Indonesia', 'self reward berlebihan', 'high time preference'],
    publishedAt: '2026-07-21T01:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://money.kompas.com/read/2026/06/19/144350226/sulit-cari-kerja-dan-biaya-hidup-naik-generasi-muda-pilih-nikmati-uang-hari-ini', label: 'Kompas.com: Sulit Cari Kerja dan Biaya Hidup Naik' },
      { type: 'link', url: 'https://money.kompas.com/read/2026/05/17/163500026/deloitte-gen-z-dan-milenial-menunda-masa-depan-karena-tekanan-keuangan', label: 'Kompas.com: Deloitte Gen Z Menunda Masa Depan' },
      { type: 'link', url: 'https://money.kompas.com/read/2026/06/17/170325926/cari-kerja-bukan-masalah-gen-z-justru-khawatir-sulit-mapan', label: 'Kompas.com: Gen Z Khawatir Sulit Mapan' },
    ],
  },
  {
    title: 'Toxic Productivity: Istirahat Terasa Seperti Kejahatan',
    slug: 'toxic-productivity-istirahat-terasa-seperti-kejahatan',
    excerpt: 'Kamu merasa bersalah saat beristirahat? Cemas kalau tidak produktif? Ini bukan produktivitas, ini toxic.',
    body: readFileSync('/tmp/tam-article-15-body.md', 'utf8').trim(),
    categoryId: CATEGORY_MINDSET,
    subcategorySlug: SUB_MINDSET_REALITA,
    povTag: 'refleksi',
    ogHeadline: 'Istirahat terasa seperti kejahatan? Itu toxic',
    seoMetaTitle: 'Toxic Productivity: Istirahat Terasa Seperti Kejahatan | TAM',
    seoMetaDescription: 'Kamu merasa bersalah saat beristirahat. Cemas kalau tidak produktif. Memaksa diri terus bergerak meski sudah lelah. Ini toxic.',
    seoKeywords: ['toxic productivity gen z', 'burnout gen z Indonesia', 'istirahat bersalah', 'hustle culture gen z', 'work life balance gen z'],
    publishedAt: '2026-07-21T05:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://lestari.kompas.com/read/2026/05/29/134455586/survei-deloitte-kesehatan-mental-jadi-prioritas-utama-pekerja-muda', label: 'Kompas.com: Survei Deloitte Kesehatan Mental Pekerja Muda' },
      { type: 'link', url: 'https://mindset.viva.co.id/tren/9694-produktif-tapi-burnout-paradoks-gen-z-di-era-serba-cepat', label: 'Viva.co.id: Produktif Tapi Burnout' },
      { type: 'link', url: 'https://komentar-news.com/gen-z-2026-mulai-tinggalkan-glorifikasi-burnout-dan-hustle-culture-beralih-ke-slow-living-wellness/', label: 'KomentarNews: Gen Z Tinggalkan Hustle Culture' },
      { type: 'link', url: 'https://lifestyle.kompas.com/read/2026/06/26/170000020/anak-muda-lebih-rentan-stres-di-tempat-kerja-ini-penyebabnya-menurut', label: 'Kompas.com: Anak Muda Rentan Stres di Tempat Kerja' },
    ],
  },
  {
    title: 'Kripto Bukan Investasi Kalau Ikut FOMO',
    slug: 'kripto-bukan-investasi-kalau-ikut-fomo',
    excerpt: '60 persen pasar kripto Indonesia diisi Gen Z. Tapi OJK ingatkan: partisipasi tinggi belum berarti literasi tinggi. FOMO bukan strategi investasi.',
    body: readFileSync('/tmp/tam-article-16-body.md', 'utf8').trim(),
    categoryId: CATEGORY_TEKNOLOGI,
    subcategorySlug: SUB_TEKNOLOGI_AI,
    povTag: 'kontra-narasi',
    ogHeadline: 'Beli kripto karena FOMO? Itu spekulasi',
    seoMetaTitle: 'Kripto Bukan Investasi Kalau Ikut FOMO | TAM',
    seoMetaDescription: '60 persen pasar kripto Indonesia diisi Gen Z. Tapi OJK ingatkan: partisipasi tinggi belum berarti literasi tinggi. FOMO bukan strategi investasi.',
    seoKeywords: ['investasi kripto gen z', 'FOMO kripto Indonesia', 'literasi keuangan gen z', 'kripto vs reksa dana', 'investasi pemula Indonesia'],
    publishedAt: '2026-07-21T10:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://investasi.kontan.co.id/news/gen-z-kuasai-60-pasar-kripto-di-indonesia-ini-alasan-mereka-agresif', label: 'Kontan: Gen Z Kuasai 60% Pasar Kripto' },
      { type: 'link', url: 'https://www.liputan6.com/crypto/read/6318584/partisipasi-generasi-muda-di-pasar-kripto-tinggi-ojk-cermati-soal-literasi-keuangan', label: 'Liputan6: OJK Cermati Literasi Kripto' },
      { type: 'link', url: 'https://sumsel.suara.com/read/2026/04/23/202503/gen-z-pilih-kripto-atau-reksa-dana-aprdi-ungkap-tren-investasi-anak-muda-di-2026', label: 'Suara: APRDI Ungkap Tren Investasi Gen Z' },
      { type: 'link', url: 'https://journal.admi.or.id/index.php/JEKMA/article/view/2724', label: 'Jurnal: Pengaruh Media Sosial pada Investasi Kripto Gen Z' },
    ],
  },
];

async function insert() {
  for (const a of articles) {
    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, a.slug));
    if (existing.length > 0) {
      console.log('SKIP (already exists):', a.slug);
      continue;
    }
    const sub = await db.select().from(subcategories).where(eq(subcategories.slug, a.subcategorySlug)).limit(1);
    const subId = sub[0]?.id || null;

    await db.insert(posts).values({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      body: a.body,
      categoryId: a.categoryId,
      subcategoryId: subId,
      authorId: AUTHOR_ID,
      status: 'scheduled',
      povTag: a.povTag,
      humanSignature: true,
      factCheckStatus: 'verified',
      reviewStatus: 'publish',
      sourceReferences: a.sourceReferences,
      seoMetaTitle: a.seoMetaTitle,
      seoMetaDescription: a.seoMetaDescription,
      seoKeywords: a.seoKeywords,
      ogHeadline: a.ogHeadline,
      publishedAt: a.publishedAt,
    });
    console.log('INSERTED:', a.slug);
  }
  console.log('DONE ALL');
  process.exit(0);
}

insert().catch(e => { console.error(e); process.exit(1); });
