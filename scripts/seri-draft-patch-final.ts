import { readFileSync, writeFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';

const finalPatches: Record<number, string> = {
  3: `Data dari I-NAMHS 2022 menunjukkan 1 dari 3 remaja Indonesia mengalami masalah kesehatan mental. BKM FISIP UI pada 2026 menemukan 371 mahasiswa mengalami gejala kecemasan dan depresi. Ini adalah generasi yang diajarkan untuk terus produksi, dan generasi ini hancur karena terus produksi. Sistem yang menguntungkan dari produktivitasmu tidak akan mengajarkan kamu kapan harus berhenti.`,
  4: `Data dari Eagle Hill Consulting pada 2024 menunjukkan 54% karyawan Gen Z mengalami burnout, dibandingkan 52% Milenial dan 42% Gen X. Gen Z adalah generasi dengan tingkat burnout tertinggi. Dan ini bukan karena Gen Z lemah, tapi karena Gen Z adalah generasi yang paling terkoneksi dengan sistem yang mengiras mereka setiap hari.`,
  6: `Zhu dan rekan pada 2023 menemukan bahwa FOMO berkorelasi dengan stres, kecemasan, dan gangguan tidur. FOMO bukan sekadar perasaan tidak enak. FOMO punya dampak nyata pada kesehatan mental. Dan FOMO adalah fitur, bukan bug, dari sistem yang menguntungkan dari perasaan tidak cukup.`,
  7: `Jurnal Pendidikan dan Ilmu Islam pada 2025 menemukan bahwa algoritma TikTok menciptakan echo chamber melalui pengulangan konten, yang menghasilkan kecemasan, stres, FOMO, dan kesepian. Feed kamu dibanjiri konten yang sama terus-menerus. Echo chamber ini tidak bisa dipecahkan dari dalam, karena semua yang kamu lihat mengkonfirmasi penderitaanmu.`,
  8: `GIEST pada 2025 menjelaskan bahwa otak Gen Z bukan rusak, tapi beradaptasi melalui neuroplasticity reconfiguration. Otak mengembangkan parallel processing, ultra-fast context switching, dan reconfiguration sebagai respons terhadap lingkungan digital. Ini bukan kerusakan. Ini adaptasi yang sempurna ke lingkungan yang salah. Dan adaptasi ini tidak bisa diundur.`,
  10: `Kompas pada 2025 menulis bahwa kemarahan Gen Z bukan kelemahan karakter, tapi hak politik dari realitas pahit. Bukan Gen Z yang lemah, tapi sistem yang membuat Gen Z marah. Dan kemarahan ini adalah respons yang rasional terhadap kondisi yang tidak adil, bukan gejala dari generasi yang rapuh.`
};

for (let i = 3; i <= 10; i++) {
  if (!finalPatches[i]) continue;
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const data = JSON.parse(readFileSync(file, 'utf-8'));
  
  // Insert before "## Insight"
  const insightIdx = data.body.indexOf('## Insight');
  if (insightIdx > -1) {
    data.body = data.body.slice(0, insightIdx) + finalPatches[i] + '\n\n' + data.body.slice(insightIdx);
  }
  
  writeFileSync(file, JSON.stringify(data, null, 2));
}

console.log('Final patches applied');

// Final check
let allOk = true;
for (let i = 1; i <= 12; i++) {
  const file = dir + 'part-' + String(i).padStart(2, '0') + '.json';
  const d = JSON.parse(readFileSync(file, 'utf-8'));
  const wc = d.body.split(/\s+/).filter(w => w.length > 0).length;
  const og = (d.og_headline || '').length;
  const md = (d.seo_meta_description || '').length;
  const ex = (d.excerpt || '').length;
  const em = (d.body.match(/—/g) || []).length + (d.body.match(/–/g) || []).length;
  const links = (d.body.match(/\/artikel\//g) || []).length;
  const h2 = (d.body.match(/^## /gm) || []).length;
  const tags = (d.seo_keywords || []).length;
  const refs = (d.source_references || []).length;
  const hasRecap = d.series_order >= 2 ? d.body.includes('Sebelumnya di') : true;
  const hasTeaser = d.series_order <= 11 ? d.body.includes('Selanjutnya di') : true;
  const hasSeries = d.series === 'kesehatan-mental-era-digital';
  
  const issues: string[] = [];
  if (wc < 1000) issues.push('WC=' + wc);
  if (wc > 2500) issues.push('WC_HIGH=' + wc);
  if (og > 50) issues.push('OG=' + og);
  if (md > 160) issues.push('MD=' + md);
  if (ex > 160) issues.push('EX=' + ex);
  if (em > 0) issues.push('EM=' + em);
  if (links < 2) issues.push('LINKS=' + links);
  if (h2 < 3) issues.push('H2=' + h2);
  if (tags < 3) issues.push('TAGS=' + tags);
  if (refs < 2) issues.push('REFS=' + refs);
  if (!hasRecap) issues.push('NO_RECAP');
  if (!hasTeaser) issues.push('NO_TEASER');
  if (!hasSeries) issues.push('NO_SERIES');
  if (issues.length > 0) allOk = false;
  
  console.log(`Part ${i}: ${issues.length ? issues.join(' ') : 'PASS'} (wc=${wc} links=${links} h2=${h2} tags=${tags} refs=${refs})`);
}

console.log('\n=== FINAL: ' + (allOk ? 'ALL 12 PARTS PASS ===' : 'HAS ISSUES ==='));
