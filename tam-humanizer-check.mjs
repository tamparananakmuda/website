import { readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const filePath = join(process.cwd(), 'content/articles/karier/shift-shock-gen-z-ekspektasi-vs-realitas-kerja.md');
const { content: body } = matter(readFileSync(filePath, 'utf8'));

console.log('=== HUMANIZER AUDIT ===\n');

// 1. Paragraph rhythm
const paras = body.split('\n\n').filter(p => p.trim() && !p.startsWith('```') && !p.startsWith('---'));
console.log('1. PARAGRAPH RHYTHM');
const lengths = paras.map(p => p.split(/\s+/).length);
console.log('   Paragraphs:', paras.length);
console.log('   Word counts:', lengths.join(', '));
const avg = Math.round(lengths.reduce((a,b) => a+b, 0) / lengths.length);
console.log('   Average:', avg, 'words');
const short = lengths.filter(l => l < 15).length;
const long = lengths.filter(l => l > 60).length;
console.log('   Short (<15):', short, '| Long (>60):', long);
if (short > paras.length * 0.4) console.log('   WARN: Too many short paragraphs');
if (long < 1) console.log('   WARN: No long paragraphs for rhythm variety');

// 2. Concrete vs abstract
console.log('\n2. CONCRETE vs ABSTRACT');
const concreteMarkers = (body.match(/\b(Fito|Excel|WA group|TikTok|Rp[\d.,]+|[\d.]+%|\d+ responden|\d+ Gen Z|K3|Kuningan|Asahan|DKI Jakarta|Papua|Jawa Barat|strategic role|flexible working hours|input data|accounting officer|admin|pinjol|tabungan|kos|orang tua)\b/gi) || []).length;
const abstractMarkers = (body.match(/\b(fenomena|konsep|paradigma|esensial|fundamental|secara umum|pada dasarnya|pada intinya|secara keseluruhan|dinamika|kompleksitas)\b/gi) || []).length;
console.log('   Concrete markers:', concreteMarkers);
console.log('   Abstract markers:', abstractMarkers);
const ratio = concreteMarkers / Math.max(1, concreteMarkers + abstractMarkers);
console.log('   Concrete ratio:', Math.round(ratio * 100) + '%');
if (ratio < 0.6) console.log('   WARN: Too abstract, need more concrete examples');

// 3. Human signature quality
console.log('\n3. HUMAN SIGNATURE');
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b/gi) || []).length;
const personalExp = (body.match(/saya (perhatikan|ingat|melihat|pikir|rasa|merasa|pernah)|teman-teman saya|di kantor saya|menurut saya/gi) || []).length;
console.log('   Personal pronouns (kita/kamu/saya):', personal);
console.log('   Personal experience markers:', personalExp);
if (personalExp < 1) console.log('   WARN: No personal experience paragraphs');

// 4. Formal/robotic phrases
console.log('\n4. FORMAL/ROBOTIC PHRASES');
const formal = ['merupakan','demikian','oleh karena itu','dengan demikian','selain itu','lebih lanjut','sebagai contoh','dapat disimpulkan','dapat dilihat','perlu ditekankan','sebagaimana diketahui','sebagaimana telah'];
const foundFormal = formal.filter(w => body.toLowerCase().includes(w));
if (foundFormal.length) console.log('   FOUND:', foundFormal.join(', '));
else console.log('   CLEAN: No formal/robotic phrases');

// 5. Repetition check
console.log('\n5. REPETITION CHECK');
const wordCounts = {};
const words = body.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(w => w.length > 4);
for (const w of words) wordCounts[w] = (wordCounts[w] || 0) + 1;
const repeated = Object.entries(wordCounts).filter(([w, c]) => c > 8).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('   Most repeated (>8x):');
repeated.forEach(([w, c]) => console.log('     ' + w + ': ' + c));

// 6. Sentence variety
console.log('\n6. SENTENCE VARIETY');
const bodyNoHead = body.replace(/^#{1,6}\s+.*$/gm, '').replace(/```[\s\S]*?```/g, '');
const sentences = bodyNoHead.split(/[.!?]\s+/).filter(s => s.trim().length > 0);
const sentLengths = sentences.map(s => s.split(/\s+/).length);
const sentAvg = Math.round(sentLengths.reduce((a,b) => a+b, 0) / sentLengths.length);
const sentShort = sentLengths.filter(l => l <= 8).length;
const sentLong = sentLengths.filter(l => l > 25).length;
console.log('   Sentences:', sentences.length);
console.log('   Avg length:', sentAvg, 'words');
console.log('   Short (<=8):', sentShort, '| Long (>25):', sentLong);
if (sentAvg > 22) console.log('   WARN: Sentences too long on average');
if (sentShort < 3) console.log('   WARN: Not enough short sentences for punch');

// 7. Hyphenated word count
console.log('\n7. HYPHENATED WORDS');
const hyph = {};
const hyphMatches = body.match(/\b[a-z]+-[a-z]+\b/gi) || [];
for (const h of hyphMatches) hyph[h.toLowerCase()] = (hyph[h.toLowerCase()] || 0) + 1;
const hyphOver = Object.entries(hyph).filter(([w, c]) => c > 2).sort((a, b) => b[1] - a[1]);
if (hyphOver.length) {
  console.log('   Overused (>2x):');
  hyphOver.forEach(([w, c]) => console.log('     ' + w + ': ' + c));
} else {
  console.log('   CLEAN: No hyphenated word overuse');
}

// 8. Section opening lines
console.log('\n8. SECTION OPENING LINES');
const lines = body.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].startsWith('## ') && i + 1 < lines.length) {
    const next = lines[i+1].trim() || (lines[i+2] ? lines[i+2].trim() : '');
    if (next) {
      console.log('   ' + lines[i].trim());
      console.log('     → ' + next.substring(0, 100));
    }
  }
}

// 9. Rule of three
console.log('\n9. RULE OF THREE');
const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
console.log('   Count:', triples.length, '(max 2)');
triples.forEach(t => console.log('     - ' + t));

// 10. "Yang" overuse
console.log('\n10. "YANG" OVERUSE');
const yangCount = (body.match(/\byang\b/gi) || []).length;
const totalWords = body.split(/\s+/).length;
const yangPct = Math.round((yangCount / totalWords) * 100);
console.log('   "yang" count:', yangCount, '(' + yangPct + '% of', totalWords, 'words)');
if (yangPct > 3) console.log('   WARN: "yang" overuse (>3%)');

console.log('\n=== END ===');
