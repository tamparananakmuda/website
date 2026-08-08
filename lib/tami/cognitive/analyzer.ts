import { mistral } from '../mistral/client';
import { MindState, DiagnosisResult } from './types';

// Crisis keywords/patterns for quick regex detection (as a fail-safe layer before LLM)
const CRISIS_KEYWORDS = [
  'bunuh diri', 'akhiri hidup', 'pengen mati', 'suicide', 'self harm', 
  'potong nadi', 'gantung diri', 'lompat dari gedung'
];

export async function analyzeCognitiveState(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{
  mindState: MindState;
  diagnosis: DiagnosisResult;
}> {
  const queryLower = query.toLowerCase();
  const hasCrisisKeyword = CRISIS_KEYWORDS.some(keyword => queryLower.includes(keyword));

  if (hasCrisisKeyword) {
    return {
      mindState: {
        primaryEmotion: 'Despair',
        resilienceScore: 1,
        crisisDetected: true,
        coreDilemma: 'Severe mental crisis / self-harm risk detected.',
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
    ? history.map(h => `${h.role === 'user' ? 'User' : 'TAMI'}: ${h.content}`).join('\n')
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
    const response = await mistral.chat({
      messages: [
        { role: 'system', content: 'Anda wajib merespons dalam format JSON yang valid.' },
        { role: 'user', content: prompt }
      ],
      responseFormat: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);

    // Double check crisis detected from LLM output
    if (parsed.mindState?.crisisDetected) {
      parsed.mindState.crisisDetected = true;
    }

    return parsed;
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
