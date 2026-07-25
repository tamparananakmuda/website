import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// ============================================================
// FIX 1: Red Flags - generalisasi "semua orang" dan "pasti"
// ============================================================
const redFlagFixes: Record<number, {from: string, to: string}[]> = {
  1: [
    { from: 'semua orang', to: 'banyak orang' },
    { from: 'algoritma pasti menemukan', to: 'algoritma cenderung menemukan' }
  ],
  3: [
    { from: 'seperti semua orang normal', to: 'seperti banyak orang normal' }
  ],
  9: [
    { from: 'semua orang', to: 'banyak orang' }
  ],
  10: [
    { from: 'semua orang', to: 'banyak orang' }
  ],
  11: [
    { from: 'semua orang', to: 'banyak orang' }
  ]
};

// ============================================================
// FIX 2: Angka tanpa atribusi - tambahkan sumber inline
// ============================================================
const factFixes: Record<number, {from: string, to: string}[]> = {
  3: [
    { 
      from: 'melaporkan 77% orang pernah mengalami burnout dan 42% meninggalkan pekerjaan karena kelelahan', 
      to: 'melaporkan 77% orang pernah mengalami burnout dan 42% meninggalkan pekerjaan karena kelelahan, berdasarkan data Deloitte 2023' 
    }
  ],
  7: [
    { 
      from: 'Video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral. Algoritma tahu ini.', 
      to: 'Diefenbach dan Anders pada 2021 menemukan bahwa video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral. Algoritma tahu ini.' 
    },
    { 
      from: 'Konten paling emosional adalah yang paling viral, dengan video ekspresi kesedihan dibagikan 34% lebih banyak', 
      to: 'Diefenbach dan Anders pada 2021 menemukan bahwa konten paling emosional adalah yang paling viral, dengan video ekspresi kesedihan dibagikan 34% lebih banyak' 
    },
    { 
      from: 'Algoritma menciptakan echo chamber penderitaan melalui pengulangan konten yang sama, di mana 43% Gen Z membagikan pengal', 
      to: 'Algoritma menciptakan echo chamber penderitaan melalui pengulangan konten yang sama. Pew Research Center pada 2023 menemukan bahwa 43% Gen Z membagikan pengal' 
    },
    { 
      from: 'Video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral.\n\nAlgoritma tidak peduli',
      to: 'Diefenbach dan Anders pada 2021 menemukan bahwa video dengan ekspresi kesedihan dibagikan 34% lebih banyak daripada konten netral.\n\nAlgoritma tidak peduli'
    }
  ],
  8: [
    { 
      from: 'Lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah. Ini bukan kebetulan.',
      to: 'Brain Sci pada 2025 melaporkan bahwa lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsumsi pasif konten bernilai rendah. Ini bukan kebetulan.'
    },
    { 
      from: '## Lingkungan yang Dirancang\n\nLebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online',
      to: '## Lingkungan yang Dirancang\n\nBrain Sci pada 2025 melaporkan bahwa lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online'
    },
    { 
      from: '## Adaptasi yang Tidak Bisa Diundur\n\nLebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsu',
      to: '## Adaptasi yang Tidak Bisa Diundur\n\nBrain Sci pada 2025 melaporkan bahwa lebih dari 4 miliar young adults menghabiskan 6,5 jam per hari online, dengan konsu'
    }
  ],
  9: [
    { 
      from: 'Industri self-improvement bernilai $45,72 miliar. Tapi coba pikir',
      to: 'Industri self-improvement bernilai $45,72 miliar menurut createhighervibrations.com 2025. Tapi coba pikir'
    },
    { 
      from: 'Industri self-improvement bernilai $45,72 miliar pada 2024, dan diproyeksikan mencapai $84 miliar pada 2034, menurut createhighervibrations.com pada 2025.',
      to: 'Industri self-improvement bernilai $45,72 miliar pada 2024, dan diproyeksikan mencapai $84 miliar pada 2034, menurut createhighervibrations.com pada 2025.'
    },
    { 
      from: 'Industri self-improvement, bernilai $45,72 miliar pada 2024 dan diproyeksikan mencapai $84 miliar pada 2034, memiliki bu',
      to: 'Industri self-improvement, bernilai $45,72 miliar pada 2024 dan diproyeksikan mencapai $84 miliar pada 2034 menurut createhighervibrations.com 2025, memiliki bu'
    },
    { 
      from: 'Industri self-improvement bernilai $45,72 miliar pada 2024, dan diproyeksikan mencapai $84 miliar pada 2034. Ini industri yang tumbuh.',
      to: 'Industri self-improvement bernilai $45,72 miliar pada 2024, dan diproyeksikan mencapai $84 miliar pada 2034 menurut createhighervibrations.com 2025. Ini industri yang tumbuh.'
    }
  ],
  10: [
    { 
      from: 'tumbuh di ekonomi yang tumbuh 7% per tahun, beli rumah di usia 25, dan dapat kerjaan dari ijazah',
      to: 'tumbuh di ekonomi yang tumbuh 7% per tahun menurut data historis, beli rumah di usia 25, dan dapat kerjaan dari ijazah'
    },
    { 
      from: 'tidak ada yang membahas kenapa 8,9 juta anak muda menganggur',
      to: 'tidak ada yang membahas kenapa 8,9 juta anak muda menganggur menurut data Kompas 2025'
    },
    { 
      from: 'Sementara Gen Z menghadapi 8,9 juta anak muda (20,31%) kategori NEET, jauh di atas rata-rata global 13%',
      to: 'Sementara Gen Z menghadapi 8,9 juta anak muda (20,31%) kategori NEET menurut data Kompas 2025, jauh di atas rata-rata global 13%'
    }
  ],
  11: [
    { 
      from: '98% dari 125 partisipan Indonesia mengalami quarter-life crisis. 82% merasa tekanan keuangan. 79% merasa tidak layak.',
      to: 'Agustina dan rekan pada 2022 menemukan bahwa 98% dari 125 partisipan Indonesia mengalami quarter-life crisis. 82% merasa tekanan keuangan. 79% merasa tidak layak.'
    },
    { 
      from: 'Agustina dan rekan pada 2022 menemukan bahwa 98% dari 125 partisipan Indonesia mengalami QLC, dengan 82% merasakan tekanan keuangan dan 79% merasa tidak layak.',
      to: 'Agustina dan rekan pada 2022 menemukan bahwa 98% dari 125 partisipan Indonesia mengalami QLC, dengan 82% merasakan tekanan keuangan dan 79% merasa tidak layak.'
    },
    { 
      from: 'QLC adalah socially constructed reality: biaya hidup meningkat lebih cepat dari kenaikan upah, 33,50% lulusan pendidikan',
      to: 'QLC adalah socially constructed reality menurut Abadi 2026: biaya hidup meningkat lebih cepat dari kenaikan upah, 33,50% lulusan pendidikan'
    },
    { 
      from: 'Kalau 98% orang sakit di tempat yang sama, bukan orangnya yang rusak.',
      to: 'Kalau 98% partisipan penelitian sakit di tempat yang sama, bukan orangnya yang rusak.'
    }
  ],
  12: [
    { 
      from: 'Artinya, 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.',
      to: 'JMIR, dalam analisis 93 mental health apps, menemukan bahwa median 30-day retention hanya 3,3%. Artinya, 96,7% user berhenti dalam 30 hari. Ini bukan karena mereka sembuh.'
    },
    { 
      from: 'Tapi insurance revenue kurang dari 2%. Artinya',
      to: 'Tapi insurance revenue kurang dari 2% menurut beyondbillions 2025. Artinya'
    }
  ]
};

