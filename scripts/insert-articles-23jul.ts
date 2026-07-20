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
const { posts, subcategories } = require('../lib/db/schema');
const { eq } = require('drizzle-orm');

const CATEGORY_KEHIDUPAN = '3f5fcde6-2a00-418b-88a6-4b485c122067';
const CATEGORY_TEKNOLOGI = '92366694-94ef-419c-bb1a-cfd502b0d028';
const CATEGORY_UANG = '62d4cac7-789f-4d35-9cd8-35f25a5bb042';
const SUB_KEHIDUPAN_SOSIAL = 'hubungan-sosial';
const SUB_TEKNOLOGI_AI = 'teknologi-ai';
const SUB_UANG_KEUANGAN = 'keuangan-uang';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

const articles = [
  {
    title: 'Mau Menikah Bukan Tidak Mau: Ekonomi yang Menghalangi Gen Z',
    slug: 'mau-menikah-bukan-tidak-mau-ekonomi-yang-menghalangi-gen-z',
    excerpt: 'Gen Z sering dianggap tidak mau menikah. Tapi survei UNFPA menunjukkan dua pertiga ingin berkeluarga. Yang menghalangi bukan sikap, tapi ekonomi.',
    body: readFileSync('/tmp/tam-article-20-body.md', 'utf8').trim(),
    categoryId: CATEGORY_KEHIDUPAN,
    subcategorySlug: SUB_KEHIDUPAN_SOSIAL,
    povTag: 'kontra-narasi',
    ogHeadline: 'Gen Z mau menikah, tapi ekonomi yang tidak mau',
    seoMetaTitle: 'Mau Menikah Bukan Tidak Mau: Ekonomi yang Menghalangi Gen Z | TAM',
    seoMetaDescription: 'Gen Z sering dianggap tidak mau menikah. Tapi survei UNFPA menunjukkan dua pertiga ingin berkeluarga. Yang menghalangi bukan sikap, tapi ekonomi.',
    seoKeywords: ['gen z menikah', 'ekonomi gen z', 'menunda menikah', 'biaya menikah', 'survei UNFPA gen z'],
    publishedAt: '2026-07-23T01:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://lifestyle.kompas.com/read/2026/07/08/191000920/survei-keinginan-menikah-anak-muda-masih-tinggi-biaya-hidup-jadi', label: 'Kompas.com: Survei Keinginan Menikah Anak Muda Masih Tinggi' },
      { type: 'link', url: 'https://www.unfpa.org/sites/default/files/pub-pdf/demographic_futures_survey_2026.pdf', label: 'UNFPA: Demographic Futures Survey 2026' },
      { type: 'link', url: 'https://lestari.kompas.com/read/2026/05/29/134455586/survei-deloitte-kesehatan-mental-jadi-prioritas-utama-pekerja-muda', label: 'Kompas.com: Survei Deloitte Kesehatan Mental Pekerja Muda' },
      { type: 'link', url: 'https://www.idnresearchinstitute.com/economy/doom-spending-gen-z-indonesia-belanja-untuk-lari-dari-kecemasan-00-314l1-rcgwr1', label: 'IDN Research: Doom Spending Gen Z Indonesia' },
    ],
  },
  {
    title: 'Curhat ke AI: Ketika Mesin Jadi Ruang Aman Gen Z',
    slug: 'curhat-ke-ai-ketika-mesin-jadi-ruang-aman-gen-z',
    excerpt: '81 persen Gen Z Indonesia pernah curhat ke AI chatbot. Bukan karena tidak butuh manusia, tapi karena manusia terlalu tidak aman untuk diajak bicara.',
    body: readFileSync('/tmp/tam-article-21-body.md', 'utf8').trim(),
    categoryId: CATEGORY_TEKNOLOGI,
    subcategorySlug: SUB_TEKNOLOGI_AI,
    povTag: 'kontra-narasi',
    ogHeadline: '81% Gen Z curhat ke AI, bukan ke teman',
    seoMetaTitle: 'Curhat ke AI: Ketika Mesin Jadi Ruang Aman Gen Z | TAM',
    seoMetaDescription: '81 persen Gen Z Indonesia pernah curhat ke AI chatbot. Bukan karena tidak butuh manusia, tapi karena manusia terlalu tidak aman untuk diajak bicara.',
    seoKeywords: ['gen z curhat ke ai', 'ai chatbot curhat', 'character ai indonesia', 'kesehatan mental gen z', 'ruang aman gen z'],
    publishedAt: '2026-07-23T05:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://www.idntimes.com/news/indonesia/idn-research-81-gen-z-indonesia-pernah-curhat-ke-ai-ini-alasannya-00-481xk-6fpxpm', label: 'IDN Times: 81 Persen Gen Z Indonesia Pernah Curhat ke AI' },
      { type: 'link', url: 'https://teknologi.bisnis.com/read/20260622/84/1982423/pengguna-ai-di-ri-masih-182-gen-z-jadi-generasi-paling-aktif', label: 'Bisnis.com: Pengguna AI di RI Masih 18,2 Persen' },
      { type: 'link', url: 'https://uzone.id/gemini-ai-didominasi-gen-z-pengguna-muda-sentuh-40-persen', label: 'Uzone.id: Gemini AI Didominasi Gen Z' },
      { type: 'link', url: 'https://bali.antaranews.com/berita/409603/indonesia-jadi-negara-paling-kreatif-gunakan-ai', label: 'Antara News: Indonesia Jadi Negara Paling Kreatif Gunakan AI' },
    ],
  },
  {
    title: 'Overconsumption Core: Gen Z Mulai Kritik Budaya Belanja Berlebihan',
    slug: 'overconsumption-core-gen-z-mulai-kritik-budaya-belanja-berlebihan',
    excerpt: 'Gen Z dulu terkenal dengan haul dan checkout impulsif. Sekarang muncul tren overconsumption core, kritik terhadap budaya belanja berlebihan dari Gen Z sendiri.',
    body: readFileSync('/tmp/tam-article-22-body.md', 'utf8').trim(),
    categoryId: CATEGORY_UANG,
    subcategorySlug: SUB_UANG_KEUANGAN,
    povTag: 'refleksi',
    ogHeadline: 'Gen Z mulai kritik budaya belanja berlebihan',
    seoMetaTitle: 'Overconsumption Core: Gen Z Mulai Kritik Budaya Belanja Berlebihan | TAM',
    seoMetaDescription: 'Gen Z dulu terkenal dengan haul dan checkout impulsif. Sekarang muncul tren overconsumption core, kritik terhadap budaya belanja berlebihan dari Gen Z sendiri.',
    seoKeywords: ['overconsumption core', 'gen z belanja', 'budaya konsumtif', 'flash sale gen z', 'literasi keuangan gen z'],
    publishedAt: '2026-07-23T10:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://yoursay.suara.com/kolom/2026/07/08/143000/overconsumption-core-ketika-gen-z-mulai-kritik-budaya-belanja-berlebihan', label: 'Suara.com: Overconsumption Core: Ketika Gen Z Mulai Kritik Budaya Belanja Berlebihan' },
      { type: 'link', url: 'https://www.merdeka.com/uang/read/8242768/58-persen-gen-z-terlalu-konsumtif-ada-yang-liburan-pakai-dana-pay-later', label: 'Merdeka.com: 58 Persen Gen Z Terlalu Konsumtif' },
      { type: 'link', url: 'https://www.idnresearchinstitute.com/economy/doom-spending-gen-z-indonesia-belanja-untuk-lari-dari-kecemasan-00-314l1-rcgwr1', label: 'IDN Research: Doom Spending Gen Z Indonesia' },
      { type: 'link', url: 'https://yoursay.suara.com/kolom/2026/07/11/070245/dilema-gen-z-di-era-konsumtif-peduli-lingkungan-tapi-masih-suka-flash-sale', label: 'Suara.com: Dilema Gen Z di Era Konsumtif' },
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

    const wordCount = a.body.split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

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
      readingTime,
      publishedAt: a.publishedAt,
      seoMetaTitle: a.seoMetaTitle,
      seoMetaDescription: a.seoMetaDescription,
      ogHeadline: a.ogHeadline,
      seoKeywords: a.seoKeywords,
    });

    console.log('INSERTED:', a.slug);
  }
  console.log('DONE ALL');
  process.exit(0);
}

insert().catch(e => { console.error(e); process.exit(1); });
