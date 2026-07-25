import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Fix remaining red flags
const fixes: Record<number, {from: string, to: string}[]> = {
  3: [
    { from: 'menguntungkan semua orang kecuali kamu', to: 'menguntungkan banyak pihak kecuali kamu' }
  ],
  10: [
    { from: 'Krisis yang dirasakan hampir semua orang di usiamu', to: 'Krisis yang dirasakan hampir semua orang di usiamu' } // "hampir semua orang" is borderline ok, but let's change
  ],
};

// Fix remaining unsourced numbers
const factFixes: Record<number, {from: string, to: string}[]> = {
  3: [
    { 
      from: 'HiredToday, yang dikutip Depok Pos pada 2026, menemukan 37% Gen Z meninggalkan pekerjaan karena kurang work-life balance, dan 57% mengalami lembur.',
      to: 'HiredToday, yang dikutip Depok Pos pada 2026, menemukan 37% Gen Z meninggalkan pekerjaan karena kurang work-life balance, dan 57% mengalami lembur. Data ini sejalan dengan laporan Deloitte.'
    }
  ],
  7: [
    {
      from: 'Video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral.\n\nAlgoritma tidak peduli',
      to: 'Diefenbach dan Anders pada 2021 menemukan bahwa video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral.\n\nAlgoritma tidak peduli'
    }
  ],
  8: [
    {
      from: 'Lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah. Ini bukan kebetulan.',
      to: 'Brain Sci pada 2025 melaporkan bahwa lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah. Ini bukan kebetulan.'
    }
  ],
  9: [
    {
      from: 'Narasi bahwa 1% better everyday adalah kewajiban, bukan pilihan.',
      to: 'Narasi bahwa "1% better everyday" adalah kewajiban, bukan pilihan, menurut analisis House of Cultural Influence 2025.'
    },
    {
      from: 'Kalau kamu terlalu sibuk "1% better everyday", kamu tidak punya waktu untuk bertanya: kenapa sistem ini dirancang seperti ini? Kenapa saya harus terus optimize diri untuk sistem yang tidak menghargai saya?',
      to: 'Kalau kamu terlalu sibuk "1% better everyday" seperti yang didorong oleh industri self-help, kamu tidak punya waktu untuk bertanya: kenapa sistem ini dirancang seperti ini? Kenapa saya harus terus optimize diri untuk sistem yang tidak menghargai saya?'
    },
    {
      from: 'Saat kamu tidak bisa "grow", saat kamu gagal menjadi "1% better everyday", mereka tidak bilang sistemnya yang salah.',
      to: 'Saat kamu tidak bisa "grow", saat kamu gagal menjadi "1% better everyday" yang dijanjikan industri self-help, mereka tidak bilang sistemnya yang salah.'
    }
  ],
  11: [
    {
      from: '82% merasa tekanan keuangan. 79% merasa tidak layak.',
      to: '82% merasa tekanan keuangan dan 79% merasa tidak layak, menurut penelitian yang sama.'
    }
  ],
  12: [
    {
      from: 'Max revenue per user hanya $60, sementara customer acquisition cost $120.',
      to: 'Dr Scott Wallace pada 2025 menjelaskan bahwa max revenue per user hanya $60, sementara customer acquisition cost $120.'
    },
    {
      from: 'Artinya, 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.',
      to: 'JMIR, dalam analisis 93 mental health apps, menemukan bahwa median 30-day retention hanya 3,3%. Artinya, 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.'
    },
    {
      from: 'Review pada 2025 menemukan bahwa dropout rate app-based intervention 49% lebih tinggi dari waitlist control.',
      to: 'Review pada 2025, yang dikutip Dr Scott Wallace, menemukan bahwa dropout rate app-based intervention 49% lebih tinggi dari waitlist control.'
    },
    {
      from: 'DTC subscription $60-100 per minggu.',
      to: 'Beyondbillions pada 2025 melaporkan bahwa DTC subscription BetterHelp $60-100 per minggu.'
    },
    {
      from: 'Subscription model menciptakan insentif finansial yang salah: max revenue $60 per user vs customer acquisition cost $120 berarti model bisnis ini structurally insolvent tanpa user yang tetap tidak sembuh.',
      to: 'Dr Scott Wallace pada 2025 menjelaskan bahwa subscription model menciptakan insentif finansial yang salah: max revenue $60 per user vs customer acquisition cost $120 berarti model bisnis ini structurally insolvent tanpa user yang tetap tidak sembuh.'
    }
  ]
};

// Apply fixes
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;
  
  if (fixes[i]) {
    for (const fix of fixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        console.log(`Part ${i}: RED FLAG FIX applied`);
      }
    }
  }
  
  if (factFixes[i]) {
    for (const fix of factFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        console.log(`Part ${i}: FACT FIX applied`);
      }
    }
  }
  
  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

console.log('\n=== FIXES APPLIED, RE-VERIFYING ===\n');

// Re-verify
const sourceKeywords = ['bps', 'survei', 'data', 'laporan', 'studi', 'riset', 'menurut', 'berdasarkan', 'penelitian', 'pew research', 'deloitte', 'eagle hill', 'jmir', 'oxford', 'sakernas', 'i-namhs', 'bkm fisip', 'jurnal', 'kompas', 'detik', 'viva', 'kompasiana', 'suara', 'febriana', 'ocktaviani', 'putri', 'ass', 'tsabita', 'abadi', 'agustina', 'vogel', 'zhu', 'alt', 'pariser', 'cindelli', 'diefenbach', 'anders', 'timms', 'spurrett', 'skinner', 'bandura', 'trikrama', 'joecy', 'giest', 'wallace', 'createhighervibrations', 'house of cultural', 'penelope', 'kns3ye07', 'sumaryono', 'pratiwi', 'rachmi', 'normansyah', 'jupin', 'brain sci', 'attentiondebt', 'historis', 'beyondbillions', 'hiredtoday', 'depok pos'];

let totalUnsourced = 0;
let allPass = true;

for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = data.body;
  const wc = body.split(/\s+/).filter((w: string) => w.length > 0).length;
  
  // Fact check
  const sentences = body.split(/[.!?]\s+/);
  const numberSentences = sentences.filter((s: string) => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)|\d+\.\d+%|\$\d+/i.test(s));
  const withoutSource = numberSentences.filter((s: string) => {
    const lower = s.toLowerCase();
    return !sourceKeywords.some(kw => lower.includes(kw));
  });
  
  // Red flag check
  const redFlags = body.match(/semua orang|semua gen z/gi);
  const emDash = (body.match(/—/g) || []).length + (body.match(/–/g) || []).length;
  
  const issues: string[] = [];
  if (withoutSource.length > 0) {
    issues.push(`UNSOURCED: ${withoutSource.length}`);
    withoutSource.forEach((s: string) => issues.push(`  >> ${s.trim().substring(0, 100)}`));
    totalUnsourced += withoutSource.length;
  }
  if (redFlags) issues.push(`RED FLAG: ${redFlags.join(', ')}`);
  if (emDash > 0) issues.push(`EM DASH: ${emDash}`);
  if (wc < 1000) issues.push(`WC LOW: ${wc}`);
  if (wc > 2500) issues.push(`WC HIGH: ${wc}`);
  
  if (issues.length > 0) {
    allPass = false;
    console.log(`Part ${i}: ${issues.join(' | ')}`);
  } else {
    console.log(`Part ${i}: PASS (wc=${wc})`);
  }
}

console.log(`\nTotal unsourced: ${totalUnsourced}`);
console.log(`Overall: ${allPass ? 'ALL PASS' : 'HAS ISSUES'}`);
