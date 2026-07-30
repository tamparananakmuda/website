import { readFileSync } from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'content', 'whitepaper', 'krisis-demografis-indonesia-sistem-yang-tidak-memberi-alasan-punya-anak.md');
const raw = readFileSync(filePath, 'utf8');

// Extract frontmatter and body
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
const fm = fmMatch ? fmMatch[1] : '';
const fullBody = raw.substring(fmMatch ? fmMatch[0].length : 0);

// Extract content between markers
const startIdx = fullBody.indexOf('<!-- START WHITEPAPER CONTENT -->');
const endIdx = fullBody.indexOf('<!-- END WHITEPAPER CONTENT -->');
const body = startIdx >= 0 && endIdx >= 0 ? fullBody.substring(startIdx, endIdx) : fullBody;
const title = (fm.match(/title:\s*"(.+?)"/) || [])[1] || '';
const full = body + ' ' + title;
const issues: string[] = [];
const warnings: string[] = [];

// === CHARACTER-LEVEL CHECKS ===
if (full.includes('\u2014') || full.includes('\u2013')) issues.push('CRITICAL: Em/en dash found');
if (body.includes('\u201c') || body.includes('\u201d')) issues.push('CRITICAL: Curly quotes');
if (body.includes('\u2018') || body.includes('\u2019')) issues.push('CRITICAL: Curly single quotes');
const exclCount = (body.match(/!/g) || []).length;
if (exclCount > 1) issues.push('Exclamation marks: ' + exclCount + ' (max 1)');

// === AI VOCABULARY ===
const aiEn = ['crucial','pivotal','vibrant','tapestry','delve','showcase','underscore','testament','foster','garner','intricate','landscape','additionally','enduring','enhance','highlight','interplay','multifaceted','nuanced','robust','holistic','paradigm','leverage','realm','seamless','empower','transform','unlock','unleash','comprehensive','facilitate','optimize','streamline','navigate','harness','cultivate','spearhead','bolster','amidst','ever-evolving','fast-paced'];
const foundEn = aiEn.filter(w => body.toLowerCase().includes(w));
if (foundEn.length) issues.push('AI vocab EN: ' + foundEn.join(', '));

const aiId = ['signifikan','krusial','esensial','vital','mendalam','memperhatikan','pada dasarnya','secara fundamental','pada intinya','pada akhirnya','menariknya','perlu dicatat','perlu diingat','tidak dapat dipungkiri','perlu diketahui bahwa','sangat penting untuk','tidak diragukan lagi','sebagai catatan','seperti yang kita ketahui','tentu saja','sudah barang tentu'];
const foundId = aiId.filter(w => body.toLowerCase().includes(w));
if (foundId.length) issues.push('AI vocab ID: ' + foundId.join(', '));

// === SENTENCE-LEVEL CHECKS ===
// Filter out list items and chart JSON before splitting sentences
const proseBody = body.split(/\n/).filter(l => !l.trim().startsWith('-') && !l.trim().startsWith('*') && !/^\d+\./.test(l.trim()) && !l.trim().startsWith('{') && !l.trim().startsWith('```') && !l.trim().startsWith('|') && !l.trim().startsWith('>')).join('\n');
const sentences = proseBody.split(/[.!?]\s+/);
let currentRun = 0, maxRun = 0;
for (const s of sentences) { if (s.split(/\s+/).length <= 6) { currentRun++; maxRun = Math.max(maxRun, currentRun); } else currentRun = 0; }
if (maxRun >= 3) issues.push('Staccato drama: ' + maxRun + ' consecutive short sentences');

const triples = body.match(/(\w+,\s+\w+,\s+(?:dan|and)\s+\w+)/g) || [];
if (triples.length > 2) issues.push('Rule of three: ' + triples.length + ' (max 2)');

const neg = body.match(/(tidak hanya.*tapi juga|bukan hanya.*melainkan|not only.*but also)/gi) || [];
if (neg.length) issues.push('Negative parallelisms: ' + neg.length);

// === PROMOTIONAL LANGUAGE ===
const promo = ['game-changing','revolutionary','groundbreaking','cutting-edge','seamless','empower','transform','unlock','unleash','supercharge','skyrocket','disruptive','next-generation','world-class','best-in-class','state-of-the-art','innovative','seamlessly','effortlessly'];
const foundPromo = promo.filter(w => body.toLowerCase().includes(w));
if (foundPromo.length) issues.push('Promotional: ' + foundPromo.join(', '));

