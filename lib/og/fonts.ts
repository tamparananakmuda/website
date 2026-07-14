import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

let cachedFonts: {
  display: ArrayBuffer;
  body: ArrayBuffer;
  bodySemiBold: ArrayBuffer;
  mono: ArrayBuffer;
} | null = null;

async function loadLocalFont(filename: string): Promise<ArrayBuffer> {
  const path = join(process.cwd(), 'public', 'fonts', filename);
  const buffer = await readFile(path);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
}

export async function getFonts() {
  if (cachedFonts) {
    return cachedFonts;
  }

  try {
    const [display, body, bodySemiBold, mono] = await Promise.all([
      loadLocalFont('syne-bold.ttf'),
      loadLocalFont('jakarta-regular.ttf'),
      loadLocalFont('jakarta-semibold.ttf'),
      loadLocalFont('jetbrains-mono-regular.ttf'),
    ]);

    cachedFonts = { display, body, bodySemiBold, mono };
    return cachedFonts;
  } catch (error) {
    console.error('[og:fonts] Failed to load local fonts:', error);
    throw error;
  }
}
