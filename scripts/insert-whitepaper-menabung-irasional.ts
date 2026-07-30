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

const CATEGORY_UANG = '62d4cac7-789f-4d35-9cd8-35f25a5bb042';
const SUBCATEGORY_KEUANGAN = '468e4682-46cd-4fa1-84a1-d5f7931735e7';
const AUTHOR_ID = '30268f32-de51-4080-ba1b-20c20fff3c6b';

async function insert() {
  const raw = readFileSync(
    join(process.cwd(), 'content/whitepaper/menabung-irasional-sistem-keuangan-yang-didesain-agar-kamu-rugi.md'),
    'utf8'
  );

  const startIdx = raw.indexOf('<!-- START WHITEPAPER CONTENT -->');
  const endIdx = raw.indexOf('<!-- END WHITEPAPER CONTENT -->');
  const body = raw.substring(startIdx + 35, endIdx).trim();

  const slug = 'menabung-irasional-sistem-keuangan-yang-didesain-agar-kamu-rugi';
  const title = 'Menabung Jadi Irasional: Sistem Keuangan yang Didesain agar Kamu Rugi';
  const excerpt = 'Bunga deposito 2,4%, inflasi 3,08%. 127 tahun berhenti ngopi untuk beli rumah. Bukan Gen Z boros, matematikanya yang tidak masuk akal.';
  const ogHeadline = 'Menabung di deposito bikin kamu rugi setiap tahun';

  const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug));
  if (existing.length > 0) {
    console.log('SKIP (already exists):', slug);
    process.exit(0);
  }

  const wordCount = body.split(/\s+/).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  await db.insert(posts).values({
    title,
    slug,
    excerpt,
    body,
    categoryId: CATEGORY_UANG,
    subcategoryId: SUBCATEGORY_KEUANGAN,
    authorId: AUTHOR_ID,
    status: 'published',
    povTag: 'kontra-narasi',
    humanSignature: true,
    factCheckStatus: 'verified',
    reviewStatus: 'publish',
    sourceReferences: [
      { type: 'link', url: 'https://www.bps.go.id/', label: 'BPS Sakernas: Upah buruh nasional (Aug 2024, 2025, Feb 2026)' },
      { type: 'link', url: 'https://www.bps.go.id/', label: 'BPS IHK: Inflasi tahunan (Des 2025, Jan, Mar, Mei 2026)' },
      { type: 'link', url: 'https://www.bps.go.id/', label: 'BPS IHPP 2024: Indeks harga properti residensial' },
      { type: 'link', url: 'https://www.bi.go.id/', label: 'Bank Indonesia: BI Rate, Survei Konsumen (saving ratio)' },
      { type: 'link', url: 'https://www.ojk.go.id/', label: 'OJK: Statistik paylater (Jan, Mar, Mei 2026), data reksadana' },
      { type: 'link', url: 'https://www.ksei.co.id/', label: 'KSEI: Investor pasar modal (Apr 2026)' },
      { type: 'link', url: 'https://www.lps.go.id/', label: 'LPS: Bunga deposito, pajak bunga deposito' },
      { type: 'link', url: 'https://www.cpf.gov.sg/', label: 'CPF Board Singapura: Kontribusi, return, home ownership' },
      { type: 'link', url: 'https://www.ato.gov.au/', label: 'ATO Australia: Superannuation guarantee 12%' },
      { type: 'link', url: 'https://www.oecd.org/', label: 'OECD: Home ownership international comparison' },
    ],
    readingTime,
    publishedAt: '2027-01-15T00:00:00+07:00',
    seoMetaTitle: 'Menabung Jadi Irasional: Sistem Keuangan yang Didesain agar Kamu Rugi | TAM',
    seoMetaDescription: excerpt,
    ogHeadline,
    seoKeywords: ['menabung irasional', 'bunga deposito', 'inflasi indonesia', 'real return negatif', 'gen z boros', 'sistem keuangan indonesia', 'paylater', 'reksadana', 'forced saving', 'bpjs tk', 'cpf singapura'],
  });

  console.log('INSERTED:', slug);
  console.log('Word count:', wordCount);
  console.log('Reading time:', readingTime);
  process.exit(0);
}

insert().catch((e) => { console.error(e); process.exit(1); });
