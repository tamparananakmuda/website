const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '86b2b8654f7be77ff574a962956053b1';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

interface IndexNowResult {
  success: boolean;
  status: number;
  urlCount: number;
  error?: string;
}

export async function pingIndexNow(urls: string[]): Promise<IndexNowResult> {
  if (process.env.VERCEL_ENV !== 'production') {
    return { success: true, status: 200, urlCount: 0 };
  }

  if (urls.length === 0) {
    return { success: true, status: 200, urlCount: 0 };
  }

  const host = SITE_URL.replace('https://', '').replace('http://', '');
  const keyLocation = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation,
        urlList: urls,
      }),
    });

    const accepted = response.status === 200 || response.status === 202;

    if (!accepted) {
      const text = await response.text();
      console.warn('[IndexNow] Ping returned', response.status, text);
    }

    return {
      success: accepted,
      status: response.status,
      urlCount: urls.length,
    };
  } catch (error) {
    console.error('[IndexNow] Ping failed:', error);
    return {
      success: false,
      status: 0,
      urlCount: urls.length,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function pingSitemapToGoogle(): Promise<boolean> {
  if (process.env.VERCEL_ENV !== 'production') {
    return true;
  }

  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

  try {
    const response = await fetch(pingUrl, { method: 'GET' });
    console.log('[Google Sitemap Ping] Status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('[Google Sitemap Ping] Failed:', error);
    return false;
  }
}
