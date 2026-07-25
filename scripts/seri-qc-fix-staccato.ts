import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

const staccatoFixes: Record<number, {from: string, to: string}[]> = {
  1: [
    { from: 'Sulit fokus? ADHD. Suka sendirian? Introvert yang ternyata autism spectrum. Mudah emosi? Trauma. Tidak suka kerjaan rutin? Dopamine deficiency.',
      to: 'Sulit fokus, itu ADHD. Suka sendirian, itu introvert yang ternyata autism spectrum. Mudah emosi, itu trauma. Tidak suka kerjaan rutin, itu dopamine deficiency.' },
  ],
  2: [
    { from: 'Ada kamera? Ada story? Ada check-in location?',
      to: 'Ada kamera, ada story, ada check-in location?' },
    { from: 'Tapi kamu? Kamu tetap tidak sembuh.\n\nDan ini bukan kebetulan.',
      to: 'Tapi kamu tetap tidak sembuh, dan ini bukan kebetulan.' },
    { from: 'Dan produk habis, prosus tidak.\n\nIndustri self-care tidak menjual kesembuhan. Mereka menjual perasaan sedang menyembuhkan diri.',
      to: 'Dan produk habis, proses tidak. Industri self-care tidak menjual kesembuhan, mereka menjual perasaan sedang menyembuhkan diri.' },
  ],
  3: [
    { from: 'Data ini sejalan dengan laporan Deloitte. Ini bukan minoritas. Ini mayoritas.',
      to: 'Data ini sejalan dengan laporan Deloitte, dan ini bukan minoritas, ini mayoritas.' },
    { from: 'Sekolah: nilai sama dengan worth. Kerja: output sama dengan worth. Media sosial: engagement sama dengan worth.',
      to: 'Sekolah mengajarkan nilai sama dengan worth, kerja mengajarkan output sama dengan worth, media sosial mengajarkan engagement sama dengan worth.' },
    { from: 'Capek bisa diistirahatkan. Kosong tidak bisa. Tapi itu cerita untuk part berikutnya.',
      to: 'Capek bisa diistirahatkan, tapi kosong tidak bisa. Tapi itu cerita untuk part berikutnya.' },
  ],
  4: [
    { from: 'Kosong adalah kehilangan kapasitas untuk merasa. Solusinya tidak jelas. Tidur tidak mengembalikan kapasitas untuk merasa.',
      to: 'Kosong adalah kehilangan kapasitas untuk merasa, dan solusinya tidak jelas. Tidur tidak mengembalikan kapasitas untuk merasa.' },
    { from: 'Bukan capek, tapi kosong. Bangun pagi, tidak ada perasaan. Tidak sedih, tidak senang, tidak marah. Hanya kosong.',
      to: 'Bukan capek tapi kosong. Bangun pagi tidak ada perasaan, tidak sedih, tidak senang, tidak marah, hanya kosong.' },
  ],
  5: [
    { from: 'Mungkin next one. Mungkin next one. Mungkin next one. Ini bukan kelemahan kamu. Ini desain.',
      to: 'Mungkin next one, mungkin next one, mungkin next one. Ini bukan kelemahan kamu, ini desain.' },
  ],
  6: [
    { from: 'Dan algoritma tahu ini. Algoritma makan kesepianmu untuk engagement.',
      to: 'Dan algoritma tahu ini, algoritma makan kesepianmu untuk engagement.' },
  ],
  7: [
    { from: 'Sekarang bandingkan dengan video tentang kesembuhan. Angkanya tidak seimbang. Dan itu bukan kebetulan, tapi desain.',
      to: 'Sekarang bandingkan dengan video tentang kesembuhan, dan angkanya tidak seimbang. Dan itu bukan kebetulan, tapi desain.' },
    { from: 'Bukan penyembuhan. Bukan kesadaran. Validasi sosial.',
      to: 'Bukan penyembuhan, bukan kesadaran, tapi validasi sosial.' },
    { from: 'Itu konsumsi.\n\nAlgoritma tidak peduli. Algoritma butuh engagement. Dan penderitaan adalah engagement tertinggi.',
      to: 'Itu konsumsi. Algoritma tidak peduli, algoritma butuh engagement, dan penderitaan adalah engagement tertinggi.' },
    { from: 'Algoritma tidak peduli dengan perbedaan ini. Algoritma butuh engagement. Dan penderitaan adalah engagement tertinggi.',
      to: 'Algoritma tidak peduli dengan perbedaan ini, algoritma butuh engagement, dan penderitaan adalah engagement tertinggi.' },
    { from: 'Gue merasa lebih berat. Karena gue tidak terhubung dengan orang. Gue mengkonsumsi penderitaan mereka.',
      to: 'Gue merasa lebih berat, karena gue tidak terhubung dengan orang, gue mengkonsumsi penderitaan mereka.' },
  ],
  11: [
    { from: 'Sistemnya yang rusak. Tapi sistem tidak akan mengakui itu. Sistem akan menjual obat.',
      to: 'Sistemnya yang rusak, tapi sistem tidak akan mengakui itu, sistem akan menjual obat.' },
  ],
  12: [
    { from: 'Streaks, notifications, gamification. Tapi tujuannya bukan membuat kamu sembuh. Tujuannya membuat kamu tetap di app.',
      to: 'Streaks, notifications, gamification, tapi tujuannya bukan membuat kamu sembuh, tujuannya membuat kamu tetap di app.' },
    { from: 'Ingat [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis)? TikTok bilang kamu ADHD. Algoritma menciptakan gejala, bukan mengidentifikasi.',
      to: 'Ingat [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis)? TikTok bilang kamu ADHD, algoritma menciptakan gejala, bukan mengidentifikasi.' },
    { from: 'Ingat [Part 2](/artikel/kesehatan-mental-era-digital-part-2-healing-industri)? Kamu beli candle untuk healing. Healing jadi konsumsi yang dikemas sebagai perawatan. Kamu beli produk, tapi tidak sembuh.',
      to: 'Ingat [Part 2](/artikel/kesehatan-mental-era-digital-part-2-healing-industri)? Kamu beli candle untuk healing, healing jadi konsumsi yang dikemas sebagai perawatan, kamu beli produk tapi tidak sembuh.' },
    { from: 'Ingat [Part 5](/artikel/kesehatan-mental-era-digital-part-5-dopamin-loop)? Algoritma membuatmu kecanduan. Media sosial dirancang seperti mesin slot kasino. Kamu tidak bisa berhenti scroll.',
      to: 'Ingat [Part 5](/artikel/kesehatan-mental-era-digital-part-5-dopamin-loop)? Algoritma membuatmu kecanduan, media sosial dirancang seperti mesin slot kasino, kamu tidak bisa berhenti scroll.' },
    { from: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu. Industri self-improvement butuh kamu merasa inadequate. Kamu beli kursus, tapi tidak berubah.',
      to: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu, industri self-improvement butuh kamu merasa inadequate, kamu beli kursus tapi tidak berubah.' },
    { from: 'Semuanya adalah satu sistem yang sama.\n\nIngat [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis)? TikTok bilang kamu ADHD. Algoritma menciptakan gejala, bukan mengidentifikasi. Kamu mulai merasa ada yang salah denganmu.',
      to: 'Semuanya adalah satu sistem yang sama. Ingat [Part 1](/artikel/kesehatan-mental-era-digital-part-1-tiktok-diagnosis)? TikTok bilang kamu ADHD, algoritma menciptakan gejala bukan mengidentifikasi, kamu mulai merasa ada yang salah denganmu.' },
  ],
};

for (let i = 1; i <= 12; i++) {
  if (!staccatoFixes[i]) continue;
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  let changed = false;
  
  for (const fix of staccatoFixes[i]) {
    if (data.body.includes(fix.from)) {
      data.body = data.body.replace(fix.from, fix.to);
      changed = true;
      console.log(`Part ${i}: staccato fix applied`);
    }
  }
  
  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

console.log('\n=== STACCATO FIXES APPLIED ===');
