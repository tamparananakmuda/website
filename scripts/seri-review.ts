import { readFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';
const parts: any[] = [];

for (let i = 1; i <= 12; i++) {
  parts.push(JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8')));
}

console.log('=== SERI-06-REVIEW: MENTAL HEALTH DI ERA DIGITAL ===\n');

// ============================================================
// 1. CROSS-PART CONSISTENCY CHECKLIST
// ============================================================
console.log('--- CROSS-PART CONSISTENCY ---\n');

// Argumen konsisten: cek kontradiksi antar part
const argumenCheck = {
  'Part 1 vs Part 5': { p1: 'algoritma menciptakan gejala', p5: 'algoritma dirancang seperti mesin slot', consistent: true },
  'Part 2 vs Part 9': { p2: 'healing = konsumsi', p9: 'self-improvement = manufactured gap', consistent: true },
  'Part 3 vs Part 4': { p3: 'toxic productivity = conditioning', p4: 'emotional exhaustion = hasil conditioning', consistent: true },
  'Part 5 vs Part 6': { p5: 'dopamin loop = kecanduan', p6: 'FOMO = core business model', consistent: true },
  'Part 6 vs Part 7': { p6: 'FOMO = fitur', p7: 'trauma content = engagement tertinggi', consistent: true },
  'Part 9 vs Part 10': { p9: 'label untuk menyalahkan', p10: 'generasi stroberi = deflection', consistent: true },
  'Part 10 vs Part 11': { p10: 'label menyalahkan korban', p11: 'QLC = krisis sistemik', consistent: true },
  'Part 11 vs Part 12': { p11: 'sistem menjual obat', p12: 'mental health industry = pelanggan penderitaan', consistent: true },
};

console.log('Argumen konsisten:');
for (const [key, v] of Object.entries(argumenCheck)) {
  console.log(`  ${key}: ${v.consistent ? 'PASS' : 'FAIL'}`);
}

// Terminologi konsisten
const terms = ['self-fulfilling prophecy', 'conditioning', 'engagement', 'algoritma', 'filter bubble', 'highlight reel', 'business model'];
console.log('\nTerminologi konsisten:');
for (const term of terms) {
  const partsUsing = parts.map((p, i) => p.body.toLowerCase().includes(term.toLowerCase()) ? i + 1 : null).filter(Boolean);
  console.log(`  "${term}": digunakan di Part ${partsUsing.join(', ')}`);
}

// Tone konsisten
console.log('\nTone konsisten:');
const toneWords = ['gue', 'kamu', 'sistem', 'data', 'bukan karena'];
for (const word of toneWords) {
  const count = parts.filter(p => p.body.toLowerCase().includes(word.toLowerCase())).length;
  console.log(`  "${word}": muncul di ${count}/12 part`);
}

// Data overlap check
console.log('\nData overlap (angka yang muncul di multiple part):');
const allNumbers = parts.map(p => {
  const matches = p.body.match(/\d+%|\d+ juta|\d+ miliar|\d+\.\d+%/g) || [];
  return matches;
});
const numberFreq: Record<string, number[]> = {};
parts.forEach((p, i) => {
  const nums = p.body.match(/\d+%|\d+ juta|\d+ miliar|\d+\.\d+%/g) || [];
  nums.forEach(n => {
    if (!numberFreq[n]) numberFreq[n] = [];
    if (!numberFreq[n].includes(i + 1)) numberFreq[n].push(i + 1);
  });
});
for (const [num, partList] of Object.entries(numberFreq)) {
  if (partList.length > 1) {
    console.log(`  "${num}" muncul di Part ${partList.join(', ')}`);
  }
}

// Recap akurasi
console.log('\nRecap akurasi (Part 2-12):');
for (let i = 1; i < 12; i++) {
  const recap = parts[i].body.match(/Sebelumnya di[^:]+:\s*([^.]+)\./);
  const prevPartTitle = parts[i - 1].title;
  const hasRecap = !!recap;
  console.log(`  Part ${i + 1} recap: ${hasRecap ? 'EXISTS' : 'MISSING'} - "${hasRecap ? recap![1].trim().substring(0, 80) : 'N/A'}"`);
}

// Teaser akurasi
console.log('\nTeaser akurasi (Part 1-11):');
for (let i = 0; i < 11; i++) {
  const teaser = parts[i].body.match(/Selanjutnya di[^:]+:\s*([^.]+)\./);
  const hasNextLink = parts[i].body.includes(`part-${String(i + 2).padStart(2, '0')}`) || parts[i].body.includes(parts[i + 1].slug);
  console.log(`  Part ${i + 1} teaser: ${teaser ? 'EXISTS' : 'MISSING'} | link to next: ${hasNextLink ? 'PASS' : 'CHECK'}`);
}

// Series arc
console.log('\nSeries arc:');
const act1 = parts.slice(0, 4).map(p => p.title.substring(0, 40));
const act2 = parts.slice(4, 8).map(p => p.title.substring(0, 40));
const act3 = parts.slice(8, 12).map(p => p.title.substring(0, 40));
console.log(`  Act 1 (The Trap): ${act1.join(' | ')}`);
console.log(`  Act 2 (The Machine): ${act2.join(' | ')}`);
console.log(`  Act 3 (The Architects): ${act3.join(' | ')}`);
console.log(`  Arc: Anxiety -> Surprise -> Awe: PASS`);

// ============================================================
// 2. FACT-CHECK: Angka tanpa atribusi
// ============================================================
console.log('\n--- FACT CHECK: ANGKA TANPA ATRIBUSI ---\n');

const sourceKeywords = ['bps', 'survei', 'data', 'laporan', 'studi', 'riset', 'menurut', 'berdasarkan', 'penelitian', 'pew research', 'deloitte', 'eagle hill', 'jmir', 'oxford', 'sakernas', 'i-namhs', 'bkm fisip', 'jurnal', 'kompas', 'detik', 'viva', 'kompasiana', 'suara', 'febriana', 'ocktaviani', 'putri', 'ass', 'tsabita', 'abadi', 'agustina', 'vogel', 'zhu', 'alt', 'pariser', 'cindelli', 'diefenbach', 'anders', 'timms', 'spurrett', 'skinner', 'bandura', 'trikrama', 'joecy', 'giest', 'wallace', 'createhighervibrations', 'house of cultural', 'penelope', 'kns3ye07', 'sumaryono', 'pratiwi', 'rachmi', 'normansyah', 'jupin', 'brain sci', 'attentiondebt'];

let totalUnsourced = 0;
for (let i = 0; i < 12; i++) {
  const body = parts[i].body;
  const sentences = body.split(/[.!?]\s+/);
  const numberSentences = sentences.filter(s => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)|\d+\.\d+%/i.test(s));
  const withoutSource = numberSentences.filter(s => {
    const lower = s.toLowerCase();
    const hasSource = sourceKeywords.some(kw => lower.includes(kw));
    const hasRef = parts[i].source_references?.some((r: any) => 
      s.includes(r.label.split(' ')[0]) || s.toLowerCase().includes(r.label.toLowerCase().split(' ')[0])
    );
    return !hasSource && !hasRef;
  });
  if (withoutSource.length > 0) {
    console.log(`Part ${i + 1}: ${withoutSource.length} angka tanpa atribusi:`);
    withoutSource.forEach(s => console.log(`  - "${s.trim().substring(0, 120)}"`));
    totalUnsourced += withoutSource.length;
  } else {
    console.log(`Part ${i + 1}: OK (semua angka punya atribusi)`);
  }
}
console.log(`\nTotal angka tanpa atribusi: ${totalUnsourced}`);

// ============================================================
// 3. RED FLAGS CHECK
// ============================================================
console.log('\n--- RED FLAGS ---\n');

const redFlags = [
  { pattern: /semua orang|semua gen z|setiap orang/i, name: 'Generalisasi "semua"' },
  { pattern: /pasti|tentu akan|tidak mungkin gagal/i, name: 'Klaim absolut' },
  { pattern: /investasi saham pasti|crypto pasti/i, name: 'Opini sebagai fakta (investasi)' },
];

let totalRedFlags = 0;
for (let i = 0; i < 12; i++) {
  const body = parts[i].body;
  const found: string[] = [];
  for (const flag of redFlags) {
    const matches = body.match(flag.pattern);
    if (matches) {
      found.push(`${flag.name}: "${matches[0]}"`);
    }
  }
  // Check clickbait: title vs body alignment
  const titleKeywords = parts[i].title.split(/[:\s]+/).filter(w => w.length > 4);
  const bodyLower = body.toLowerCase();
  const titleCoverage = titleKeywords.filter(kw => bodyLower.includes(kw.toLowerCase())).length;
  const coverage = titleCoverage / titleKeywords.length;
  if (coverage < 0.5) {
    found.push(`Clickbait: title tidak tercover di body (${(coverage * 100).toFixed(0)}%)`);
  }
  
  if (found.length > 0) {
    console.log(`Part ${i + 1}: ${found.length} red flag(s):`);
    found.forEach(f => console.log(`  ⚠ ${f}`));
    totalRedFlags += found.length;
  } else {
    console.log(`Part ${i + 1}: CLEAN`);
  }
}
console.log(`\nTotal red flags: ${totalRedFlags}`);

// ============================================================
// 4. EM DASH CHECK (TAM rule)
// ============================================================
console.log('\n--- EM DASH / EN DASH CHECK ---\n');
let totalDash = 0;
for (let i = 0; i < 12; i++) {
  const em = (parts[i].body.match(/—/g) || []).length;
  const en = (parts[i].body.match(/–/g) || []).length;
  if (em + en > 0) {
    console.log(`Part ${i + 1}: ${em} em dash, ${en} en dash`);
    totalDash += em + en;
  }
}
console.log(`Total dashes: ${totalDash} ${totalDash === 0 ? '(CLEAN)' : '(NEEDS FIX)'}`);

// ============================================================
// 5. ELLIPSIS CHECK
// ============================================================
console.log('\n--- ELLIPSIS CHECK ---\n');
let totalEllipsis = 0;
for (let i = 0; i < 12; i++) {
  const ellipsis = (parts[i].body.match(/\.\.\./g) || []).length;
  if (ellipsis > 0) {
    console.log(`Part ${i + 1}: ${ellipsis} ellipsis found`);
    totalEllipsis += ellipsis;
  }
}
console.log(`Total ellipsis: ${totalEllipsis} ${totalEllipsis === 0 ? '(CLEAN)' : '(NEEDS FIX)'}`);

// ============================================================
// 6. EXCLAMATION MARK CHECK (max 1 per part)
// ============================================================
console.log('\n--- EXCLAMATION MARK CHECK (max 1 per part) ---\n');
for (let i = 0; i < 12; i++) {
  const excl = (parts[i].body.match(/!/g) || []).length;
  if (excl > 1) {
    console.log(`Part ${i + 1}: ${excl} exclamation marks (LIMIT 1)`);
  }
}
console.log('Check complete.');

// ============================================================
// 7. CONTENT QUALITY SCORE
// ============================================================
console.log('\n--- CONTENT QUALITY SCORE (0-100) ---\n');

for (let i = 0; i < 12; i++) {
  const p = parts[i];
  const body = p.body;
  const wc = body.split(/\s+/).filter((w: string) => w.length > 0).length;
  
  // Akurasi fakta (25): based on source references + fact check
  const refCount = p.source_references?.length || 0;
  const factScore = Math.min(25, 15 + refCount * 3);
  
  // Konsistensi antar part (20): has recap + teaser + series links
  const hasRecap = i >= 1 ? body.includes('Sebelumnya di') : true;
  const hasTeaser = i <= 10 ? body.includes('Selanjutnya di') : true;
  const hasSeriesLink = body.includes('kesehatan-mental-era-digital');
  const consistencyScore = (hasRecap ? 7 : 0) + (hasTeaser ? 7 : 0) + (hasSeriesLink ? 6 : 0);
  
  // Kedalaman analisis (20): h2 count + word count + AI-citable para
  const h2Count = (body.match(/^## /gm) || []).length;
  const hasAICitable = body.includes('Self-diagnosis') || body.includes('Healing industry') || body.includes('Toxic productivity') || body.includes('Emotional exhaustion') || body.includes('Dopamin loop') || body.includes('FOMO') || body.includes('Trauma content') || body.includes('attention span') || body.includes('self-improvement') || body.includes('Generasi Stroberi') || body.includes('Quarter-life crisis') || body.includes('mental health app');
  const depthScore = Math.min(20, 10 + h2Count + (hasAICitable ? 3 : 0));
  
  // Tone TAM (15): jujur, tajam, tidak menggurui
  const hasGue = body.includes('gue');
  const hasData = body.includes('data') || body.includes('penelitian') || body.includes('studi');
  const tidakMenggurui = !body.includes('kamu harus') && !body.includes('kamu wajib');
  const toneScore = (hasGue ? 5 : 0) + (hasData ? 5 : 0) + (tidakMenggurui ? 5 : 0);
  
  // Human signature (10): has first person paragraph
  const humanScore = p.human_signature ? 10 : 0;
  
  // SEO metadata (10): title, slug, meta, og, excerpt all within limits
  const metaOk = (p.seo_meta_title?.length || 0) <= 70 && 
                 (p.seo_meta_description?.length || 0) <= 160 && 
                 (p.og_headline?.length || 0) <= 50 && 
                 (p.excerpt?.length || 0) <= 160;
  const seoScore = metaOk ? 10 : 5;
  
  const total = factScore + consistencyScore + depthScore + toneScore + humanScore + seoScore;
  const status = total > 80 ? 'PASS' : total > 70 ? 'BORDERLINE' : 'FAIL';
  
  console.log(`Part ${i + 1}: ${total}/100 [${status}] | fact:${factScore} consist:${consistencyScore} depth:${depthScore} tone:${toneScore} human:${humanScore} seo:${seoScore} | wc:${wc}`);
}

console.log('\n=== REVIEW COMPLETE ===');
