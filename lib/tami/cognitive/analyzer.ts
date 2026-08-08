import { mistral } from '../mistral/client';
import { MindState, DiagnosisResult } from './types';
import { cognitiveAnalysisSchema } from '../validation/schemas';
import { parseAndValidate } from '../validation/parse';

// Crisis keywords/patterns for quick regex detection (as a fail-safe layer before LLM)
const CRISIS_KEYWORDS = [
  // Direct
  'bunuh diri', 'akhiri hidup', 'pengen mati', 'suicide', 'self harm',
  'potong nadi', 'gantung diri', 'lompat dari gedung',
  // Indonesian euphemisms & slang
  'capek hidup', 'capai hidup', 'lelah hidup', 'lelah sama hidup',
  'nggak kuat lagi', 'nggak sanggup lagi', 'ga kuat lagi', 'gak kuat',
  'nyawa udah habis', 'udah cukup', 'udah nyerah', 'mau pergi',
  'pengen hilang', 'pengen nyembunyi', 'pengen lenyap',
  'ngilang dari dunia', 'pergi selamanya', 'tidak mau ada',
  'mau end', 'udah mau end', 'fix mau end', 'pengen end',
  'nabrak', 'tabrakan', 'lompat', 'junub',
  'tidak berguna', 'nggak berguna', 'ga berguna', 'beban keluarga',
  'beban orang', 'sampah masyarakat', 'layak mati',
  'tidak ada gunanya', 'nggak ada gunanya', 'ga ada gunanya hidup',
  // English
  'end it all', 'give up on life', 'tired of living', 'want to disappear',
  'no reason to live', 'better off dead',
  // Additional patterns - self-harm methods
  'minum racun', 'minum obat banyak', 'overdosis', 'overdose',
  'nabrak mobil', 'nabrak motor', 'lompat jembatan', 'lompat genteng',
  'nyilet', 'melukai diri', 'menyakiti diri', 'melukai diri sendiri',
  // Hopelessness indicators
  'tidak ada harapan', 'nggak ada harapan', 'ga ada harapan',
  'putus asa', 'udah habis', 'tidak ada jalan keluar', 'nggak ada jalan keluar',
  'mau bunuh', 'rencana mati', 'sudah persiapan', 'menulis surat perpisahan',
];

/**
 * Determine crisis escalation level based on keyword severity.
 * - 'immediate': direct self-harm intent or method mentioned
 * - 'warning': hopelessness/passive ideation
 * - 'monitor': euphemisms that warrant attention
 */
export function getCrisisEscalationLevel(query: string): 'immediate' | 'warning' | 'monitor' | 'none' {
  const q = query.toLowerCase();
  
  const immediatePatterns = [
    'bunuh diri', 'akhiri hidup', 'suicide', 'self harm', 'potong nadi',
    'gantung diri', 'lompat dari', 'minum racun', 'overdosis', 'overdose',
    'nyilet', 'melukai diri', 'menyakiti diri', 'mau bunuh', 'rencana mati',
    'menulis surat perpisahan', 'sudah persiapan',
  ];
  
  const warningPatterns = [
    'pengen mati', 'pengen hilang', 'pengen lenyap', 'mau end', 'pengen end',
    'pergi selamanya', 'ngilang dari dunia', 'layak mati', 'putus asa',
    'tidak ada harapan', 'tidak ada jalan keluar', 'udah cukup', 'udah nyerah',
    'tired of living', 'no reason to live', 'better off dead', 'end it all',
  ];
  
  if (immediatePatterns.some(p => q.includes(p))) return 'immediate';
  if (warningPatterns.some(p => q.includes(p))) return 'warning';
  if (CRISIS_KEYWORDS.some(p => q.includes(p))) return 'monitor';
  return 'none';
}

