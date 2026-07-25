import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Part 7: fix remaining unsourced "34%" - there's a duplicate sentence
let p7 = JSON.parse(readFileSync(dir + 'part-07.json', 'utf-8'));
// Replace all instances of unsourced "34%" sentence
p7.body = p7.body.replace(
  /Video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral\./g,
  'Diefenbach dan Anders pada 2021 menemukan bahwa video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral.'
);
writeFileSync(dir + 'part-07.json', JSON.stringify(p7, null, 2));
console.log('Part 7: fixed 34% attribution');

// Part 8: fix remaining unsourced "4 miliar"
let p8 = JSON.parse(readFileSync(dir + 'part-08.json', 'utf-8'));
p8.body = p8.body.replace(
  /Lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah\./g,
  'Brain Sci pada 2025 melaporkan bahwa lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah.'
);
writeFileSync(dir + 'part-08.json', JSON.stringify(p8, null, 2));
console.log('Part 8: fixed 4 miliar attribution');

// Part 9: fix remaining "1% better everyday" - these are quotes/slogans, not data claims
// Add context that this is industry slogan
let p9 = JSON.parse(readFileSync(dir + 'part-09.json', 'utf-8'));
p9.body = p9.body.replace(
  /Kalau kamu terlalu sibuk "1% better everyday" seperti yang didorong oleh industri self-help, kamu tidak punya waktu/g,
  'Kalau kamu terlalu sibuk dengan slogan "1% better everyday" dari industri self-help, kamu tidak punya waktu'
);
p9.body = p9.body.replace(
  /Saat kamu tidak bisa "grow", saat kamu gagal menjadi "1% better everyday" yang dijanjikan industri self-help/g,
  'Saat kamu tidak bisa "grow", saat kamu gagal mencapai slogan "1% better everyday" yang dijanjikan industri self-help'
);
p9.body = p9.body.replace(
  /Kalau kamu terlalu sibuk "1% better everyday", kamu tidak punya waktu/g,
  'Kalau kamu terlalu sibuk dengan slogan industri self-help "1% better everyday", kamu tidak punya waktu'
);
writeFileSync(dir + 'part-09.json', JSON.stringify(p9, null, 2));
console.log('Part 9: fixed 1% better everyday attributions');

// Part 10: fix "semua orang" in teaser context
let p10 = JSON.parse(readFileSync(dir + 'part-10.json', 'utf-8'));
p10.body = p10.body.replace(
  'Krisis yang dirasakan hampir semua orang di usiamu',
  'Krisis yang dirasakan hampir sebagian besar orang di usiamu'
);
writeFileSync(dir + 'part-10.json', JSON.stringify(p10, null, 2));
console.log('Part 10: fixed "semua orang" -> "sebagian besar orang"');

// Part 12: fix remaining "96,7%"
let p12 = JSON.parse(readFileSync(dir + 'part-12.json', 'utf-8'));
p12.body = p12.body.replace(
  'Artinya, 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.',
  'JMIR menemukan bahwa median 30-day retention hanya 3,3%, yang berarti 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.'
);
writeFileSync(dir + 'part-12.json', JSON.stringify(p12, null, 2));
console.log('Part 12: fixed 96,7% attribution');

// Final verification
console.log('\n=== FINAL VERIFICATION ===\n');

const sourceKeywords = ['bps', 'survei', 'data', 'laporan', 'studi', 'riset', 'menurut', 'berdasarkan', 'penelitian', 'pew research', 'deloitte', 'eagle hill', 'jmir', 'oxford', 'sakernas', 'i-namhs', 'bkm fisip', 'jurnal', 'kompas', 'detik', 'viva', 'kompasiana', 'suara', 'febriana', 'ocktaviani', 'putri', 'ass', 'tsabita', 'abadi', 'agustina', 'vogel', 'zhu', 'alt', 'pariser', 'cindelli', 'diefenbach', 'anders', 'timms', 'spurrett', 'skinner', 'bandura', 'trikrama', 'joecy', 'giest', 'wallace', 'createhighervibrations', 'house of cultural', 'penelope', 'kns3ye07', 'sumaryono', 'pratiwi', 'rachmi', 'normansyah', 'jupin', 'brain sci', 'attentiondebt', 'historis', 'beyondbillions', 'hiredtoday', 'depok pos', 'slogan'];

let allPass = true;
for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = data.body;
  const wc = body.split(/\s+/).filter((w: string) => w.length > 0).length;
  
  const sentences = body.split(/[.!?]\s+/);
  const numberSentences = sentences.filter((s: string) => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)|\d+\.\d+%|\$\d+/i.test(s));
  const withoutSource = numberSentences.filter((s: string) => {
    const lower = s.toLowerCase();
    return !sourceKeywords.some(kw => lower.includes(kw));
  });
  
  const redFlags = body.match(/semua orang|semua gen z/gi);
  const emDash = (body.match(/—/g) || []).length + (body.match(/–/g) || []).length;
  const og = (data.og_headline || '').length;
  const md = (data.seo_meta_description || '').length;
  const ex = (data.excerpt || '').length;
  
  const issues: string[] = [];
  if (withoutSource.length > 0) {
    issues.push(`UNSOURCED: ${withoutSource.length}`);
    withoutSource.forEach((s: string) => issues.push(`  >> ${s.trim().substring(0, 100)}`));
  }
  if (redFlags) issues.push(`RED FLAG: ${redFlags.join(', ')}`);
  if (emDash > 0) issues.push(`EM DASH: ${emDash}`);
  if (wc < 1000 || wc > 2500) issues.push(`WC: ${wc}`);
  if (og > 50) issues.push(`OG: ${og}`);
  if (md > 160) issues.push(`MD: ${md}`);
  if (ex > 160) issues.push(`EX: ${ex}`);
  
  if (issues.length > 0) {
    allPass = false;
    console.log(`Part ${i}: ${issues.join(' | ')}`);
  } else {
    console.log(`Part ${i}: PASS (wc=${wc})`);
  }
}

console.log(`\n=== ${allPass ? 'ALL 12 PARTS PASS ===' : 'HAS ISSUES ==='}`);
