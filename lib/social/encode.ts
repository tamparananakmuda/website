/**
 * Obfuscate social content IDs in URLs.
 * Converts predictable IDs like "konten-tam-001" or DB numeric IDs
 * into 12-character random-looking strings like "WdM1kP2xQ8nT".
 *
 * Uses a multiplicative cipher (modular multiplication with a prime)
 * over 62^12 space. BigInt is used to handle the large numbers.
 */

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const BASE = BigInt(62);

// 62^12 ≈ 3.23 × 10^21 — gives 12-char base62 strings
// Manual power (BigInt ** needs ES2016 target which we don't have)
function bigIntPow(base: bigint, exp: number): bigint {
  let result = BigInt(1);
  for (let i = 0; i < exp; i++) {
    result = result * base;
  }
  return result;
}
const MODULUS = bigIntPow(BASE, 12);

// Large prime coprime to 62 (odd, not divisible by 31)
// Close to modulus to ensure output fills all 12 chars (no leading zeros)
const MULTIPLIER = BigInt('3141592653589793238467');

/**
 * Compute modular inverse via extended Euclidean algorithm (BigInt).
 * inverse * multiplier ≡ 1 (mod modulus)
 */
function modInverse(a: bigint, m: bigint): bigint {
  let [oldR, r] = [a, m];
  let [oldS, s] = [BigInt(1), BigInt(0)];
  while (r !== BigInt(0)) {
    const q = oldR / r;
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return ((oldS % m) + m) % m;
}

const INVERSE = modInverse(MULTIPLIER, MODULUS);

function toBase62(num: bigint): string {
  if (num === BigInt(0)) return '0';
  let result = '';
  let n = num;
  while (n > BigInt(0)) {
    result = BASE62_CHARS[Number(n % BASE)] + result;
    n = n / BASE;
  }
  return result;
}

function fromBase62(str: string): bigint {
  let result = BigInt(0);
  for (const char of str) {
    const idx = BASE62_CHARS.indexOf(char);
    if (idx === -1) return BigInt(-1);
    result = result * BASE + BigInt(idx);
  }
  return result;
}

/**
 * Pad base62 string to exactly 12 characters with leading '0's.
 */
function padTo12(str: string): string {
  return str.padStart(12, '0');
}

/**
 * Encode a social content ID into a 12-character obfuscated string.
 * Handles both "konten-tam-001" format and raw numeric DB IDs.
 *
 * Examples:
 *   konten-tam-001 → "0000WdM1kP2x"
 *   konten-tam-002 → "003Gi2vQ8nTb"
 */
export function encodeSocialId(id: string | number): string {
  const idStr = String(id);
  let num: bigint;

  // Slide format: konten-tam-001
  const slideMatch = idStr.match(/konten-tam-(\d+)/);
  if (slideMatch) {
    num = BigInt(slideMatch[1]);
  } else if (/^\d+$/.test(idStr)) {
    // Raw numeric (DB ID)
    num = BigInt(idStr);
  } else {
    // Non-numeric IDs (e.g. "slide") — return as-is
    return idStr;
  }

  const encoded = (num * MULTIPLIER) % MODULUS;
  return padTo12(toBase62(encoded));
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
  if (decoded < BigInt(0)) {
    return { slideId: null, dbId: null, raw: encoded };
  }

  // Reverse the multiplicative cipher
  const originalNum = (decoded * INVERSE) % MODULUS;
  const numStr = originalNum.toString();

  // Slide format: pad to 3 digits minimum
  const slideId = `konten-tam-${numStr.padStart(3, '0')}`;

  return { slideId, dbId: numStr, raw: encoded };
}
