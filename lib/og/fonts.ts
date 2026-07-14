let cachedFonts: {
  display: ArrayBuffer;
  body: ArrayBuffer;
  bodySemiBold: ArrayBuffer;
  mono: ArrayBuffer;
} | null = null;

async function fetchFontArrayBuffer(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch font: ${url} (${res.status})`);
  }
  return await res.arrayBuffer();
}

async function fetchGoogleFont(
  family: string,
  weight: number,
  display = 'swap'
): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=${display}`;

  const cssRes = await fetch(cssUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });

  if (!cssRes.ok) {
    throw new Error(`Failed to fetch Google Fonts CSS for ${family} ${weight}`);
  }

  const cssText = await cssRes.text();
  const urlMatch = cssText.match(/src:\s*url\(([^)]+)\)/);

  if (!urlMatch) {
    throw new Error(`No font URL found in CSS for ${family} ${weight}`);
  }

  const fontUrl = urlMatch[1].replace(/'/g, '');
  return await fetchFontArrayBuffer(fontUrl);
}

export async function getFonts() {
  if (cachedFonts) {
    return cachedFonts;
  }

  try {
    const [display, body, bodySemiBold, mono] = await Promise.all([
      fetchGoogleFont('Syne', 700),
      fetchGoogleFont('Plus+Jakarta+Sans', 400),
      fetchGoogleFont('Plus+Jakarta+Sans', 600),
      fetchGoogleFont('JetBrains+Mono', 400),
    ]);

    cachedFonts = { display, body, bodySemiBold, mono };
    return cachedFonts;
  } catch (error) {
    console.error('[og:fonts] Failed to load custom fonts:', error);
    throw error;
  }
}
