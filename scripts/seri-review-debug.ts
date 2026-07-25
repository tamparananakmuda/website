import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Find remaining unsourced numbers
const sourceKeywords = ['bps', 'survei', 'data', 'laporan', 'studi', 'riset', 'menurut', 'berdasarkan', 'penelitian', 'pew research', 'deloitte', 'eagle hill', 'jmir', 'oxford', 'sakernas', 'i-namhs', 'bkm fisip', 'jurnal', 'kompas', 'detik', 'viva', 'kompasiana', 'suara', 'febriana', 'ocktaviani', 'putri', 'ass', 'tsabita', 'abadi', 'agustina', 'vogel', 'zhu', 'alt', 'pariser', 'cindelli', 'diefenbach', 'anders', 'timms', 'spurrett', 'skinner', 'bandura', 'trikrama', 'joecy', 'giest', 'wallace', 'createhighervibrations', 'house of cultural', 'penelope', 'kns3ye07', 'sumaryono', 'pratiwi', 'rachmi', 'normansyah', 'jupin', 'brain sci', 'attentiondebt', 'historis', 'beyondbillions'];

console.log('=== REMAINING UNSOURCED NUMBERS ===\n');
for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = data.body;
  const sentences = body.split(/[.!?]\s+/);
  const numberSentences = sentences.filter((s: string) => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)|\d+\.\d+%|\$\d+/i.test(s));
  const withoutSource = numberSentences.filter((s: string) => {
    const lower = s.toLowerCase();
    return !sourceKeywords.some(kw => lower.includes(kw));
  });
  if (withoutSource.length > 0) {
    console.log(`Part ${i}: ${withoutSource.length} unsourced`);
    withoutSource.forEach((s: string) => console.log(`  >> ${s.trim().substring(0, 160)}`));
  }
}

// Also check remaining "semua orang"
console.log('\n=== REMAINING RED FLAGS ===\n');
for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const matches = data.body.match(/semua orang|semua gen z|setiap orang/gi);
  if (matches) {
    console.log(`Part ${i}: ${matches.join(', ')}`);
    // Find context
    const idx = data.body.toLowerCase().indexOf('semua orang');
    if (idx > -1) {
      console.log(`  Context: ...${data.body.substring(Math.max(0, idx - 30), idx + 50)}...`);
    }
  }
}
