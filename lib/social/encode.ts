/**
 * Obfuscate social content IDs in URLs.
 * Converts predictable IDs like "konten-tam-001" or DB numeric IDs
 * into short random-looking strings like "Kx7mP2".
 */

// Salt offset so small numbers (1, 2, 3...) produce larger, less guessable values
const SALT = 482910;

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num: number): string {
  if (num === 0) return '0';
  let result = '';
  let n = num;
  while (n > 0) {
    result = BASE62_CHARS[n % 62] + result;
    n = Math.floor(n / 62);
  }
  return result;
}

function fromBase62(str: string): number {
  let result = 0;
  for (const char of str) {
    const idx = BASE62_CHARS.indexOf(char);
    if (idx === -1) return -1;
    result = result * 62 + idx;
  }
  return result;
}

/**
 * Encode a social content ID into a short obfuscated string.
 * Handles both "konten-tam-001" format and raw numeric DB IDs.
 */
export function encodeSocialId(id: string | number): string {
  const idStr = String(id);

  // Slide format: konten-tam-001
  const slideMatch = idStr.match(/konten-tam-(\d+)/);
  if (slideMatch) {
    const num = parseInt(slideMatch[1], 10);
    return toBase62(num + SALT);
  }

  // Raw numeric (DB ID)
  if (/^\d+$/.test(idStr)) {
    const num = parseInt(idStr, 10);
    return toBase62(num + SALT);
  }

  // Non-numeric IDs (e.g. "slide") — return as-is
  return idStr;
}

/**
 * Decode an obfuscated string back to possible original IDs.
 * Returns both slide format and raw numeric format for the route to try.
 */
export function decodeSocialId(encoded: string): { slideId: string | null; dbId: string | null; raw: string } {
  // Non-base62 strings (like "slide") — return as raw
  if (!/^[0-9A-Za-z]+$/.test(encoded)) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  const decoded = fromBase62(encoded);
  if (decoded < 0) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  const originalNum = decoded - SALT;
  if (originalNum < 0) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  const numStr = originalNum.toString();

  // Slide format: pad to 3 digits minimum
  const slideId = `konten-tam-${numStr.padStart(3, '0')}`;

  return { slideId, dbId: numStr, raw: encoded };
}
