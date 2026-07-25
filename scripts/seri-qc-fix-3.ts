import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Part 5: merge staccato
let p5 = JSON.parse(readFileSync(dir + 'part-05.json', 'utf-8'));
p5.body = p5.body.replace(
  'Mungkin next one. Mungkin next one. Mungkin next one.\n\nIni bukan kelemahan kamu. Ini desain.',
  'Mungkin next one, mungkin next one, mungkin next one. Ini bukan kelemahan kamu melainkan desain sistem.'
);
writeFileSync(dir + 'part-05.json', JSON.stringify(p5, null, 2));
console.log('Part 5: staccato fixed');

// Part 7: merge staccato
let p7 = JSON.parse(readFileSync(dir + 'part-07.json', 'utf-8'));
p7.body = p7.body.replace(
  'Sekarang bandingkan dengan video tentang kesembuhan. Angkanya tidak seimbang. Dan itu bukan kebetulan.',
  'Sekarang bandingkan dengan video tentang kesembuhan, dan angkanya tidak seimbang, dan itu bukan kebetulan.'
);
writeFileSync(dir + 'part-07.json', JSON.stringify(p7, null, 2));
console.log('Part 7: staccato fixed');
