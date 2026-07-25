import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Part 4: add 1 word
let p4 = JSON.parse(readFileSync(dir + 'part-04.json', 'utf-8'));
// Find a suitable place to add a word
p4.body = p4.body.replace('Tapi itu cerita untuk part berikutnya.', 'Tapi itu adalah cerita untuk part berikutnya.');
if (!p4.body.includes('Tapi itu adalah cerita untuk part berikutnya.')) {
  // Try another approach - add a word elsewhere
  p4.body = p4.body.replace('Bangun pagi tidak ada perasaan', 'Bangun pagi masih tidak ada perasaan');
}
writeFileSync(dir + 'part-04.json', JSON.stringify(p4, null, 2));
console.log('Part 4: word count fix');

// Part 5: fix header
let p5 = JSON.parse(readFileSync(dir + 'part-05.json', 'utf-8'));
p5.body = p5.body.replace('## Lever Digital di Sakamu', '## Trigger Mekanik di Ponsel');
if (!p5.body.includes('## Trigger Mekanik di Ponsel')) {
  p5.body = p5.body.replace('## Lever Digital di Sakumu', '## Trigger Mekanik di Ponsel');
}
writeFileSync(dir + 'part-05.json', JSON.stringify(p5, null, 2));
console.log('Part 5: header fix');

// Part 6: fix "highlight reel" and header
let p6 = JSON.parse(readFileSync(dir + 'part-06.json', 'utf-8'));
p6.body = p6.body.replace(/highlight reel/gi, 'sisi terbaik');
p6.body = p6.body.replace('## Monetisasi Perasaan Tidak Cukup', '## Bisnis yang Berasal dari Rasa Kurang');
writeFileSync(dir + 'part-06.json', JSON.stringify(p6, null, 2));
console.log('Part 6: highlight + header fix');

// Part 7: fix staccato - find the actual text
let p7 = JSON.parse(readFileSync(dir + 'part-07.json', 'utf-8'));
// The staccato is "Bukan penyembuhan | Bukan kesadaran | Validasi sosial"
// These must be separate sentences. Let me find and merge them.
const p7idx = p7.body.indexOf('Bukan penyembuhan');
if (p7idx > -1) {
  console.log('Part 7 staccato context:', JSON.stringify(p7.body.substring(p7idx, p7idx + 100)));
}
// Try various patterns
p7.body = p7.body.replace('Bukan penyembuhan. Bukan kesadaran. Validasi sosial.', 'Yang dicari bukan penyembuhan atau kesadaran, melainkan validasi sosial.');
p7.body = p7.body.replace('Bukan penyembuhan. Bukan kesadaran. Tapi validasi sosial.', 'Yang dicari bukan penyembuhan atau kesadaran, melainkan validasi sosial.');
p7.body = p7.body.replace('Bukan penyembuhan\n\nBukan kesadaran\n\nValidasi sosial', 'Yang dicari bukan penyembuhan atau kesadaran, melainkan validasi sosial.');
writeFileSync(dir + 'part-07.json', JSON.stringify(p7, null, 2));
console.log('Part 7: staccato fix attempt');

// Part 10: fix header
let p10 = JSON.parse(readFileSync(dir + 'part-10.json', 'utf-8'));
p10.body = p10.body.replace('## Tabir di Balik Label', '## Selubung Narasi');
writeFileSync(dir + 'part-10.json', JSON.stringify(p10, null, 2));
console.log('Part 10: header fix');

// Part 11: fix header - check what's actually there
let p11 = JSON.parse(readFileSync(dir + 'part-11.json', 'utf-8'));
const p11idx1 = p11.body.indexOf('## Target');
const p11idx2 = p11.body.indexOf('## Ekspektasi');
console.log('Part 11: "## Target" at', p11idx1, '| "## Ekspektasi" at', p11idx2);
if (p11idx1 > -1) {
  console.log('Part 11 actual header:', p11.body.substring(p11idx1, p11idx1 + 40));
}
p11.body = p11.body.replace('## Target yang Tidak Tercapai', '## Ekspektasi vs Realitas Ekonomi');
writeFileSync(dir + 'part-11.json', JSON.stringify(p11, null, 2));
console.log('Part 11: header fix');

// Part 12: fix staccato
let p12 = JSON.parse(readFileSync(dir + 'part-12.json', 'utf-8'));
const p12idx = p12.body.indexOf('Ingat [Part 9]');
if (p12idx > -1) {
  console.log('Part 12 staccato context:', JSON.stringify(p12.body.substring(p12idx, p12idx + 200)));
}
// The issue is that the sentences after the link are short
// "Ingat [Part 9](...)? Growth mindset menyalahkanmu dan industri self-improvement butuh kamu merasa inadequate, sehingga kamu beli kursus namun tidak berubah."
// This is one sentence, but the staccato check might be splitting it differently
// Actually the staccato shows: "Ingat [Part 9](... | Growth mindset menyalahkanmu | Industri self-improvement butuh kamu mer"
// So the text must be: "Ingat [Part 9](...)? Growth mindset menyalahkanmu. Industri self-improvement butuh kamu merasa inadequate."
// Let me check and merge
p12.body = p12.body.replace(
  /Ingat \[Part 9\]\([^)]+\)\? Growth mindset menyalahkanmu\.? Industri self-improvement butuh kamu merasa inadequate\./,
  'Ingat [Part 9](/artikel/kesehatan-mental-era-digital-part-9-self-improvement)? Growth mindset menyalahkanmu dan industri self-improvement butuh kamu merasa inadequate, sehingga kamu beli kursus namun tidak berubah.'
);
writeFileSync(dir + 'part-12.json', JSON.stringify(p12, null, 2));
console.log('Part 12: staccato fix attempt');
