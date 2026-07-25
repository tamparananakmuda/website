import { readFileSync } from 'fs';

const dir = '/tmp/tam-seri-drafts/';
const checked = new Set<string>();
const results: {url: string, status: string, part: number}[] = [];

for (let i = 1; i <= 12; i++) {
  const data = JSON.parse(readFileSync(dir + 'part-' + String(i).padStart(2, '0') + '.json', 'utf-8'));
  const refs = data.source_references || [];
  for (const ref of refs) {
    if (ref.url && !checked.has(ref.url)) {
      checked.add(ref.url);
      results.push({ url: ref.url, status: 'PENDING', part: i });
    }
  }
}

console.log(`Total unique URLs to check: ${results.length}\n`);

// Check each URL using fetch
async function checkUrls() {
  for (const r of results) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(r.url, { 
        signal: controller.signal,
        redirect: 'follow',
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      clearTimeout(timeout);
      r.status = res.status.toString();
      const status = res.status >= 200 && res.status < 400 ? 'OK' : 'DEAD';
      console.log(`Part ${r.part}: ${status} (${res.status}) ${r.url.substring(0, 80)}`);
    } catch (e: any) {
      r.status = e.name === 'AbortError' ? 'TIMEOUT' : 'ERROR';
      console.log(`Part ${r.part}: ${r.status} ${r.url.substring(0, 80)}`);
    }
  }
  
  const dead = results.filter(r => r.status !== 'OK' && !r.status.startsWith('2') && !r.status.startsWith('3'));
  console.log(`\n=== DEAD LINK CHECK COMPLETE ===`);
  console.log(`Total checked: ${results.length}`);
  console.log(`Dead/Timeout: ${dead.length}`);
  if (dead.length > 0) {
    dead.forEach(r => console.log(`  ${r.status}: ${r.url}`));
  } else {
    console.log('All links accessible.');
  }
}

checkUrls();
