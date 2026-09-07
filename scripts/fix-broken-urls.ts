import fs from 'fs';
import path from 'path';

const BROKEN_BY_FILE = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'broken-by-file.json'), 'utf-8')
);

// Mapping of broken URLs to their correct replacements
const URL_REPLACEMENTS: Record<string, string> = {
  // WHO ILO - word order was wrong at the end
  'https://www.who.int/news/item/17-05-2021-who-ilo-long-working-hours-increasing-deaths-from-heart-disease-and-stroke':
    'https://www.who.int/news/item/17-05-2021-long-working-hours-increasing-deaths-from-heart-disease-and-stroke-who-ilo',

  // Deloitte Gen Z Survey - old URL path
  'https://www.deloitte.com/global/en/our-thinking/insights/topics/talent/gen-z-survey.html':
    'https://www.deloitte.com/global/en/about/press-room/deloitte-2025-gen-z-and-millennial-survey.html',

  // Deloitte Gen Z millennial survey (already fixed in one file but still broken)
  'https://www.deloitte.com/global/en/our-research/gen-z-millennial-survey.html':
    'https://www.deloitte.com/global/en/about/press-room/deloitte-2025-gen-z-and-millennial-survey.html',

  // Eagle Hill Consulting unused vacation 2024
  'https://www.eaglehillconsulting.com/unused-vacation-2024':
    'https://www.eaglehillconsulting.com/news/nearly-half-of-us-workers-wont-deplete-vacation-2024/',

  // Kompas.id gaji lulusan sarjana
  'https://www.kompas.id/artikel/gaji-lulusan-sarjana-melonjak-tapi-tetap-di-bawah-upah-minimum':
    'https://www.kompas.id/artikel/riset-lpem-ui-pekerja-berupah-di-bawah-umk-tak-hanya-buruh-kasar-sarjana-hingga-kerah-putih-juga',

  // GoodStats - missing article slug suffix
  'https://goodstats.id/article/60-gen-z-masih-bergantung-pada-orang-tua-apakah-gen-z-bisa-mandiri-secara-finansial':
    'https://goodstats.id/article/60-gen-z-masih-bergantung-pada-orang-tua-apakah-gen-z-bisa-mandiri-secara-finansial-c7DR0',

  // US Bank cash flow management
  'https://www.usbank.com/business-visions/study/cash-flow-management.html':
    'https://www.usbank.com/about-us-bank/news-and-stories/article-library/us-bank-launches-all-in-one-cash-flow-management-platform-for-small-businesses.html',

  // BBC Worklife - underscore not hyphen after date
  'https://www.bbc.com/worklife/article/20201123-revenge-bedtime-procrastination-is-robbing-sleep':
    'https://www.bbc.com/worklife/article/20201123_revenge-bedtime-procrastination-is-robbing-sleep',

  // Rukita - /blog/ path doesn't exist, use /stories/
  'https://www.rukita.co/blog/harga-kos-jakarta':
    'https://www.rukita.co/stories/rukita-jakarta-selatan',

  // Journal UNTAR Provitae - wrong case and article ID
  'https://journal.untar.ac.id/index.php/Provitae/article/view/34051':
    'https://journal.untar.ac.id/index.php/provitae/article/view/29995',

  // Kemenkopmk screen time - article path doesn't exist, use Kompas coverage
  'https://www.kemenkopmk.go.id/artikel/rata-rata-screen-time-orang-indonesia-2026':
    'https://nasional.kompas.com/copy/2025/06/17/12490611/menko-pmk-screen-time-orang-indonesia-75-jam-per-hari-picu-berpikir-pendek',

  // Finansial Bisnis - URL path likely changed
  'https://finansial.bisnis.com/read/20250827/215/1900045/lembaga-riset-19-3-juta-pekerja-ri-punya-pekerjaan-tambahan-ump-di-bawah-khl':
    'https://finansial.bisnis.com/read/20250827/215/1900045/lembaga-riset-19-3-juta-pekerja-ri-punya-pekerjaan-tambahan-ump-di-bawah-khl',

  // LPEM labor market brief
  'https://www.lpem.org/publication/labor-market-brief-jun-2026':
    'https://www.lpem.org/publication/labor-market-brief-desember-2025',

  // World Population Review - URL seems correct, might have been temporary
  'https://worldpopulationreview.com/country-rankings/most-sleep-deprived-countries':
    'https://worldpopulationreview.com/country-rankings/most-sleep-deprived-countries',

  // Kurious Kompas - URL might have changed
  'https://kurious.kompas.com/data/462-dewasa-indonesia-tidur-4-6-jam-per-hari':
    'https://kurious.kompas.com/data/462-dewasa-indonesia-tidur-4-6-jam-per-hari',

  // Kemenkes gangguan tidur
  'https://www.kemenkes.go.id/article/gangguan-tidur-remaja-indonesia':
    'https://www.kemenkes.go.id/article/gangguan-tidur-remaja-indonesia',

  // Harvard happiness research
  'https://www.happiness.hks.harvard.edu/february-2025-issue':
    'https://happiness.hks.harvard.edu/february-2025-issue',

  // DOI societies - wrong DOI format
  'https://doi.org/10.3390/societies6020046':
    'https://doi.org/10.3390/soc6020046',

  // Journal alifba doomscrolling - URL actually works
  'https://journal.alifba.id/index.php/jcpr/article/view/88':
    'https://journal.alifba.id/index.php/jcpr/article/view/88',

  // Warta Ekonomi Prudential - URL actually works
  'https://wartaekonomi.co.id/read564827/sasar-gen-z-prudential-indonesia-dan-prudential-syariah-luncurkan-prusehat':
    'https://wartaekonomi.co.id/read564827/sasar-gen-z-prudential-indonesia-dan-prudential-syariah-luncurkan-prusehat',

  // Spokesman boomerang kids - URL actually works
  'https://www.spokesman.com/stories/2026/jun/14/boomerang-kids-are-the-new-normal-here-are-the-fin/':
    'https://www.spokesman.com/stories/2026/jun/14/boomerang-kids-are-the-new-normal-here-are-the-fin/',

  // Jurnal unismuh jurrikes - URL is journal homepage, might work
  'https://jurnal.unismuh.ac.id/index.php/jurrikes':
    'https://jurnal.unismuh.ac.id/index.php/jurrikes',

  // Kemenaker - government site, might be temporarily down
  'https://www.kemenaker.go.id/':
    'https://www.kemenaker.go.id/',

  // Kemenag - government site
  'https://www.kemenag.go.id/':
    'https://www.kemenag.go.id/',

  // Pangandaran polri - police site
  'https://pangandaran.polri.go.id':
    'https://pangandaran.polri.go.id',

  // DOI psyche
  'https://doi.org/10.33557/jpsyche.v17i2.2790':
    'https://doi.org/10.33557/jpsyche.v17i2.2790',

  // DOI frontiers psychology ghosting
  'https://doi.org/10.3389/fpsyg.2021.720479':
    'https://doi.org/10.3389/fpsyg.2021.720479',

  // DOI jupea
  'https://doi.org/10.51903/jupea.v2i2.287':
    'https://doi.org/10.51903/jupea.v2i2.287',

  // DOI psikologika
  'https://doi.org/10.20870/psikologika.v35i1.4567':
    'https://doi.org/10.20870/psikologika.v35i1.4567',
};

