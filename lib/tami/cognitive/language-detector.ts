/**
 * Multi-language Support
 * 
 * - Auto-detect language (Indonesian, English, or mixed) from user input
 * - English crisis keywords and international resources
 * - Code-mixing normalization for better RAG matching
 * - Language-aware response routing
 */

type DetectedLanguage = 'id' | 'en' | 'mixed';

const ENGLISH_MARKERS = [
  'the', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would',
  'can', 'could', 'should', 'may', 'might', 'must', 'shall', 'do', 'does',
  'did', 'what', 'why', 'how', 'when', 'where', 'who', 'which', 'that',
  'this', 'these', 'those', 'my', 'your', 'his', 'her', 'our', 'their',
  'i am', 'i feel', 'i think', 'i want', 'i need', 'help me', 'feel lost',
  'anxious', 'depressed', 'stressed', 'burnout', 'career', 'money',
  'financial', 'future', 'worried', 'afraid', 'scared', 'alone',
  'overwhelmed', 'exhausted', 'stuck', 'lost', 'confused',
];

const INDONESIAN_MARKERS = [
  'yang', 'dan', 'di', 'ke', 'dari', 'untuk', 'dengan', 'saya', 'aku',
  'kamu', 'dia', 'kita', 'kami', 'mereka', 'ini', 'itu', 'ada', 'tidak',
  'bukan', 'sudah', 'belum', 'lagi', 'akan', 'bisa', 'harus', 'mau',
  'pengen', 'mau', 'rasa', 'merasa', 'pikir', 'pikiran', 'masalah',
  'kerja', 'uang', 'karir', 'masa depan', 'takut', 'cemas', 'stres',
  'capek', 'lelah', 'burnout', 'bingung', 'hilang', 'sendiri',
];

/**
 * Detect language from user input with mixed-language support.
 */
export function detectLanguage(query: string): 'id' | 'en' {
  const result = detectLanguageDetailed(query);
  return result.language === 'mixed' ? 'id' : result.language;
}

/**
 * Detailed language detection with mixed-language and confidence.
 */
export function detectLanguageDetailed(query: string): {
  language: DetectedLanguage;
  confidence: number;
  englishRatio: number;
} {
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/).filter((w) => w.length >= 2);

  let enScore = 0;
  let idScore = 0;

  for (const marker of ENGLISH_MARKERS) {
    if (lower.includes(marker)) enScore++;
  }

  for (const marker of INDONESIAN_MARKERS) {
    if (lower.includes(marker)) idScore++;
  }

  const total = enScore + idScore;
  if (total === 0) {
    return { language: 'id', confidence: 0.5, englishRatio: 0 };
  }

  const englishRatio = enScore / total;
  const idRatio = idScore / total;

  if (englishRatio > 0.7) {
    return { language: 'en', confidence: englishRatio, englishRatio };
  } else if (idRatio > 0.7) {
    return { language: 'id', confidence: idRatio, englishRatio };
  } else if (enScore >= 2 && idScore >= 2) {
    return { language: 'mixed', confidence: 0.6, englishRatio };
  }

  return {
    language: idRatio >= englishRatio ? 'id' : 'en',
    confidence: Math.max(idRatio, englishRatio),
    englishRatio,
  };
}

/**
 * Get language instruction for synthesis prompt.
 */
export function getLanguageInstruction(lang: 'id' | 'en'): string {
  if (lang === 'en') {
    return '\n\n[CATATAN INTERNAL: User bertanya dalam bahasa Inggris. Respons dalam bahasa Inggris yang natural dan conversational, bukan formal. Tetap pertahankan karakter TAMI yang tajam dan jujur.]';
  }
  return '';
}

// ─── English Crisis Resources ─────────────────────────────

export const ENGLISH_CRISIS_RESOURCES = `
**If you're in crisis, please reach out now:**
- **988** - Suicide & Crisis Lifeline (US) - Call or text 988
- **116 123** - Samaritans (UK & Ireland)
- **13 11 14** - Lifeline Australia
- **findahelpline.com** - International crisis helpline directory

You don't have to face this alone. There are people ready to listen and help you through this.`;

const ENGLISH_CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'self harm', 'cut myself', 'hurt myself', 'no reason to live',
  'tired of living', 'give up on life', "end it all", "can't go on",
  'no point in living', 'want to disappear', 'nobody would miss me',
];

/**
 * Check if query contains English crisis indicators.
 */
export function hasEnglishCrisisIndicators(query: string): boolean {
  const q = query.toLowerCase();
  return ENGLISH_CRISIS_KEYWORDS.some(kw => q.includes(kw));
}

// ─── Code-mixing Normalization ────────────────────────────

const CODE_MIX_MAP: Record<string, string> = {
  'anxiety': 'cemas',
  'depressed': 'depresi',
  'depression': 'depresi',
  'give up': 'menyerah',
  'confused': 'bingung',
  'hopeless': 'putus asa',
  'worthless': 'tidak berharga',
  'lonely': 'kesepian',
  'exhausted': 'kelelahan',
  'mental health': 'kesehatan mental',
};

/**
 * Normalize code-mixed input for better RAG matching.
 * Only translates terms that would be ambiguous for Indonesian-focused RAG.
 */
export function normalizeCodeMixing(input: string): string {
  let result = input;
  for (const [en, id] of Object.entries(CODE_MIX_MAP)) {
    if (id !== en) {
      const regex = new RegExp(`\\b${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      result = result.replace(regex, id);
    }
  }
  return result;
}

/**
 * Get crisis resources based on detected language.
 */
export function getCrisisResources(language: DetectedLanguage): string {
  if (language === 'en') {
    return ENGLISH_CRISIS_RESOURCES;
  }
  return `Keselamatan dan kesehatan mental Anda adalah prioritas paling utama. Mohon jangan hadapi ini sendirian. Anda dapat menghubungi layanan konseling darurat gratis di Indonesia melalui **Healing119.id** atau hubungi telepon **119 ext 8**.`;
}