// === SIGNPOSTING & FILLERS ===
const signs = ['let.s dive','here.s what you need','marilah kita','berikut adalah hal yang perlu','tanpa berpanjang lebar','sebelum kita mulai','pertama-tama','pertama sekali','tanpa basa-basi','pada bagian ini','di section ini','selanjutnya kita akan','di bagian berikutnya'];
if (signs.some(w => new RegExp(w, 'i').test(body))) issues.push('Signposting detected');

const fillers = ['in order to','due to the fact','at this point in time','it is important to note','perlu diketahui bahwa','sebagai tambahan','perlu ditekankan bahwa','sudah menjadi rahasia umum','tidak dapat dipungkiri lagi'];
const foundFillers = fillers.filter(w => body.toLowerCase().includes(w));
if (foundFillers.length) issues.push('Filler: ' + foundFillers.join(', '));

// === GENERIC CONCLUSIONS ===
const generic = ['the future looks bright','exciting times','masa depan yang cerah','awal dari sesuatu yang besar','peluang tak terbatas','langkah menuju masa depan','membuka jalan menuju','hanya waktu yang akan menentukan','hanya waktu yang bisa menjawab','sisa adalah sejarah'];
const foundGeneric = generic.filter(w => body.toLowerCase().includes(w));
if (foundGeneric.length) issues.push('Generic conclusion: ' + foundGeneric.join(', '));

// === HUMAN SIGNATURE ===
const personal = (body.match(/\bkita\b|\bkamu\b|\bsaya\b|\bkami\b/gi) || []).length;
if (personal < 3) issues.push('Human signature weak: ' + personal + ' (need 3+)');