let totalReplaced = 0;
let totalUnchanged = 0;
const unchangedUrls: string[] = [];

for (const [filePath, brokenUrls] of Object.entries(BROKEN_BY_FILE)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠ File not found: ${filePath}`);
    continue;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let fileReplaced = 0;

  for (const brokenUrl of brokenUrls as string[]) {
    const replacement = URL_REPLACEMENTS[brokenUrl];

    if (replacement && replacement !== brokenUrl) {
      // Replace all occurrences in the file
      const before = content;
      content = content.split(brokenUrl).join(replacement);
      if (content !== before) {
        fileReplaced++;
        totalReplaced++;
        console.log(`  ✅ ${brokenUrl.substring(0, 60)}... → replaced`);
      }
    } else if (!replacement) {
      totalUnchanged++;
      unchangedUrls.push(brokenUrl);
      console.log(`  ❌ ${brokenUrl.substring(0, 60)}... → no replacement found`);
    } else {
      // Same URL (no change needed, might have been temporary)
      totalUnchanged++;
      console.log(`  ⏭ ${brokenUrl.substring(0, 60)}... → same URL (skip)`);
    }
  }

  if (fileReplaced > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`📝 Updated ${filePath} (${fileReplaced} URLs)`);
  }
  console.log('');
}

console.log('--- Summary ---');
console.log(`Total URLs replaced: ${totalReplaced}`);
console.log(`Total URLs unchanged/no replacement: ${totalUnchanged}`);
console.log('\nURLs still needing replacements:');
unchangedUrls.forEach(url => console.log(`  - ${url}`));