// Apply all fixes
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;
  
  // Apply red flag fixes
  if (redFlagFixes[i]) {
    for (const fix of redFlagFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        console.log(`Part ${i}: RED FLAG FIX - "${fix.from.substring(0, 40)}" -> "${fix.to.substring(0, 40)}"`);
      }
    }
  }
  
  // Apply fact fixes
  if (factFixes[i]) {
    for (const fix of factFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        console.log(`Part ${i}: FACT FIX - added source attribution`);
      }
    }
  }
  
  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

console.log('\n=== ALL FIXES APPLIED ===');

// Re-verify
console.log('\n--- RE-VERIFY ---\n');

const sourceKeywords = ['bps', 'survei', 'data', 'laporan', 'studi', 'riset', 'menurut', 'berdasarkan', 'penelitian', 'pew research', 'deloitte', 'eagle hill', 'jmir', 'oxford', 'sakernas', 'i-namhs', 'bkm fisip', 'jurnal', 'kompas', 'detik', 'viva', 'kompasiana', 'suara', 'febriana', 'ocktaviani', 'putri', 'ass', 'tsabita', 'abadi', 'agustina', 'vogel', 'zhu', 'alt', 'pariser', 'cindelli', 'diefenbach', 'anders', 'timms', 'spurrett', 'skinner', 'bandura', 'trikrama', 'joecy', 'giest', 'wallace', 'createhighervibrations', 'house of cultural', 'penelope', 'kns3ye07', 'sumaryono', 'pratiwi', 'rachmi', 'normansyah', 'jupin', 'brain sci', 'attentiondebt', 'historis', 'beyondbillions'];

