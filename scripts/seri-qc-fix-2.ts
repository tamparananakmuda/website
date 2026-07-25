import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

const fixes: Record<number, {from: string, to: string}[]> = {
  1: [
    { from: 'tidak berpengaruh signifikan terhadap kecenderungan', to: 'tidak berpengaruh banyak terhadap kecenderungan' },
    { from: 'kamu mulai memperhatikan setiap kali', to: 'kamu mulai perhatikan setiap kali' },
  ],
  3: [
    { from: 'Perbedaan ini crucial, karena sistem', to: 'Perbedaan ini penting, karena sistem' },
    { from: '## Akar Rasa Bersalah', to: '## Origin dari Conditioning Ini' },
  ],
  4: [
    { from: '## Tidak Ada mekanisme Pengisian Ulang', to: '## Defisit Pengisian Emosional' },
  ],
  5: [
    { from: '## Mesin Slot di Genggamanmu', to: '## Lever Digital di Sakumu' },
    { from: 'tidak hanya kecanduan, tapi juga merasa tidak cukup', to: 'kecanduan sekaligus merasa tidak cukup' },
    { from: 'Mungkin next one, mungkin next one, mungkin next one. Ini bukan kelemahan kamu, ini desain.',
      to: 'Mungkin next one, mungkin next one, mungkin next one. Ini bukan kelemahan kamu melainkan desain sistem.' },
  ],
  6: [
    { from: '## Algoritma Highlight Reel', to: '## Algoritma Sisi Terbaik' },
    { from: '## Penerima Manfaat dari Rasa Tidak Cukup', to: '## Ekonomi yang Diciptakan dari Rasa Kurang' },
    // Rule of three: "stres, kecemasan, dan gangguan" appears 3 times - change one instance
    { from: 'menemukan bahwa FOMO berkorelasi dengan stres, kecemasan, dan gangguan tidur', to: 'menemukan bahwa FOMO berkorelasi dengan stres serta kecemasan dan gangguan tidur' },
  ],
  7: [
    { from: 'tidak hanya dikonsumsi, tapi juga diproduksi', to: 'dikonsmsi sekaligus diproduksi' },
    // Rule of three: "stres, FOMO, dan kesepian" appears 2x, "visual, naratif, dan musikal" 1x - change one
    { from: 'menghasilkan kecemasan, stres, FOMO, dan kesepian', to: 'menghasilkan kecemasan, stres, serta FOMO dan kesepian' },
    // Staccato: "Sekarang bandingkan dengan video tentang | Angkanya tidak seimbang | Dan itu bukan kebetulan"
    { from: 'Sekarang bandingkan dengan video tentang kesembuhan, dan angkanya tidak seimbang. Dan itu bukan kebetulan, tapi desain.',
      to: 'Sekarang bandingkan dengan video tentang kesembuhan, dan angkanya tidak seimbang, dan itu bukan kebetulan, tapi desain.' },
    // Staccato: "Bukan penyembuhan, bukan kesadaran, tapi validasi sosial." - already merged but still 3 short
    { from: 'Bukan penyembuhan, bukan kesadaran, tapi validasi sosial.',
      to: 'Yang dicari bukan penyembuhan atau kesadaran, tapi validasi sosial.' },
  ],
  8: [
    { from: '## Neuroplastisitas sebagai Respons', to: '## Mekanisme Adaptasi Otak' },
    { from: 'tidak hanya butuh uangmu, tapi juga butuh kamu merasa tidak cukup', to: 'butuh uangmu sekaligus butuh kamu merasa tidak cukup' },
  ],
  9: [
    { from: '## Peliintiran Growth Mindset', to: '## Eksploitasi Konsep Growth Mindset' },
    { from: '## Loop Konsumsi Tanpa Akhir', to: '## Siklus Konsumsi yang Berulang' },
  ],
  10: [
    { from: '## Krisis Sistemik yang Terkaburkan', to: '## Kabut di Atas Krisis Struktural' },
    { from: 'tidak hanya menyalahkan individu, tapi juga mengalihkan', to: 'menyalahkan individu sekaligus mengalihkan' },
    { from: 'tidak hanya disalahkan, tapi juga dihilangkan', to: 'disalahkan sekaligus dihilangkan' },
  ],
  11: [
    { from: '## Standar Tidak Realistis untuk Ekonomi Saat Ini', to: '## Ekonomi yang Berubah, Standar yang Tidak' },
    { from: '## Standar yang Tidak Mungkin', to: '## Target yang Tidak Tercapai' },
  ],
  12: [
    { from: '## Satu Mesin yang Sama', to: '## Rekontekstualisasi' },
    // Staccato: "Ingat [Part 9]... | Growth mindset menyalahkanmu | Industri self-improvement butuh kamu merasa inadequate"
    { from: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu, industri self-improvement butuh kamu merasa inadequate, kamu beli kursus tapi tidak berubah.',
      to: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu dan industri self-improvement butuh kamu merasa inadequate, sehingga kamu beli kursus tapi tidak berubah.' },
  ],
};

for (let i = 1; i <= 12; i++) {
  if (!fixes[i]) continue;
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;
  
  for (const fix of fixes[i]) {
    if (data.body.includes(fix.from)) {
      data.body = data.body.replace(fix.from, fix.to);
      changed = true;
      console.log(`Part ${i}: fix applied`);
    } else {
      console.log(`Part ${i}: SKIP (not found): ${fix.from.substring(0, 50)}`);
    }
  }
  
  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

console.log('\n=== FIXES APPLIED ===');
