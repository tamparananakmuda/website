import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

const fixes: Record<number, {from: string, to: string}[]> = {
  3: [
    { from: '## Origin dari Conditioning Ini', to: '## Bagaimana Conditioning Bekerja' },
  ],
  4: [
    // Need 1 more word - add a word somewhere
    { from: 'Tapi itu cerita untuk part berikutnya.', to: 'Tapi itu adalah cerita untuk part berikutnya.' },
  ],
  5: [
    { from: '## Lever Digital di Sakamu', to: '## Trigger Mekanik di Ponsel' },
  ],
  6: [
    { from: 'Algoritma sengaja menampilkan highlight reel karena rasa inadequate', to: 'Algoritma sengaja menampilkan sisi terbaik orang lain karena rasa inadequate' },
    { from: '## Ekonomi yang Diciptakan dari Rasa Kurang', to: '## Monetisasi Perasaan Tidak Cukup' },
  ],
  7: [
    // Staccato: "Bukan penyembuhan | Bukan kesadaran | Validasi sosial" - already fixed to "Yang dicari bukan penyembuhan atau kesadaran, tapi validasi sosial." but still showing
    // Let me check - maybe the fix didn't apply or there's a duplicate
    { from: 'Bukan penyembuhan, bukan kesadaran, tapi validasi sosial.', to: 'Yang dicari bukan penyembuhan atau kesadaran, melainkan validasi sosial.' },
  ],
  8: [
    { from: '## Mekanisme Adaptasi Otak', to: '## Neuroplastisitas Generasi Digital' },
  ],
  9: [
    { from: '## Eksploitasi Konsep Growth Mindset', to: '## Peliintiran Konsep Akademik' },
  ],
  10: [
    { from: '## Kabut di Atas Krisis Struktural', to: '## Tabir di Balik Label' },
  ],
  11: [
    { from: '## Ekonomi yang Berubah, Standar yang Tidak', to: '## Ketidaksesuaian Standar Generasi' },
    { from: '## Target yang Tidak Tercapai', to: '## Ekspektasi vs Realitas Ekonomi' },
  ],
  12: [
    // Staccato: "Ingat [Part 9]... | Growth mindset menyalahkanmu | Industri self-improvement butuh kamu merasa inadequate"
    // The previous fix may not have applied. Let me check and fix.
    { from: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu dan industri self-improvement butuh kamu merasa inadequate, sehingga kamu beli kursus tapi tidak berubah.',
      to: 'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu dan industri self-improvement butuh kamu merasa inadequate, sehingga kamu beli kursus namun tidak berubah.' },
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
      console.log(`Part ${i}: SKIP (not found): ${fix.from.substring(0, 60)}`);
    }
  }
  
  if (changed) {
    writeFileSync(file, JSON.stringify(data, null, 2));
  }
}

console.log('\n=== FIXES APPLIED ===');
