/**
 * Obfuscate social content IDs in URLs.
 * Converts predictable IDs like "konten-tam-001" or DB numeric IDs
 * into short random-looking strings like "WdM1" or "3Gi2".
 *
 * Uses a multiplicative cipher (modular multiplication with a prime)
 * instead of simple addition. This maps sequential inputs (1, 2, 3...)
 * to seemingly unrelated outputs, so consecutive IDs produce
 * completely different-looking URLs.
 */

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

// 62^4 = 14,776,336 — gives 3-4 char base62 strings, handles IDs up to ~14.7M
// Must stay below 2^26 so multiply doesn't exceed JS safe integer (2^53)
const MODULUS = 14776336;

// Prime multiplier coprime to MODULUS (not divisible by 2 or 31, the factors of 62)
const MULTIPLIER = 999983;

/**
 * Compute modular inverse via extended Euclidean algorithm.
 * inverse * multiplier ≡ 1 (mod modulus)
 */
function modInverse(a: number, m: number): number {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return ((oldS % m) + m) % m;
}

const INVERSE = modInverse(MULTIPLIER, MODULUS);

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
 *
 * Examples:
 *   konten-tam-001 → "WdM1"
 *   konten-tam-002 → "3Gi2"
 *   konten-tam-003 → "Zu43"
 */
export function encodeSocialId(id: string | number): string {
  const idStr = String(id);

  // Slide format: konten-tam-001
  const slideMatch = idStr.match(/konten-tam-(\d+)/);
  if (slideMatch) {
    const num = parseInt(slideMatch[1], 10);
    return toBase62((num * MULTIPLIER) % MODULUS);
  }

  // Raw numeric (DB ID)
  if (/^\d+$/.test(idStr)) {
    const num = parseInt(idStr, 10);
    if (num < MODULUS) {
      return toBase62((num * MULTIPLIER) % MODULUS);
    }
    // Very large IDs — encode raw (no cipher, still base62)
    return toBase62(num);
  }

  // Non-numeric IDs (e.g. "slide") — return as-is
  return idStr;
}

/**
 * Decode an obfuscated string back to possible original IDs.
 * Returns both slide format and raw numeric format for the route to try.
 */
export function decodeSocialId(encoded: string): { slideId: string | null; dbId: string | null; raw: string } {
  // Non-base62 strings (like "slide" or "konten-tam-001") — return as raw
  if (!/^[0-9A-Za-z]+$/.test(encoded)) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  const decoded = fromBase62(encoded);
  if (decoded < 0) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  // Reverse the multiplicative cipher
  const originalNum = (decoded * INVERSE) % MODULUS;

  const numStr = originalNum.toString();

  // Slide format: pad to 3 digits minimum
  const slideId = `konten-tam-${numStr.padStart(3, '0')}`;

  return { slideId, dbId: numStr, raw: encoded };
}
