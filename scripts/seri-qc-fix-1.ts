import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// ============================================================
// FIX 1: AI vocab replacements
// ============================================================
const aiVocabFixes: Record<number, {from: string, to: string}[]> = {
  1: [
    { from: 'tidak berpengaruh signifikan', to: 'tidak berpengaruh banyak' },
    { from: 'yang lebih perlu diperhatikan', to: 'yang lebih perlu diketahui' },
  ],
  3: [
    { from: 'Ini bukan filosofi, ini conditioning', to: 'Ini bukan filosofi, ini hasil conditioning' },
    { from: 'Ini perbedaan yang crucial', to: 'Ini perbedaan yang penting' },
    { from: 'highlight reel', to: 'sisi terbaik' },
  ],
  4: [
    { from: 'signifikan', to: 'banyak' },
  ],
  6: [
    { from: 'highlight reel', to: 'sisi terbaik' },
  ],
  7: [
    { from: 'signifikan', to: 'banyak' },
  ],
  11: [
    { from: 'Ini perbedaan yang crucial', to: 'Ini perbedaan yang penting' },
  ],
};

// ============================================================
// FIX 2: Negative parallelisms
// ============================================================
const negParallelFixes: Record<number, {from: string, to: string}[]> = {
  5: [
    { from: 'Bukan produk yang adiktif', to: 'Produk yang adiktif' },
  ],
  7: [
    { from: 'Bukan kesedihan yang dibagi, tapi kesedihan yang diproduksi', to: 'Kesedihan yang diproduksi, bukan kesedihan yang dibagi' },
  ],
  8: [
    { from: 'Bukan otak yang rusak, tapi lingkungan yang dirancang', to: 'Lingkungan yang dirancang, bukan otak yang rusak' },
  ],
  10: [
    { from: 'Bukan kamu yang lemah', to: 'Kamu tidak lemah' },
    { from: 'Bukan Gen Z yang lemah', to: 'Gen Z tidak lemah' },
  ],
};

// ============================================================
// FIX 3: Rule of three (>2 instances)
// ============================================================
const ruleOfThreeFixes: Record<number, {from: string, to: string}[]> = {
  6: [
    { from: 'kewajiban, beban, dan unjuk diri', to: 'kewajiban dan unjuk diri' },
  ],
  7: [
    { from: 'ekspresi kesedihan yang dikonstruksi secara visual, naratif, dan musikal', to: 'ekspresi kesedihan yang dikonstruksi secara visual dan naratif' },
  ],
};