export async function analyzeCognitiveState(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  model?: string
): Promise<{
  mindState: MindState;
  diagnosis: DiagnosisResult;
}> {
  const queryLower = query.toLowerCase();
  const hasCrisisKeyword = CRISIS_KEYWORDS.some(keyword => queryLower.includes(keyword));

  if (hasCrisisKeyword) {
    return {
      mindState: {
        primaryEmotion: 'Putus Asa',
        resilienceScore: 1,
        crisisDetected: true,
        coreDilemma: 'Krisis mental berat / indikasi menyakiti diri terdeteksi dari input pengguna.',
      },
      diagnosis: {
        metrics: {
          financialStress: 'not_applicable',
          careerBurnout: 'not_applicable',
          socialPressure: 'not_applicable',
          futureAnxiety: 'high',
        },
        rootCauseAnalysis: 'Sinyal krisis emosional / keselamatan diri terdeteksi dari input pengguna.',
        cognitiveDistortion: 'Catastrophizing',
        cognitiveDistortionDescription: 'Pikiran terfokus penuh pada keputusasaan ekstrim.',
        cognitiveDistortionReframing: 'Carilah bantuan profesional segera, keselamatan Anda adalah yang terpenting.',
        realityCheckVerdict: 'Utamakan keselamatan diri dan carilah pertolongan segera.',
      }
    };
  }

  const historyText = history.length > 0
    ? history.map(h => `${h.role === 'user' ? 'User' : 'TAMI'}: ${h.content.slice(0, 1000)}`).join('\n').slice(0, 8000)
    : 'Tidak ada riwayat percakapan sebelumnya.';

  const prompt = `Anda adalah TAMI (Tamparan Anak Muda Intelligence) Cognitive Diagnosis Engine.
Tugas Anda adalah menganalisis curhatan, keluhan, atau pertanyaan anak muda Indonesia secara mendalam, realistis, dan tajam (tanpa sensor manis, berikan tamparan realita yang jujur).

Riwayat Percakapan Sebelumnya:
${historyText}

Pesan Terakhir Pengguna: "${query}"

Analisislah input di atas secara kontekstual dengan mempertimbangkan perkembangan percakapan dari riwayat sebelumnya. Hasilkan output dalam format JSON dengan struktur berikut:
{
  "mindState": {
    "primaryEmotion": "Emosi dominan saat ini (misal: Cemas, Frustrasi, FOMO, dll)",
    "resilienceScore": Skor ketahanan mental saat ini menghadapi masalah dari 1-10 (angka),
    "crisisDetected": boolean (true jika ada indikasi menyakiti diri/bunuh diri secara tersirat),
    "coreDilemma": "Dilema inti atau akar masalah utama pengguna saat ini"
  },
  "diagnosis": {
    "metrics": {
      "financialStress": "low" | "medium" | "high" | "not_applicable",
      "careerBurnout": "low" | "medium" | "high" | "not_applicable",
      "socialPressure": "low" | "medium" | "high" | "not_applicable",
      "futureAnxiety": "low" | "medium" | "high" | "not_applicable"
    },
    "rootCauseAnalysis": "Analisis psikologis dan realitas hidup yang mendalam tentang apa yang sebenarnya terjadi padanya saat ini",
    "cognitiveDistortion": "Sebutkan salah satu dari kategori bias kognitif berikut: 'All-or-Nothing Thinking' | 'Catastrophizing' | 'FOMO-Driven Decision' | 'Emotional Reasoning' | 'Sandwich Generation Strain' | 'Overgeneralization' | 'Should Statements' | 'Tidak Ada'",
    "cognitiveDistortionDescription": "Penjelasan singkat (1-2 kalimat) mengapa pola pikir ini keliru dan bagaimana hal itu merugikan dirinya",
    "cognitiveDistortionReframing": "Sudut pandang alternatif yang seimbang, realistis, dan berorientasi solusi (1-2 kalimat)",
    "realityCheckVerdict": "Tamparan keras realistis dalam 1-2 kalimat tajam yang membukakan matanya terhadap kenyataan hidup"
  }
}`;

  try {
    const buildMessages = (errorFeedback?: string) => [
      { role: 'system' as const, content: 'Anda wajib merespons dalam format JSON yang valid.' },
      { role: 'user' as const, content: errorFeedback ? `${prompt}\n\n${errorFeedback}` : prompt },
    ];

    let response = await mistral.chat({
      model,
      temperature: 0.3,
      messages: buildMessages(),
      responseFormat: { type: 'json_object' },
      promptCacheKey: 'tami-cognitive',
      maxTokens: 1000
    });

    let content = response.choices[0].message.content;
    let result = parseAndValidate(content, cognitiveAnalysisSchema);

    // Retry once with error feedback if validation fails
    if (!result.success) {
      const feedback = `Output JSON sebelumnya tidak valid. Error: ${result.error}. Perbaiki dan hasilkan JSON yang valid sesuai schema yang diminta.`;
      response = await mistral.chat({
        model,
        temperature: 0.2,
        messages: buildMessages(feedback),
        responseFormat: { type: 'json_object' },
        promptCacheKey: 'tami-cognitive',
        maxTokens: 1000
      });
      content = response.choices[0].message.content;
      result = parseAndValidate(content, cognitiveAnalysisSchema);
    }

    if (result.success) {
      return result.data;
    }

    throw new Error(`Cognitive analysis validation failed after retry: ${result.error}`);
  } catch (error) {
    console.error('Failed to perform cognitive diagnosis:', error);
    // Fallback safe diagnosis in case of API failure
    return {
      mindState: {
        primaryEmotion: 'Cemas',
        resilienceScore: 5,
        crisisDetected: false,
        coreDilemma: 'Gagal mendiagnosis akar masalah karena masalah koneksi.',
      },
      diagnosis: {
        metrics: {
          financialStress: 'medium',
          careerBurnout: 'medium',
          socialPressure: 'medium',
          futureAnxiety: 'medium',
        },
        rootCauseAnalysis: 'Analisis terganggu akibat kegagalan sistem diagnosis.',
        cognitiveDistortion: 'Tidak Ada',
        cognitiveDistortionDescription: 'Tidak ada bias terdeteksi karena gangguan sistem.',
        cognitiveDistortionReframing: 'Kembali fokus pada kenyataan dan coba bersihkan pikiran.',
        realityCheckVerdict: 'Koneksi TAMI sedang mengalami gangguan. Coba lagi nanti.',
      }
    };
  }
}
