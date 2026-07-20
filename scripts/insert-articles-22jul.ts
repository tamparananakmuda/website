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

const CATEGORY_KARIER = 'a085b98d-c314-485e-a989-d5fc7078ec04';
const CATEGORY_MINDSET = '3a71ab8a-526f-4d19-a434-f54814f233dd';
const CATEGORY_KEHIDUPAN = '3f5fcde6-2a00-418b-88a6-4b485c122067';
const SUB_KARIER_KERJA = 'karier-dunia-kerja';
const SUB_MINDSET_REALITA = 'mindset-realita';
const SUB_KEHIDUPAN_SOSIAL = 'hubungan-sosial';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

const articles = [
  {
    title: 'LinkedIn Kena Ick: Gen Z Cari Kerja di TikTok, Bukan di Platform Profesional',
    slug: 'linkedin-kena-ick-gen-z-cari-kerja-di-tiktok',
    excerpt: 'Gen Z tidak lagi mengandalkan LinkedIn untuk mencari kerja. Mereka pindah ke TikTok dan Instagram, di mana informasi karier terasa lebih nyata.',
    body: readFileSync('/tmp/tam-article-17-body.md', 'utf8').trim(),
    categoryId: CATEGORY_KARIER,
    subcategorySlug: SUB_KARIER_KERJA,
    povTag: 'kontra-narasi',
    ogHeadline: 'Gen Z cari kerja di TikTok, bukan LinkedIn',
    seoMetaTitle: 'LinkedIn Kena Ick: Gen Z Cari Kerja di TikTok | TAM',
    seoMetaDescription: 'Gen Z tidak lagi mengandalkan LinkedIn untuk mencari kerja. Mereka pindah ke TikTok dan Instagram, di mana informasi karier terasa lebih nyata.',
    seoKeywords: ['gen z cari kerja', 'linkedin vs tiktok', 'transparansi gaji gen z', 'gen z rekrutmen', 'cari kerja media sosial'],
    publishedAt: '2026-07-22T01:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://tekno.kompas.com/read/2026/07/08/19040077/riset-ungkap-keunikan-gen-z-saat-cari-kerja-dan-pilih-kantor', label: 'Kompas.com: Riset Ungkap Keunikan Gen Z Saat Cari Kerja' },
      { type: 'link', url: 'https://periskop.id/ketenagakerjaan/20260708/gen-z-ogah-lamar-kerja-tanpa-info-gaji', label: 'Periskop.id: Gen Z Ogah Lamar Kerja Tanpa Info Gaji' },
      { type: 'link', url: 'https://inmarketing.id/gen-z-cari-kerja-lewat-medsos-pilih-kantor/', label: 'Inmarketing.id: Gen Z Cari Kerja Lewat Medsos' },
      { type: 'link', url: 'https://www.idntimes.com/life/career/mengapa-banyak-gen-z-punya-2-hingga-3-pekerjaan-c1c2-01-zn5b2-dcrqb5', label: 'IDN Times: Mengapa Banyak Gen Z Punya 2-3 Pekerjaan' },
    ],
  },
  {
    title: 'Emotional Exhaustion: Bukan Sekadar Capek, Kamu Kosong',
    slug: 'emotional-exhaustion-bukan-sekadar-capek-kamu-kosong',
    excerpt: 'Bangun pagi, tidur cukup, tapi tetap kosong. Bukan lelah biasa, ini emotional exhaustion. Gen Z paling rentan mengalaminya.',
    body: readFileSync('/tmp/tam-article-18-body.md', 'utf8').trim(),
    categoryId: CATEGORY_MINDSET,
    subcategorySlug: SUB_MINDSET_REALITA,
    povTag: 'refleksi',
    ogHeadline: 'Bangun pagi tapi tetap kosong? Bukan sekadar capek',
    seoMetaTitle: 'Emotional Exhaustion: Bukan Sekadar Capek, Kamu Kosong | TAM',
    seoMetaDescription: 'Bangun pagi, tidur cukup, tapi tetap kosong. Bukan lelah biasa, ini emotional exhaustion. Gen Z paling rentan mengalaminya.',
    seoKeywords: ['emotional exhaustion gen z', 'kelelahan emosional', 'burnout gen z', 'kesehatan mental gen z', 'capek tanpa alasan'],
    publishedAt: '2026-07-22T05:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://warungterkini.id/bukan-sekadar-capek-fenomena-emotional-exhaustion-pada-gen-z-kian-meningkat-di-era-digital/', label: 'Warung Terkini: Emotional Exhaustion pada Gen Z' },
      { type: 'link', url: 'https://lestari.kompas.com/read/2026/05/29/134455586/survei-deloitte-kesehatan-mental-jadi-prioritas-utama-pekerja-muda', label: 'Kompas.com: Survei Deloitte Kesehatan Mental Pekerja Muda' },
      { type: 'link', url: 'https://www.cnnindonesia.com/gaya-hidup/20260718122358-255-1382147/studi-ungkap-fandom-musik-bantu-gen-z-jaga-kesehatan-mental', label: 'CNN Indonesia: Studi Ungkap Fandom Musik Bantu Gen Z' },
      { type: 'link', url: 'https://warungterkini.id/gen-z-mulai-meninggalkan-hustle-culture-work-life-balance-jadi-prioritas-baru-demi-kesehatan-mental/', label: 'Warung Terkini: Gen Z Meninggalkan Hustle Culture' },
    ],
  },
  {
    title: 'Generasi Stroberi: Label untuk Sistem yang Gagal',
    slug: 'generasi-stroberi-label-untuk-sistem-yang-gagal',
    excerpt: 'Gen Z disebut stroberi: lunak, mudah hancur. Tapi label ini mengabaikan bahwa masalahnya bukan kelemahan individu, melainkan sistem yang gagal.',
    body: readFileSync('/tmp/tam-article-19-body.md', 'utf8').trim(),
    categoryId: CATEGORY_KEHIDUPAN,
    subcategorySlug: SUB_KEHIDUPAN_SOSIAL,
    povTag: 'kontra-narasi',
    ogHeadline: 'Gen Z stroberi? Bukan buahnya, tanahnya yang rusak',
    seoMetaTitle: 'Generasi Stroberi: Label untuk Sistem yang Gagal | TAM',
    seoMetaDescription: 'Gen Z disebut stroberi: lunak, mudah hancur. Tapi label ini mengabaikan bahwa masalahnya bukan kelemahan individu, melainkan sistem yang gagal.',
    seoKeywords: ['generasi stroberi', 'gen z kesehatan mental', 'stigma gen z', 'sistem yang gagal', 'gen z Indonesia'],
    publishedAt: '2026-07-22T10:00:00.000Z',
    sourceReferences: [
      { type: 'link', url: 'https://bengkelnarasi.com/2026/06/26/gen-z-dari-depresi-menuju-resistensi/', label: 'Bengkel Narasi: Gen Z Dari Depresi Menuju Resistensi' },
      { type: 'link', url: 'https://www.kompasiana.com/dearmarafikasimanjuntak/6a51ec54c925c40c264dc5e2/generasi-z-dan-tantangan-menjaga-kesehatan-mental', label: 'Kompasiana: Generasi Z dan Tantangan Kesehatan Mental' },
      { type: 'link', url: 'https://www.cermat.co.id/gen-z-dari-depresi-menuju-resistensi/', label: 'Cermat.co.id: Gen Z Dari Depresi Menuju Resistensi' },
      { type: 'link', url: 'https://www.idnresearchinstitute.com/society/indonesia-millennial-and-gen-z-report-2027-resmi-diluncurkan-00-vnqjp-tjdsq0', label: 'IDN Research: Indonesia Millennial & Gen Z Report 2027' },
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