// ============================================================
// FIX 4: Fragmented headers - rename to avoid word overlap with next line
// ============================================================
const headerFixes: Record<number, {from: string, to: string}[]> = {
  2: [
    { from: '## Ketika Healing Menjadi Beban', to: '## Beban Pseudo-Pemulihan' },
    { from: '## Sistem yang Untung dari Healing-mu', to: '## Penerima Manfaat Konsumsi Healing' },
  ],
  3: [
    { from: '## Asal Rasa Bersalah', to: '## Akar Rasa Bersalah' },
    { from: '## Sistem Butuh Kamu Terus Produksi', to: '## Mesin yang Mengkonsumsi Produksimu' },
  ],
  4: [
    { from: '## Sistem Tidak Menawarkan Cara Mengisi Ulang', to: '## Tidak Ada mekanisme Pengisian Ulang' },
    { from: '## Sistem yang Untung dari Kehilanganmu', to: '## Penerima Manfaat dari Kehilanganmu' },
  ],
  5: [
    { from: '## Mesin Slot di Sakumu', to: '## Mesin Slot di Genggamanmu' },
    { from: '## Sistem yang Dirancang, Bukan Kebetulan', to: '## Desain Sengaja, Bukan Kebetulan' },
    { from: '## Desain yang Tidak Accidental', to: '## Rekayasa Perilaku yang Presisi' },
  ],
  6: [
    { from: '## Sistem yang Untung dari Penderitaanmu', to: '## Penerima Manfaat dari Rasa Tidak Cukup' },
  ],
  7: [
    { from: '## Echo Chamber Penderitaan', to: '## Ruang Gema Penderitaan' },
    { from: '## Penderitaan sebagai Mata Uang Sosial', to: '## Komodifikasi Rasa Sakit' },
    { from: '## Pengganti Koneksi Asli', to: '## Simulasi Koneksi Manusia' },
    { from: '## Siklus Konsumsi Penderitaan', to: '## Lingkaran Penderitaan yang Menguntungkan' },
  ],
  8: [
    { from: '## Otak Beradaptasi, Bukan Rusak', to: '## Neuroplastisitas sebagai Respons' },
    { from: '## Lingkungan yang Dirancang', to: '## Ekosistem Fragmentasi Buatan' },
  ],
  9: [
    { from: '## Growth Mindset sebagai Senjata', to: '## Peliintiran Growth Mindset' },
    { from: '## Siklus yang Tidak Pernah Berakhir', to: '## Loop Konsumsi Tanpa Akhir' },
  ],
  10: [
    { from: '## Krisis yang Terdengar seperti Masalah Pribadi', to: '## Krisis Sistemik yang Terkaburkan' },
  ],
  11: [
    { from: '## Sistem yang Sakit, Bukan Kamu', to: '## Standar Tidak Realistis untuk Ekonomi Saat Ini' },
    { from: '## Standar yang Tidak Mungkin', to: '## Target yang Tidak Tercapai' },
  ],
  12: [
    { from: '## Sistem yang Sama', to: '## Satu Mesin yang Sama' },
  ],
};

// ============================================================
// FIX 5: Staccato drama - merge short consecutive sentences
// This is harder to fix programmatically. Let me find and fix specific instances.
// The issue is 3+ consecutive sentences with <=6 words.
// Let me find them and merge.
// ============================================================

// Apply all fixes
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;
  const log: string[] = [];

  // AI vocab
  if (aiVocabFixes[i]) {
    for (const fix of aiVocabFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        log.push('AI vocab');
      }
    }
  }

  // Negative parallelisms
  if (negParallelFixes[i]) {
    for (const fix of negParallelFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        log.push('Neg parallel');
      }
    }
  }

  // Rule of three
  if (ruleOfThreeFixes[i]) {
    for (const fix of ruleOfThreeFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        log.push('Rule of three');
      }
    }
  }

  // Fragmented headers
  if (headerFixes[i]) {
    for (const fix of headerFixes[i]) {
      if (data.body.includes(fix.from)) {
        data.body = data.body.replace(fix.from, fix.to);
        changed = true;
        log.push('Header');
      }
    }
  }

  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
    console.log(`Part ${i}: FIXED [${log.join(', ')}]`);
  }
}

console.log('\n=== NON-STACCATO FIXES APPLIED ===');

// Now check staccato drama specifically
console.log('\n--- STACCATO DRAMA CHECK ---\n');
for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = data.body;
  const sentences = body.split(/[.!?]\s+/);
  let currentRun = 0, maxRun = 0;
  let runStart = -1;
  let problemStart = -1;
  
  for (let j = 0; j < sentences.length; j++) {
    if (sentences[j].split(/\s+/).length <= 6) {
      currentRun++;
      if (currentRun >= 3 && problemStart === -1) problemStart = j - currentRun + 1;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      if (currentRun >= 3) {
        // Found a staccato run
        const runSentences = sentences.slice(j - currentRun, j);
        console.log(`Part ${i}: staccato run (${currentRun} sentences):`);
        runSentences.forEach((s, idx) => console.log(`  [${idx}] ${s.trim().substring(0, 80)}`));
      }
      currentRun = 0;
    }
  }
  if (currentRun >= 3) {
    const runSentences = sentences.slice(sentences.length - currentRun);
    console.log(`Part ${i}: staccato run (${currentRun} sentences) at end:`);
    runSentences.forEach((s, idx) => console.log(`  [${idx}] ${s.trim().substring(0, 80)}`));
  }
}
