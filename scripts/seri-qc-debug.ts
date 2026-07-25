import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

// Find exact context for remaining issues
console.log('=== DEBUG: Remaining issues context ===\n');

for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const body = data.body;
  
  // Check AI vocab
  const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri'];
  const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash'];
  
  for (const w of [...aiId, ...aiEn]) {
    if (body.toLowerCase().includes(w.toLowerCase())) {
      const idx = body.toLowerCase().indexOf(w.toLowerCase());
      console.log(`Part ${i} AI vocab "${w}": ...${body.substring(Math.max(0, idx-30), idx + w.length + 30)}...`);
    }
  }
  
  // Check fragmented headers
  const lines = body.split('\n');
  for (let j = 0; j < lines.length; j++) {
    if (lines[j].startsWith('## ') && j + 1 < lines.length) {
      const next = lines[j+1].trim() || (lines[j+2] ? lines[j+2].trim() : '');
      if (next) {
        const hw = new Set(lines[j].replace('## ','').toLowerCase().split(/\s+/));
        const nw = new Set(next.toLowerCase().split(/\s+/));
        const overlap = [...hw].filter(w => nw.has(w));
        if (overlap.length >= 2) {
          console.log(`Part ${i} fragmented header: "${lines[j].trim()}" | next: "${next.substring(0, 80)}" | overlap: ${overlap.join(',')}`);
        }
      }
    }
  }
  
  // Check neg parallelisms
  const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
  if (neg.length > 0) {
    for (const n of neg) {
      const idx = body.indexOf(n);
      console.log(`Part ${i} neg parallel: ...${body.substring(Math.max(0, idx-20), idx + n.length + 20)}...`);
    }
  }
  
  // Check rule of three
  const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
  if (triples.length > 2) {
    console.log(`Part ${i} rule of three (${triples.length}):`);
    triples.forEach(t => console.log(`  - ${t}`));
  }
  
  // Check staccato
  const sentences = body.split(/[.!?]\s+/);
  let currentRun = 0;
  for (let j = 0; j < sentences.length; j++) {
    if (sentences[j].split(/\s+/).length <= 6) {
      currentRun++;
      if (currentRun >= 3) {
        const runSentences = sentences.slice(j - currentRun + 1, j + 1);
        console.log(`Part ${i} staccato (${currentRun}): ${runSentences.map(s => s.trim().substring(0, 40)).join(' | ')}`);
      }
    } else {
      currentRun = 0;
    }
  }
}