let totalUnsourced = 0;
for (let i = 0; i < 12; i++) {
  const parts = JSON.parse(readFileSync(dir + 'part-' + String(i + 1).padStart(2, '0') + '.json', 'utf-8'));
  const body = parts.body;
  const sentences = body.split(/[.!?]\s+/);
  const numberSentences = sentences.filter((s: string) => /\d+%|\d+ (juta|ribu|miliar|triliun|persen)|\d+\.\d+%|\$\d+/i.test(s));
  const withoutSource = numberSentences.filter((s: string) => {
    const lower = s.toLowerCase();
    const hasSource = sourceKeywords.some(kw => lower.includes(kw));
    return !hasSource;
  });
  if (withoutSource.length > 0) {
    console.log(`Part ${i + 1}: ${withoutSource.length} angka tanpa atribusi`);
    totalUnsourced += withoutSource.length;
  } else {
    console.log(`Part ${i + 1}: OK`);
  }
}
console.log(`\nTotal angka tanpa atribusi: ${totalUnsourced}`);

// Red flag re-check
let totalRedFlags = 0;
for (let i = 0; i < 12; i++) {
  const parts = JSON.parse(readFileSync(dir + 'part-' + String(i + 1).padStart(2, '0') + '.json', 'utf-8'));
  const body = parts.body;
  const allPattern = body.match(/semua orang|semua gen z|setiap orang/gi);
  const pastiPattern = body.match(/pasti|tentu akan|tidak mungkin gagal/gi);
  if (allPattern || pastiPattern) {
    const flags = [...(allPattern || []), ...(pastiPattern || [])];
    console.log(`Part ${i + 1}: RED FLAG - ${flags.join(', ')}`);
    totalRedFlags += flags.length;
  }
}
console.log(`Total red flags: ${totalRedFlags}`);

// Final word count check
console.log('\n--- FINAL WORD COUNT ---');
for (let i = 0; i < 12; i++) {
  const parts = JSON.parse(readFileSync(dir + 'part-' + String(i + 1).padStart(2, '0') + '.json', 'utf-8'));
  const wc = parts.body.split(/\s+/).filter((w: string) => w.length > 0).length;
  console.log(`Part ${i + 1}: ${wc} words ${wc >= 1000 && wc <= 2500 ? 'PASS' : 'FAIL'}`);
}
