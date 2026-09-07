import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARTICLES_DIR = join(__dirname, '..', 'content', 'articles');

interface UrlResult {
  file: string;
  url: string;
  status: number | string;
  ok: boolean;
  redirected: boolean;
  finalUrl?: string;
  error?: string;
}

async function checkUrl(url: string, timeoutMs = 10000): Promise<UrlResult> {
  const result: UrlResult = {
    file: '',
    url,
    status: 0,
    ok: false,
    redirected: false,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    clearTimeout(timeout);
    
    result.status = res.status;
    result.ok = res.ok;
    result.redirected = res.redirected;
    result.finalUrl = res.url;
    
    // Some sites block HEAD, try GET if HEAD fails
    if (res.status === 403 || res.status === 405) {
      const controller2 = new AbortController();
      const timeout2 = setTimeout(() => controller2.abort(), timeoutMs);
      
      const res2 = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller2.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });
      
      clearTimeout(timeout2);
      
      result.status = res2.status;
      result.ok = res2.ok;
      result.redirected = res2.redirected;
      result.finalUrl = res2.url;
    }
  } catch (err: any) {
    result.status = err.name === 'AbortError' ? 'TIMEOUT' : 'ERROR';
    result.ok = false;
    result.error = err.message;
  }

  return result;
}

function extractUrlsFromArticle(filePath: string): { url: string; line: number }[] {
  const content = readFileSync(filePath, 'utf-8');
  const urls: { url: string; line: number }[] = [];
  const lines = content.split('\n');
  
  // Match URLs in frontmatter (url: "...") and inline markdown links
  const urlPattern = /https?:\/\/[^\s"')\]]+/g;
  
  lines.forEach((line, idx) => {
    const matches = line.matchAll(urlPattern);
    for (const match of matches) {
      const url = match[0].replace(/["']+$/, ''); // strip trailing quotes
      // Skip our own domain and CDN
      if (url.includes('tamparananakmuda.com') || url.includes('cdn.tamparan')) continue;
      urls.push({ url, line: idx + 1 });
    }
  });
  
  return urls;
}

async function main() {
  console.log('Extracting URLs from all articles...\n');
  
  // Recursively find all .md files
  const { execSync } = await import('child_process');
  const files = execSync('find content/articles -name "*.md"', { cwd: join(__dirname, '..'), encoding: 'utf-8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  
  const allUrls: { file: string; url: string; line: number }[] = [];
  
  for (const file of files) {
    const fullPath = join(__dirname, '..', file);
    const urls = extractUrlsFromArticle(fullPath);
    for (const u of urls) {
      allUrls.push({ file, ...u });
    }
  }
  
  // Deduplicate URLs but keep track of all files
  const uniqueUrls = [...new Set(allUrls.map(u => u.url))];
  
  console.log(`Found ${allUrls.length} URL references (${uniqueUrls.length} unique) across ${files.length} articles`);
  console.log(`Checking ${uniqueUrls.length} unique URLs...\n`);
  
  const results: UrlResult[] = [];
  const batchSize = 20;
  
  for (let i = 0; i < uniqueUrls.length; i += batchSize) {
    const batch = uniqueUrls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(url => checkUrl(url)));
    
    for (const res of batchResults) {
      const fileRefs = allUrls.filter(u => u.url === res.url);
      for (const ref of fileRefs) {
        results.push({ ...res, file: ref.file });
      }
    }
    
    const done = Math.min(i + batchSize, uniqueUrls.length);
    const okCount = results.filter(r => r.ok).length;
    const failCount = results.filter(r => !r.ok).length;
    process.stdout.write(`\rProgress: ${done}/${uniqueUrls.length} | OK: ${okCount} | FAIL: ${failCount}`);
  }
  
  console.log('\n');
  
  // Report broken URLs
  const broken = results.filter(r => !r.ok);
  const redirected = results.filter(r => r.redirected && r.ok);
  
  if (broken.length > 0) {
    console.log(`\n=== BROKEN URLs (${broken.length}) ===\n`);
    for (const r of broken) {
      console.log(`[${r.status}] ${r.url}`);
      console.log(`  File: ${r.file}`);
      if (r.error) console.log(`  Error: ${r.error}`);
      if (r.finalUrl && r.finalUrl !== r.url) console.log(`  Final: ${r.finalUrl}`);
      console.log();
    }
  }
  
  if (redirected.length > 0) {
    console.log(`\n=== REDIRECTED URLs (${redirected.length}) ===\n`);
    for (const r of redirected) {
      if (r.finalUrl && r.finalUrl !== r.url) {
        console.log(`[301/302] ${r.url}`);
        console.log(`  -> ${r.finalUrl}`);
        console.log(`  File: ${r.file}`);
        console.log();
      }
    }
  }
  
  // Write full report to file
  const reportPath = join(__dirname, 'url-check-report.json');
  writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\nFull report saved to: ${reportPath}`);
  
  // Summary
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total URL references: ${results.length}`);
  console.log(`Unique URLs checked: ${uniqueUrls.length}`);
  console.log(`OK: ${results.filter(r => r.ok && !r.redirected).length}`);
  console.log(`Redirected (OK): ${redirected.length}`);
  console.log(`Broken: ${broken.length}`);
}

main().catch(console.error);