// === HEADING STRUCTURE ===
const h1 = (body.match(/^# /gm) || []).length;
const h2 = (body.match(/^## /gm) || []).length;
const h3 = (body.match(/^### /gm) || []).length;
if (h1 > 0) issues.push('CRITICAL: h1 found: ' + h1 + ' (use h2/h3 only)');
if (h2 < 5) issues.push('h2 count: ' + h2 + ' (need min 5)');

// === HEADING QUALITY ===
const h2s = (body.match(/^## (.+)$/gm) || []).map(h => h.replace(/^## /, ''));
const genericHeadings = h2s.filter(h => /^(analisis|background|latar belakang|pendahuluan|kesimpulan|rekomendasi|metodologi|data|temuan|diskusi)$/i.test(h.trim()));
if (genericHeadings.length > 2) warnings.push('Generic headings: ' + genericHeadings.join(', ') + ' (should be conclusion-first)');

// === INTERNAL LINKS ===
const ilArtikel = (body.match(/\]\(\/artikel\//g) || []).length;
const ilWp = (body.match(/\]\(\/whitepaper\//g) || []).length;
const il = ilArtikel + ilWp;
if (il < 3) issues.push('Internal links: ' + il + ' (need min 3)');

// === WORD COUNT ===
const wc = body.split(/\s+/).filter(w => w.length > 0).length;
if (wc < 3000) issues.push('Word count: ' + wc + ' (need min 3.000)');
if (wc > 10000) issues.push('Word count: ' + wc + ' (max 10.000)');

// === UNATTRIBUTED NUMBERS ===
const numberSentences = sentences.filter(s => /\d+%|\d+\s*(triliun|miliar|juta|ribu)|Rp[\d.,]+|\d+\s*(persen|%)/i.test(s));
const unattributed = numberSentences.filter(s => !/(menurut|berdasarkan|data|catatan|mencatat|riset|survei|studi|OJK|BPS|We Are Social|Kemenkop|Jakpat|Katadata|Litbang|lembaga|institut|kementerian|world bank|imf|oecd|un|unesco|who|iLO|McKinsey|Deloitte|PwC|EY|KPMG|Gartner|Forrester|IDC|Statista|app Annie|datareportal|global web index|good stats|ILO|USAID|UNFPA|Bappenas|IDN|SGH|Teleskop|Reuters|Japan Times|IZA|HAL|Susenas|Sakernas|SUPAS|World Policy|Prita|Becker|Meadows|Fitria|Rasnadipoetra|Jurnal|Prof|IMF|OECD|UU Ketenagakerjaan|estimasi TAM|financial educator)/i.test(s));
if (unattributed.length > 0) issues.push('Unattributed numbers: ' + unattributed.length);

// === CITATION DENSITY ===
const citations = (body.match(/\((?:[A-Z][a-z]+(?:\s+(?:et\s+al\.?|&|dan)\s+[A-Z][a-z]+)?),?\s*\d{4}\)/g) || []).length;
const citationDensity = citations / (wc / 1000);
if (citationDensity < 1) warnings.push('Citation density low: ' + citations + ' citations / ' + wc + ' words (' + citationDensity.toFixed(1) + ' per 1.000 words, target > 1)');

// === PARAGRAPH LENGTH ===
const paragraphs = body.split(/\n\n+/).filter(p => p.trim().length > 0);
const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150);
if (longParagraphs.length > 0) warnings.push('Long paragraphs (> 150 words): ' + longParagraphs.length + ' (cognitive load risk)');

// === SENTENCE LENGTH ===
const sentenceLengths = sentences.map(s => s.split(/\s+/).length).filter(l => l > 0);
const avgSentLen = sentenceLengths.reduce((a,b) => a+b, 0) / sentenceLengths.length;
const longSentences = sentenceLengths.filter(l => l > 40).length;
if (avgSentLen > 30) warnings.push('Avg sentence length: ' + avgSentLen.toFixed(1) + ' words (target < 30)');
if (longSentences > sentences.length * 0.15) warnings.push('Long sentences (> 40 words): ' + longSentences + ' (' + (longSentences/sentences.length*100).toFixed(0) + '%, target < 15%)');

// === HEDGING LANGUAGE ===
const strongHedging = (body.match(/\b(menunjukkan|membuktikan|mengkonfirmasi)\b/gi) || []).length;
const weakHedging = (body.match(/\b(mungkin|kemungkinan|cenderung|berpotensi|mengindikasikan)\b/gi) || []).length;
if (strongHedging > weakHedging * 3 && strongHedging > 10) warnings.push('Hedging imbalance: strong=' + strongHedging + ' vs weak=' + weakHedging);

// === PULL QUOTES ===
const pullQuotes = (body.match(/^> /gm) || []).length;
const expectedPullQuotes = Math.floor(wc / 500);
if (pullQuotes < expectedPullQuotes) warnings.push('Pull quotes: ' + pullQuotes + ' / expected ~' + expectedPullQuotes + ' (1 per 500 words)');

// === BOLD KEY FINDINGS ===
const boldTexts = (body.match(/\*\*[^*]+\*\*/g) || []).length;
if (boldTexts < Math.floor(wc / 300)) warnings.push('Bold key findings: ' + boldTexts + ' / expected ~' + Math.floor(wc/300) + ' (1 per 300 words for skim reader)');

// === LIMITATIONS SECTION ===
const hasLimitations = /limitation|keterbatasan|batasan|caveat/i.test(body);
if (!hasLimitations) warnings.push('No limitations section detected');

// === METHODOLOGY SECTION ===
const hasMethodology = /metodologi|methodology|metode penelitian/i.test(body);
const hasOriginalData = /survei kami|data yang kami kumpulkan|original data|primary research/i.test(body);
if (hasOriginalData && !hasMethodology) issues.push('Original data detected tapi no methodology section');

// === EXECUTIVE SUMMARY ===
const hasExecSummary = /executive summary|ringkasan eksekutif/i.test(body);
if (!hasExecSummary) warnings.push('No Executive Summary heading detected');

// === COUNTER-ARGUMENT ===
const hasCounterArg = /counter|lawan|bertentangan|kritik|namun|tetapi|di sisi lain|sebaliknya/i.test(body);
if (!hasCounterArg) warnings.push('No counter-argument detected (Toulmin rebuttal missing)');

// === SECTION WORD COUNT ===
const sections = body.split(/^## /m).filter(s => s.trim().length > 0);
const sectionWordCounts = sections.map(s => {
  const heading = s.split(/\n/)[0].trim();
  const swc = s.split(/\s+/).filter(w => w.length > 0).length;
  return { heading, wc: swc };
});
const execSection = sectionWordCounts.find(s => /executive summary|ringkasan eksekutif/i.test(s.heading));
const recSection = sectionWordCounts.find(s => /recommendation|rekomendasi/i.test(s.heading));
const conclusionSection = sectionWordCounts.find(s => /conclusion|kesimpulan/i.test(s.heading));
const limitationsSection = sectionWordCounts.find(s => /limitation|keterbatasan/i.test(s.heading));

if (execSection && execSection.wc > 400) warnings.push('Executive Summary too long: ' + execSection.wc + ' words (target 200-300)');
if (execSection && execSection.wc < 150) warnings.push('Executive Summary too short: ' + execSection.wc + ' words (target 200-300)');
if (recSection && recSection.wc < 300) warnings.push('Recommendation too short: ' + recSection.wc + ' words (target 500-1.500)');
if (conclusionSection && conclusionSection.wc > 700) warnings.push('Conclusion too long: ' + conclusionSection.wc + ' words (target 300-500)');
if (!limitationsSection) warnings.push('No Limitations section detected (word count scan)');

// === RECOMMENDATION SPECIFICITY ===
if (recSection) {
  const recText = sections.find(s => /recommendation|rekomendasi/i.test(s.split(/\n/)[0])) || '';
  const vagueRecs = (recText.match(/\b(tingkatkan|perkuat|perbaiki|optimalkan|dukung|promosikan|fokus pada|perhatikan|pertimbangkan)\b/gi) || []).length;
  if (vagueRecs > 3) warnings.push('Vague recommendations: ' + vagueRecs + ' generic verbs');
}

// === DUPLICATE SENTENCES ===
const normalizedSentences = sentences.map(s => s.toLowerCase().trim().replace(/[^\w\s]/g, '')).filter(s => s.length > 20);
const duplicates = normalizedSentences.filter((s, i) => normalizedSentences.indexOf(s) !== i);
if (duplicates.length > 0) issues.push('Duplicate sentences: ' + duplicates.length);

// === HEADING HIERARCHY ===
if (h3 > 15) warnings.push('Deep heading hierarchy: ' + h3 + ' h3 headings');

// === LINK ANCHOR TEXT ===
const linkAnchors = (body.match(/\[([^\]]+)\]\(\/(?:artikel|whitepaper)\/[^)]+\)/g) || []).map(l => l.match(/\[([^\]]+)\]/)[1]);
const genericAnchors = linkAnchors.filter(a => /^(baca|selengkapnya|di sini|here|link|klik|lihat)$/i.test(a.trim()));
if (genericAnchors.length > 0) warnings.push('Generic link anchor text: ' + genericAnchors.join(', '));

// === SECTION OPENING QUALITY ===
const sectionFirstSentences = sections.map(s => {
  const lines = s.split(/\n/).filter(l => l.trim().length > 0 && !l.startsWith('#') && !l.startsWith('```') && !l.startsWith('|'));
  return lines[0] ? lines[0].trim().substring(0, 100) : '';
}).filter(s => s.length > 0);
const robotikOpenings = sectionFirstSentences.filter(s => /^(pada bagian|berikut adalah|seperti yang|sebelumnya|selanjutnya|di section|pada chapter)/i.test(s));
if (robotikOpenings.length > 2) warnings.push('Robotik section openings: ' + robotikOpenings.length);

// === EXEC SUMMARY THESIS ===
if (execSection) {
  const execText = sections.find(s => /executive summary|ringkasan eksekutif/i.test(s.split(/\n/)[0])) || '';
  const execParagraphs = execText.split(/\n\n+/).filter(p => p.trim().length > 0);
  if (execParagraphs.length > 0) {
    const firstPara = execParagraphs[0];
    const hasDataInFirst = /\d+%|\d+\s*(juta|miliar|ribu|triliun)|Rp[\d.,]+/i.test(firstPara);
    if (!hasDataInFirst) warnings.push('Executive Summary first paragraph: no data detected');
  }
}

// === FAQ ===
const hasFAQ = /faq|frequently asked|pertanyaan umum/i.test(body);
if (!hasFAQ) warnings.push('No FAQ section (AI engines prefer FAQ for citation)');

// === REPORT ===
console.log('=== QC AUDIT (WHITEPAPER) ===');
console.log('Word count:', wc, '| h2:', h2, '| h3:', h3, '| internal links:', il);
console.log('Citations:', citations, '| density:', citationDensity.toFixed(1), '/1k words');
console.log('Avg sentence length:', avgSentLen.toFixed(1), '| long sentences:', longSentences);
console.log('Pull quotes:', pullQuotes, '| bold findings:', boldTexts);
console.log('Paragraphs:', paragraphs.length, '| long (>150w):', longParagraphs.length);
console.log('Human signature (kita/kamu/saya/kami):', personal);
if (warnings.length) { console.log('\nWARNINGS (' + warnings.length + '):'); warnings.forEach(w => console.log('  [W] ' + w)); }
if (issues.length) { console.log('\nFAIL (' + issues.length + '):'); issues.forEach(i => console.log('  [F] ' + i)); process.exit(1); }
else if (warnings.length === 0) console.log('\nCLEAN: All checks passed, no warnings.');
else console.log('\nPASS with warnings. Review warnings above before proceeding.');
