import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const filePath = join(process.cwd(), 'content/articles/karier/shift-shock-gen-z-ekspektasi-vs-realitas-kerja.md');
const { content: body } = matter(readFileSync(filePath, 'utf8'));
const lines = body.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      const hw = new Set(lines[i].replace('## ','').toLowerCase().split(/\s+/));
      const nw = new Set(next.toLowerCase().split(/\s+/));
      const overlap = [...hw].filter(w => nw.has(w));
      if (overlap.length >= 2) {
        console.log('HEADER:', lines[i].trim());
        console.log('FIRST LINE:', next.substring(0, 100));
        console.log('OVERLAP WORDS:', overlap.join(', '));
        console.log('---');
      }
    }
  }
}

// Check staccato
const sentences = body.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0, runStart = 0;
const runs = [];
for (let i = 0; i < sentences.length; i++) {
  const wc = sentences[i].split(/\s+/).length;
  if (wc <= 6) {
    if (currentRun === 0) runStart = i;
    currentRun++;
    if (currentRun > maxRun) maxRun = currentRun;
  } else {
    if (currentRun >= 3) {
      runs.push({ start: runStart, count: currentRun, sentences: sentences.slice(runStart, runStart + currentRun) });
    }
    currentRun = 0;
  }
}
if (currentRun >= 3) runs.push({ start: runStart, count: currentRun, sentences: sentences.slice(runStart, runStart + currentRun) });
console.log('STACCATO RUNS (>=3):');
runs.forEach(r => {
  console.log('  Run of', r.count, 'starting at sentence', r.start);
  r.sentences.forEach((s, i) => console.log('    [' + (i+1) + '] (' + s.split(/\s+/).length + 'w) ' + s.trim().substring(0, 80)));
});
