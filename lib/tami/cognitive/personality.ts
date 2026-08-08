/**
 * TAMI Personality Variants
 * 
 * A/B test tone variants based on severity level and session hash.
 * Variant A: Direct & firm ("tamparan" style - default)
 * Variant B: Empathetic & warm (softer approach)
 * 
 * Selection logic:
 * - Crisis/severe: always Variant B (empathetic)
 * - Medium: 50/50 split based on session hash
 * - Light: always Variant A (direct)
 */

export type PersonalityVariant = 'A' | 'B';

interface PersonalityConfig {
  variant: PersonalityVariant;
  systemPromptSuffix: string;
  toneInstruction: string;
}

const VARIANT_A: PersonalityConfig = {
  variant: 'A',
  systemPromptSuffix: '',
  toneInstruction: 'Gaya komunikasi: langsung, tegas, tidak berbelit-belit. Beri "tamparan realita" yang membuat user sadar. Seperti teman yang jujur saat semua orang lain hanya menyanjang.',
};

const VARIANT_B: PersonalityConfig = {
  variant: 'B',
  systemPromptSuffix: '',
  toneInstruction: 'Gaya komunikasi: hangat, empatik, tapi tetap jujur. Seperti kakak yang peduli dan memahami, tidak menghakimi, tapi juga tidak memanjakan. Validasi perasaan user dulu, lalu bantu melihat realita.',
};

/**
 * Determine personality variant for a session.
 * Crisis always gets B (empathetic). Light always gets A (direct).
 * Medium is 50/50 based on session hash.
 */
export function getPersonalityVariant(
  severityLevel: 'ringan' | 'sedang' | 'berat',
  sessionId: string,
): PersonalityConfig {
  // Crisis/severe: always empathetic
  if (severityLevel === 'berat') {
    return VARIANT_B;
  }

  // Light: always direct
  if (severityLevel === 'ringan') {
    return VARIANT_A;
  }

  // Medium: 50/50 split based on session hash
  const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0 ? VARIANT_A : VARIANT_B;
}

// A/B test tracking (in-memory, resets on cold start)
const variantStats = new Map<string, { count: number; followUps: number }>();

/**
 * Get variant for A/B testing logging.
 */
export function logVariantAssignment(variant: PersonalityVariant, sessionId: string, severity: string): void {
  console.log(`[TAMI PERSONALITY] Variant ${variant} | severity=${severity} | session=${sessionId.slice(0, 20)}`);
  const key = `variant-${variant}`;
  const existing = variantStats.get(key) || { count: 0, followUps: 0 };
  variantStats.set(key, { ...existing, count: existing.count + 1 });
}

/**
 * Record follow-up message (user sends another message after receiving response).
 * Used to measure engagement per variant.
 */
export function recordFollowUp(variant: PersonalityVariant): void {
  const key = `variant-${variant}`;
  const existing = variantStats.get(key) || { count: 0, followUps: 0 };
  variantStats.set(key, { ...existing, followUps: existing.followUps + 1 });
}

/**
 * Get A/B test stats for analytics dashboard.
 */
export function getVariantStats(): Array<{ variant: string; count: number; followUps: number; engagementRate: number }> {
  return Array.from(variantStats.entries()).map(([key, stats]) => ({
    variant: key,
    count: stats.count,
    followUps: stats.followUps,
    engagementRate: stats.count > 0 ? stats.followUps / stats.count : 0,
  }));
}
