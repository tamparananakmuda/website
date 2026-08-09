import { analyzeCognitiveState, getCrisisEscalationLevel } from '../cognitive/analyzer';
import { knowledgeGraph } from '../rag/knowledge-graph';
import { mistral, chatWithFallback } from '../mistral/client';
import { TamiCognitiveResponse, ActionStep, CitationRef } from '../cognitive/types';
import { validateTamiFacts } from '../guardrails/fact-guardrail';
import { actionPlanResponseSchema, verifierOutputSchema } from '../validation/schemas';
import { parseAndValidate } from '../validation/parse';
import { traceAgentWithFallback, traceAgent, getTraceSummary, clearTraces } from '../observability/tracer';
import { tamiResponseCache, normalizeQuery } from '../cache/response-cache';
import { checkSemanticDup } from '../cache/semantic-dedup';
import { getPersonalityVariant, logVariantAssignment } from '../cognitive/personality';
import { detectLanguage, getLanguageInstruction, normalizeCodeMixing, hasEnglishCrisisIndicators, getCrisisResources, detectLanguageDetailed } from '../cognitive/language-detector';
import { sendCrisisNotification } from '../observability/crisis-webhook';
import { addMessage, compressHistory as compressSessionHistory, trackTopic } from '../cognitive/conversation-memory';
import { trackTopicMention, recordSentiment } from '../observability/conversation-analytics';
import { logCrisisEvent } from '../guardrails/safety';
import { isMistralAvailable, recordMistralSuccess, recordMistralFailure, generateFallbackResponse } from '../observability/health';
import { checkDomain } from '../guardrails/domain-filter';

/**
 * Sanitize user input sebelum di-interpolate ke LLM prompt.
 * Mencegah prompt injection dengan meng-escape karakter yang bisa
 * membreak batas string prompt (quotes, backticks, template literals).
 */
function sanitizeForPrompt(input: string): string {
  return input
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$')
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 2000);
}

/**
 * Sanitize history items sebelum di-interpolate ke LLM prompt string.
 * Digunakan saat history dimasukkan ke dalam template literal prompt.
 */
function sanitizeHistory(history: { role: 'user' | 'assistant'; content: string }[]): { role: 'user' | 'assistant'; content: string }[] {
  return history.slice(-10).map(h => ({
    role: h.role,
    content: sanitizeForPrompt(h.content),
  }));
}

/**
 * Truncate history untuk dikirim sebagai API message objects.
 * Tidak perlu escaping karena API message structure sudah aman dari injection.
 * Escaping justru bikin LLM melihat karakter escape yang tidak natural.
 */
function truncateHistory(history: { role: 'user' | 'assistant'; content: string }[]): { role: 'user' | 'assistant'; content: string }[] {
  return history.slice(-10).map(h => ({
    role: h.role,
    content: h.content.slice(0, 5000),
  }));
}

/**
 * Smart history compression: jika history > 10 pesan, summarize pesan lama
 * jadi 1 paragraf context, lalu gabung dengan 6 pesan terakhir verbatim.
 * Falls back to truncateHistory jika summarization gagal.
 */
async function compressHistory(history: { role: 'user' | 'assistant'; content: string }[]): Promise<{ role: 'user' | 'assistant'; content: string }[]> {
  if (history.length <= 10) {
    return truncateHistory(history);
  }

  try {
    const olderMessages = history.slice(0, -6);
    const recentMessages = history.slice(-6);

    const conversationText = olderMessages
      .map(h => `${h.role === 'user' ? 'User' : 'TAMI'}: ${h.content.slice(0, 800)}`)
      .join('\n');

    const response = await mistral.chat({
      model: 'mistral-small-latest',
      temperature: 0.1,
      messages: [
        { role: 'system', content: 'Anda adalah sistem kompresi konteks percakapan. Ringkas percakapan berikut menjadi 1 paragraf singkat (maks 200 kata) yang menangkap inti masalah, emosi, dan rencana aksi yang sudah dibahas. Output HANYA ringkasan, tidak ada pembukaan.' },
        { role: 'user', content: conversationText },
      ],
      maxTokens: 200,
      promptCacheKey: 'tami-history-summary',
      timeoutMs: 5000,
    });

    const summary = response.choices[0].message.content.trim();

    return [
      { role: 'assistant' as const, content: `[Ringkasan percakapan sebelumnya] ${summary}` },
      ...recentMessages.map(h => ({ role: h.role, content: h.content.slice(0, 5000) })),
    ];
  } catch (error) {
    console.warn('[TAMI] History summarization failed, falling back to truncate:', error);
    return truncateHistory(history);
  }
}

/**
 * Validasi action plan items dari LLM output.
 */
function validateActionPlan(plan: any[]): ActionStep[] {
  const validTimeframes = ['1x24_hours', '30_days', '90_days'];
  return plan.filter(item => item && typeof item.title === 'string' && typeof item.description === 'string').map(item => ({
    timeframe: validTimeframes.includes(item.timeframe) ? item.timeframe : '30_days',
    title: String(item.title).slice(0, 200),
    description: String(item.description).slice(0, 1000),
    expectedObstacle: typeof item.expectedObstacle === 'string' ? String(item.expectedObstacle).slice(0, 500) : '',
  }));
}

/**
 * Klasifikasi severity level berdasarkan metrics dan resilience score.
 * Mengembalikan level + tone instructions yang spesifik untuk LLM.
 */
type SeverityLevel = 'ringan' | 'sedang' | 'berat';

function getSeverityLevel(metrics: { financialStress: string; careerBurnout: string; socialPressure: string; futureAnxiety: string }, resilienceScore: number): { level: SeverityLevel; toneInstruction: string } {
  const highCount = [metrics.financialStress, metrics.careerBurnout, metrics.socialPressure, metrics.futureAnxiety].filter(v => v === 'high').length;

  // Berat: 2+ metrics high atau resilience <= 3
  if (highCount >= 2 || resilienceScore <= 3) {
    return {
      level: 'berat',
      toneInstruction: `**LEVEL RESPON: BERAT**
User lagi di titik terberat. Tone lo harus:
- **Panjang**: 3-4 paragraf pendek (maks 200 kata). Kasih ruang buat user merasa didengar.
- Mulai dengan validasi tulus: "Gue ngerti ini berat banget buat lo..."
- JANGAN langsung tampar. User butuh merasa didengar dulu sebelum dikasih realita.
- Lembut tapi jujur. Nggak sugarcoating, nggak nggurui.
- Fokus ke 1 langkah kecil yang bisa dilakuin HARI INI.
- Tutup dengan: "Lo nggak harus solve semua ini sekarang. Satu langkah kecil udah cukup."
- Hindari kata "tamparan" atau "bukakan mata". Pakai "bareng" atau "teman".`,
    };
  }

  // Sedang: 1 metric high atau 2+ medium atau resilience 4-6
  if (highCount === 1 || resilienceScore <= 6) {
    return {
      level: 'sedang',
      toneInstruction: `**LEVEL RESPON: SEDANG**
User cukup tertekan. Tone lo:
- **Panjang**: 2-3 paragraf pendek (maks 150 kata). Padat, nggak bertele-tele.
- Validasi singkat di awal (1 kalimat), langsung ke analisis tajam.
- Tone: teman yang peduli tapi jujur. "Gue ngerti rasanya, tapi ini kenyataannya..."
- Tampar realita yang tegas tapi nggak brutal. User butuh sadar, bukan dihakimi.
- Fokus ke 2 langkah konkret: 1 jangka pendek + 1 jangka menengah.
- Tutup dengan ajakan bertindak jelas, bukan motivasi generic.`,
    };
  }

  // Ringan: 0 high, resilience 7-10
  return {
    level: 'ringan',
    toneInstruction: `**LEVEL RESPON: RINGAN**
User stabil. Tone lo:
- **Panjang**: RINGKAS BANGET. 1-2 paragraf pendek (60-100 kata). Nggak bertele-tele. Langsung ke inti.
- Skip validasi emosi, langsung tampar realita yang tajam dan pedas.
- Tone khas TAMI: jujur, tajam, nggak nggurui, tapi membukakan mata.
- "Lo udah tahu jawabannya, tapi belum mau hadapi. Ini kenyataannya..."
- Kasih 3 langkah lengkap (24 jam, 30 hari, 90 hari) dengan ekspektasi tinggi.
- Tutup dengan tantangan: "Sekarang pilihan lo: tetap nyaman di ilusi, atau mulai bertindak."`,
  };
}

function generateQuickSuggestions(query: string, emotion: string, distortion: string): string[] {
  const suggestions: string[] = [];
  const q = query.toLowerCase();
  const e = emotion.toLowerCase();

  // Prioritize based on cognitive distortion type
  if (distortion === 'FOMO-Driven Decision') {
    suggestions.push('Gimana cara stop bandingin diri dengan orang lain di sosmed?');
    suggestions.push('Apa tanda kalau aku lagi ambil keputusan karena FOMO?');
  } else if (distortion === 'Catastrophizing') {
    suggestions.push('Gimana cara hentikan overthinking tentang masa depan?');
    suggestions.push('Apakah worry yang aku rasakan realistis atau kelebihan?');
  } else if (distortion === 'All-or-Nothing Thinking') {
    suggestions.push('Gimana cara lihat gradasi, bukan cuma sukses atau gagal?');
    suggestions.push('Apa contoh progres kecil yang masih valid walau belum sempurna?');
  } else if (distortion === 'Should Statements') {
    suggestions.push('Gimana cara lepas dari ekspektasi "harus" dari orang lain?');
    suggestions.push('Apa bedanya motivasi sehat dan tekanan "harus"?');
  }

  // Topic-based suggestions
  if (q.includes('karir') || q.includes('kerja') || q.includes('gaji') || q.includes('bos') || q.includes('resign')) {
    suggestions.push('Bagaimana cara negosiasi gaji secara realistis?');
    suggestions.push('Apakah aku harus resign tanpa dana darurat?');
    suggestions.push('Gimana cara ngadepin burnout karir di usia 20-an?');
  } else if (q.includes('uang') || q.includes('finansial') || q.includes('tabungan') || q.includes('investasi') || q.includes('hutang') || q.includes('pinjol')) {
    suggestions.push('Berapa besar dana darurat yang wajib kupunya?');
    suggestions.push('Gimana cara stop jebakan konsumerisme & FOMO?');
    suggestions.push('Bagaimana membagi gaji untuk sandwich generation?');
  } else if (q.includes('umur') || q.includes('tertinggal') || q.includes('gagal') || q.includes('teman')) {
    suggestions.push('Apakah wajar belum sukses di usia 25?');
    suggestions.push('Gimana cara lepas dari tekanan ekspektasi orang tua?');
    suggestions.push('Bagaimana fokus ke progres sendiri tanpa bandingkan dengan orang lain?');
  } else if (e.includes('cemas') || e.includes('anxious') || e.includes('takut')) {
    suggestions.push('Gimana cara kelola kecemasan soal masa depan?');
    suggestions.push('Apa langkah kecil yang bisa aku lakukan hari ini?');
  } else if (e.includes('frustrasi') || e.includes('marah') || e.includes('kesal')) {
    suggestions.push('Gimana cara channeling rasa frustrasi jadi energi produktif?');
    suggestions.push('Apakah ekspektasiku realistis atau perlu disesuaikan?');
  }

  // Fallback if not enough suggestions
  if (suggestions.length < 3) {
    const fallback = [
      'Apa langkah pertama untuk benahi finansialku?',
      'Bagaimana menemukan arah karir yang rasional?',
      'Gimana cara bangun ketahanan mental di tengah tekanan?',
    ];
    for (const f of fallback) {
      if (suggestions.length < 3 && !suggestions.includes(f)) {
        suggestions.push(f);
      }
    }
  }

  return suggestions.slice(0, 3);
}

/**
 * LLM-based follow-up question generation.
 * Produces more contextual and natural suggestions than rule-based.
 * Falls back to rule-based if LLM call fails.
 */
async function generateLLMSuggestions(
  query: string,
  emotion: string,
  distortion: string,
  reply: string,
): Promise<string[]> {
  try {
    const response = await mistral.chat({
      model: 'mistral-small-latest',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: 'Lo generator follow-up question buat TAMI. Bikin 3 pertanyaan lanjutan yang relevan, natural, bikin user pengen mendalami masalah mereka. Bahasa Indonesia kasual (pakai gue/kamu atau aku/kamu), singkat (maks 15 kata), langsung ke inti. Jangan formal. Jangan kayak robot. Format: JSON array of strings.'
        },
        {
          role: 'user',
          content: `Pertanyaan user: "${query.slice(0, 300)}"\nEmosi: ${emotion}\nDistorsi: ${distortion}\nRingkasan jawaban TAMI: "${reply.slice(0, 300)}"\n\nHasilkan 3 pertanyaan follow-up yang membuat user ingin mendalami lebih jauh.`,
        },
      ],
      responseFormat: { type: 'json_object' },
      maxTokens: 200,
      promptCacheKey: 'tami-suggestions',
      timeoutMs: 4000,
    });

    const content = response.choices[0].message.content;
    const parsed = JSON.parse(content);
    const suggestions = Array.isArray(parsed.questions) ? parsed.questions : Array.isArray(parsed) ? parsed : [];

    if (suggestions.length >= 2 && suggestions.every((s: any) => typeof s === 'string' && s.length > 5 && s.length < 100)) {
      return suggestions.slice(0, 3);
    }

    return generateQuickSuggestions(query, emotion, distortion);
  } catch {
    return generateQuickSuggestions(query, emotion, distortion);
  }
}

export async function processTamiIntelligence(query: string, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<TamiCognitiveResponse> {
  // T7-6: Circuit breaker check - if Mistral is down, return graceful degradation
  if (!isMistralAvailable()) {
    console.warn('[TAMI] Circuit breaker open - returning fallback response');
    const fallback = generateFallbackResponse(query);
    return {
      mindState: {
        primaryEmotion: 'neutral',
        resilienceScore: 5,
        crisisDetected: false,
        coreDilemma: fallback.conversationalReply,
      },
      diagnosis: {
        metrics: { financialStress: 'low', careerBurnout: 'low', socialPressure: 'low', futureAnxiety: 'low' },
        rootCauseAnalysis: 'Sistem sedang dalam mode terbatas.',
        cognitiveDistortion: 'Tidak Ada',
        realityCheckVerdict: fallback.conversationalReply,
      },
      actionPlan: [],
      citations: [],
      conversationalReply: fallback.conversationalReply,
      suggestions: fallback.suggestions,
      severityLevel: 'ringan',
      isDegraded: true,
    } as TamiCognitiveResponse;
  }

  // T7-7: Enhanced language detection + code-mixing normalization
  const langResult = detectLanguageDetailed(query);
  const normalizedQuery = langResult.language === 'mixed' ? normalizeCodeMixing(query) : query;

  // T7-7: Check English crisis indicators for bilingual crisis detection
  const englishCrisis = hasEnglishCrisisIndicators(query);

  // T7-1: Session-based conversation memory
  const sessionId = `session-${history.length}-${normalizeQuery(query).slice(0, 20)}`;

  // 0a. Response cache check (only for first-turn queries with no history)
  if (history.length === 0) {
    const cacheKey = normalizeQuery(normalizedQuery);
    const cached = tamiResponseCache.get(cacheKey);
    if (cached) {
      console.log('[TAMI CACHE] Hit for query:', cacheKey.slice(0, 50));
      return cached;
    }
  }

  // 0b. Fast-path Greeting Detection
  const cleanQuery = query.toLowerCase().trim().replace(/[?.!,]/g, '');
  const greetings = ['halo', 'hi', 'hey', 'hei', 'helo', 'hello', 'p', 'ping', 'test', 'halo tami', 'hi tami', 'tami', 'hallo', 'assalamualaikum', 'salam', 'pagi', 'siang', 'sore', 'malam', 'terima kasih', 'thanks', 'makasih', 'thank you', 'ok', 'oke'];
  if (greetings.includes(cleanQuery)) {
    return {
      mindState: {
        primaryEmotion: 'neutral',
        resilienceScore: 10,
        crisisDetected: false,
        coreDilemma: 'Tidak ada dilema kognitif dari pesan sapaan atau terima kasih.'
      },
      diagnosis: {
        metrics: {
          financialStress: 'low',
          careerBurnout: 'low',
          socialPressure: 'low',
          futureAnxiety: 'low'
        },
        rootCauseAnalysis: 'Tidak ada masalah kognitif yang terdeteksi dalam pesan sapaan.',
        cognitiveDistortion: 'Tidak Ada',
        realityCheckVerdict: 'Jangan cuma menyapa, ayo tumpahkan realita atau kebingungan hidupmu agar bisa kita bedah bersama.'
      },
      actionPlan: [],
      citations: [],
      conversationalReply: cleanQuery.match(/(terima kasih|thanks|makasih|thank you)/) 
        ? 'Sama-sama kak! Senang bisa mendampingi proses berpikirmu. Kalau ada realita hidup, karir, atau keuangan lainnya yang mau kamu bedah, silakan tumpahkan di sini.'
        : 'Halo kak! Aku TAMI. Ada yang bisa aku bantu?',
      suggestions: [
        'Gimana cara atasi rasa tertinggal dari teman seumuran?',
        'Berapa besar dana darurat yang ideal untuk anak muda?',
        'Bagaimana menghadapi burnout karir & beban ekspektasi?'
      ],
      severityLevel: 'ringan'
    };
  }

  // 0c. Domain filter — multi-layer off-topic detection
  // Block queries outside TAMI's domain before running expensive 4-agent pipeline
  const domainCheck = await checkDomain(normalizedQuery);
  if (domainCheck.isOffTopic) {
    console.log(`[TAMI DOMAIN] Rejected via ${domainCheck.layer}: ${domainCheck.reason}`);
    return {
      mindState: {
        primaryEmotion: 'netral',
        resilienceScore: 10,
        crisisDetected: false,
        coreDilemma: 'Query di luar domain TAMI.',
      },
      diagnosis: {
        metrics: {
          financialStress: 'low',
          careerBurnout: 'low',
          socialPressure: 'low',
          futureAnxiety: 'low',
        },
        rootCauseAnalysis: 'Query tidak relevan dengan domain TAMI.',
        cognitiveDistortion: 'Tidak Ada',
        realityCheckVerdict: domainCheck.rejectionMessage || 'Itu di luar area gue.',
      },
      actionPlan: [],
      citations: [],
      conversationalReply: domainCheck.rejectionMessage || 'Itu di luar area gue.',
      suggestions: [
        'Gimana cara atasi rasa tertinggal dari teman seumuran?',
        'Berapa besar dana darurat yang ideal untuk anak muda?',
        'Bagaimana menghadapi burnout karir & beban ekspektasi?',
      ],
      severityLevel: 'ringan',
    };
  }

  // Determine query complexity (number of words)
  const isSimpleQuery = query.split(/\s+/).length <= 6;
  const modelToUse = isSimpleQuery ? 'mistral-small-latest' : 'mistral-large-latest';

  // Semantic dedup: check if user is repeating a similar question
  const dedupResult = await checkSemanticDup(sessionId, normalizedQuery);
  const dedupContext = dedupResult.isDuplicate
    ? `\n\n[CATATAN INTERNAL: User mengajukan pertanyaan yang sangat mirip dengan sebelumnya ("${dedupResult.similarQuery?.slice(0, 100)}"). Jika jawaban sebelumnya sudah menjawab, berikan perspektif baru atau tanyakan aspek spesifik yang ingin didalami, jangan ulang jawaban yang sama.]`
    : '';

  // Sanitize inputs sebelum masuk ke LLM pipeline
  const safeQuery = sanitizeForPrompt(normalizedQuery);
  const safeHistory = sanitizeHistory(history);
  const rawHistory = await compressHistory(history);

  // T7-1: Track message in conversation memory
  addMessage(sessionId, 'user', normalizedQuery);
  // T7-1: Trigger async session compression if threshold reached
  compressSessionHistory(sessionId).catch(() => {});

  // Multi-turn crisis follow-up: check if previous turn had crisis
  const previousCrisis = history.some(
    (m) => m.role === 'assistant' && (
      m.content.includes('krisis') ||
      m.content.includes('crisis') ||
      m.content.includes('kesehatan mental') ||
      m.content.includes('hubungi') ||
      m.content.includes('wa.me') ||
      m.content.includes('professional') ||
      m.content.includes('konsultan')
    )
  );
  const crisisFollowupContext = previousCrisis
    ? '\n\n[CATATAN INTERNAL: Pada percakapan sebelumnya, TAMI mendeteksi tanda-tanda krisis/kondisi mental serius. Periksa apakah user sudah lebih baik atau masih kesulitan. Jika user masih menunjukkan tanda krisis, prioritaskan keamanan user dan dorong untuk mencari bantuan professional. Jangan abaikan.]'
    : '';

  // 1. Cognitive Diagnosis & Crisis Detection (Stateful)
  // 1. Cognitive Diagnosis
  const diagnosis = await traceAgent('cognitive-analyzer', () =>
    analyzeCognitiveState(safeQuery, safeHistory, modelToUse)
  );

  // WhatsApp Escalation link if crisis or high stress is present
  const showEscalation = diagnosis.mindState.crisisDetected || 
    diagnosis.mindState.resilienceScore <= 3 || 
    diagnosis.diagnosis.metrics.financialStress === 'high' || 
    diagnosis.diagnosis.metrics.careerBurnout === 'high' || 
    diagnosis.diagnosis.metrics.futureAnxiety === 'high';
  
  const whatsappEscalationUrl = showEscalation 
    ? `https://wa.me/6287859713765?text=${encodeURIComponent(`Halo Tim TAM, saya butuh teman diskusi/konsultasi intensif mengenai masalah: ${diagnosis.diagnosis.rootCauseAnalysis.slice(0, 200)}`)}`
    : undefined;

  // If crisis detected, return immediately with supportive response and crisis citations
  if (diagnosis.mindState.crisisDetected || englishCrisis) {
    const escalationLevel = getCrisisEscalationLevel(query);
    const isImmediate = escalationLevel === 'immediate' || englishCrisis;

    // Fire-and-forget crisis webhook notification
    sendCrisisNotification({
      emotion: diagnosis.mindState.primaryEmotion,
      resilience: diagnosis.mindState.resilienceScore,
      severity: isImmediate ? 'critical' : escalationLevel === 'warning' ? 'high' : 'medium',
      distortion: diagnosis.diagnosis.cognitiveDistortion,
      querySnippet: safeQuery.slice(0, 200),
      timestamp: new Date().toISOString(),
    }).catch(() => {});

    // T7-5: Log crisis event to audit log
    logCrisisEvent({
      sessionId,
      escalationLevel: isImmediate ? 'immediate' : (escalationLevel === 'warning' || escalationLevel === 'monitor' ? escalationLevel : 'monitor'),
      emotion: diagnosis.mindState.primaryEmotion,
      resilienceScore: diagnosis.mindState.resilienceScore,
      querySnippet: safeQuery.slice(0, 200),
      actionTaken: englishCrisis ? 'english-crisis-resources' : 'crisis-response',
      webhookSent: true,
    });

    // T7-4: Record sentiment for analytics
    recordSentiment(diagnosis.mindState.primaryEmotion, sessionId);

    // T7-7: Language-aware crisis resources
    const crisisResourcesText = getCrisisResources(langResult.language);

    const crisisReply = isImmediate
      ? `${langResult.language === 'en' ? 'I detect very serious crisis signals in your message. Your safety is the top priority.' : 'Saya mendeteksi sinyal krisis yang sangat serius dalam pesan Anda. Keselamatan Anda adalah prioritas utama.'}

${crisisResourcesText}`
      : `Saya mendeteksi situasi yang sangat berat dan sinyal krisis dalam pesan Anda. 

${crisisResourcesText}`;

    return {
      mindState: diagnosis.mindState,
      diagnosis: diagnosis.diagnosis,
      actionPlan: [
        {
          timeframe: '1x24_hours',
          title: 'Hubungi Bantuan Segera',
          description: 'Hubungi Healing119.id atau call center 119 ext 8 untuk berbicara dengan konselor profesional.',
          expectedObstacle: 'Rasa sungkan atau takut, tapi ingatlah bahwa keselamatan Anda adalah yang utama.'
        }
      ],
      citations: [],
      conversationalReply: crisisReply,
      escalationUrl: whatsappEscalationUrl,
      suggestions: [
        'Hubungi 119 ext 8 (Layanan Konseling Darurat)',
        'Konsultasi Langsung dengan Tim TAM via WhatsApp'
      ],
      severityLevel: 'berat'
    };
  }

  // 2. Hybrid RAG Search
  const searchResults = await traceAgentWithFallback('rag-search', () =>
    knowledgeGraph.search(query, 5)
  , [], { query: query.slice(0, 100) });
  const citations = knowledgeGraph.getCitations(searchResults, query);

  // Format context text from matching chunks (truncated to prevent token overflow)
  // Fallback: jika tidak ada hasil RAG, beri context kosong dengan instruksi explicit
  const contextText = searchResults.length > 0
    ? searchResults.map(r => {
      const typeLabel = r.chunk.type === 'series' ? `Seri: ${r.chunk.seriesName}` : r.chunk.type === 'whitepaper' ? 'Whitepaper' : 'Artikel';
      return `[Konteks ${typeLabel}: ${r.chunk.title}]\n${r.chunk.text.slice(0, 2500)}`;
    }).join('\n\n').slice(0, 12000)
    : 'TIDAK ADA KONTEKS ARTIKEL TAM YANG RELEVAN DITEMUKAN. Jawab berdasarkan pengetahuan umum tentang realita hidup anak muda Indonesia, tetap realistis dan jangan mengarang referensi spesifik.';

  // 3. Multi-Agent Reasoning (Parallelized using Promise.all)
  const analystPrompt = `Anda adalah Analyst Agent dari TAMI. Tugas Anda adalah menganalisis curhatan anak muda berikut, mencari asumsi salah yang mereka yakini (misal: "saya gagal karena umur 25 belum kaya"), dan membedah kenyataan aslinya.
Input: "${safeQuery}"
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi):
- Wajib gunakan Context TAM di atas sebagai landasan analisis utama Anda. Jangan mengarang asumsi di luar Context yang disediakan.
- Berikan analisis kritis Anda dalam 2 paragraf singkat secara tajam dan realistis.`;

  const knowledgePrompt = `Anda adalah Knowledge Integrator Agent dari TAMI. Tugas Anda adalah menghubungkan kritik realita berikut dengan referensi konten TAM yang relevan.
Pertanyaan User: "${safeQuery}"
Citations Terkait:
${citations.map(c => `- [${c.title}](${c.type === 'series' ? '/seri/' : c.type === 'whitepaper' ? '/whitepaper/' : '/artikel/'}${c.slug}) (${c.type})`).join('\n')}
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi):
- Hanya referensikan konten TAM yang tercantum secara nyata di dalam Citations Terkait dan Context TAM.
- Dilarang keras merekomendasikan artikel, seri, buku, website, atau sumber eksternal lain yang tidak ada dalam data di atas.
- Jelaskan bagaimana konten TAM tersebut menjawab dilema pengguna secara esensial. Tulis dalam 2 paragraf padat.`;

  const executionPrompt = `Anda adalah Execution Synthesizer Agent dari TAMI. Berdasarkan pertanyaan pengguna dan konteks berikut, susunlah 3 rencana aksi nyata (action steps) untuk pengguna.
Pertanyaan User: "${safeQuery}"
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi & Realisme):
- Rencana aksi harus membumi, sangat realistis, praktis, dan aman dilakukan oleh anak muda.
- Jangan menyarankan konseling klinis/medis kecuali jika terdeteksi indikasi krisis berat.
- Jangan merujuk ke buku atau mentor fiktif/luar context.
- Hasilkan output dalam format JSON object yang valid dengan struktur:
{
  "actionPlan": [
    {
      "timeframe": "1x24_hours" | "30_days" | "90_days",
      "title": "Judul langkah aksi",
      "description": "Deskripsi tindakan konkret dan praktis yang harus dilakukan",
      "expectedObstacle": "Hambatan mental atau realita yang mungkin muncul saat melakukannya"
    }
  ]
}`;

  let analystCritique = '';
  let knowledgeIntegration = '';
  let actionPlan: ActionStep[] = [];

  // Run the core agents in parallel to drastically improve response times
  await Promise.all([
    mistral.chat({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'Anda adalah Analyst Agent dari TAMI (Tamparan Anak Muda Intelligence). Tugas Anda adalah membedah asumsi salah dan distorsi berpikir anak muda Indonesia secara tajam dan realistis. Bicara dalam bahasa Indonesia.' },
        { role: 'user', content: analystPrompt }
      ],
      promptCacheKey: 'tami-analyst',
      maxTokens: 1000
    }).then(res => {
      analystCritique = res.choices[0].message.content;
    }).catch(err => {
      console.error('Analyst Agent failed:', err);
      recordMistralFailure();
      analystCritique = 'Gagal membedah asumsi pikiran Anda karena kendala pemrosesan.';
    }),

    mistral.chat({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'Anda adalah Knowledge Integrator Agent dari TAMI (Tamparan Anak Muda Intelligence). Tugas Anda adalah menghubungkan analisis dengan referensi konten TAM yang relevan. Bicara dalam bahasa Indonesia.' },
        { role: 'user', content: knowledgePrompt }
      ],
      promptCacheKey: 'tami-knowledge',
      maxTokens: 1000
    }).then(res => {
      knowledgeIntegration = res.choices[0].message.content;
    }).catch(err => {
      console.error('Knowledge Agent failed:', err);
      recordMistralFailure();
      knowledgeIntegration = 'Gagal mengintegrasikan referensi artikel TAM karena kendala pemrosesan.';
    }),

    mistral.chat({
      model: modelToUse,
      temperature: 0.3,
      messages: [
        { role: 'system', content: 'Anda adalah Execution Synthesizer Agent dari TAMI (Tamparan Anak Muda Intelligence). Susun rencana aksi realistis untuk anak muda Indonesia dalam bahasa Indonesia. Anda wajib merespons dalam format JSON yang valid.' },
        { role: 'user', content: executionPrompt }
      ],
      responseFormat: { type: 'json_object' },
      promptCacheKey: 'tami-execution',
      maxTokens: 800
    }).then(async res => {
      const rawContent = res.choices[0].message.content;
      let result = parseAndValidate(rawContent, actionPlanResponseSchema);

      // Retry once with error feedback if validation fails
      if (!result.success) {
        const feedback = `Output JSON sebelumnya tidak valid. Error: ${result.error}. Perbaiki dan hasilkan JSON dengan struktur: { "actionPlan": [{ "timeframe": "1x24_hours"|"30_days"|"90_days", "title": string, "description": string, "expectedObstacle": string }] }`;
        const retryRes = await mistral.chat({
          model: modelToUse,
          temperature: 0.2,
          messages: [
            { role: 'system', content: 'Anda adalah Execution Synthesizer Agent dari TAMI (Tamparan Anak Muda Intelligence). Susun rencana aksi realistis untuk anak muda Indonesia dalam bahasa Indonesia. Anda wajib merespons dalam format JSON yang valid.' },
            { role: 'user', content: `${executionPrompt}\n\n${feedback}` }
          ],
          responseFormat: { type: 'json_object' },
          promptCacheKey: 'tami-execution',
          maxTokens: 800
        });
        result = parseAndValidate(retryRes.choices[0].message.content, actionPlanResponseSchema);
      }

      if (result.success) {
        actionPlan = result.data.actionPlan;
      } else {
        throw new Error(`Action plan validation failed: ${result.error}`);
      }
    }).catch(err => {
      console.error('Execution Agent failed or returned invalid JSON:', err);
      recordMistralFailure();
      actionPlan = [
        {
          timeframe: '1x24_hours',
          title: 'Detoks Informasi & Medsos',
          description: 'Matikan notifikasi media sosial selama 24 jam penuh untuk menjernihkan pikiran dari kepalsuan pencapaian orang lain.',
          expectedObstacle: 'Rasa cemas tertinggal berita (FOMO).'
        },
        {
          timeframe: '30_days',
          title: 'Audit Keuangan & Karir Realistis',
          description: 'Tulis seluruh pengeluaran bulanan dan bandingkan dengan pemasukan real. Hentikan gaya hidup konsumerisme instan.',
          expectedObstacle: 'Ketidaknyamanan melihat kenyataan cashflow yang buruk.'
        },
        {
          timeframe: '90_days',
          title: 'Membangun Skill Komersial Baru',
          description: 'Fokus belajar satu keahlian spesifik yang memiliki nilai pasar tinggi secara konsisten minimal 1 jam sehari.',
          expectedObstacle: 'Rasa bosan dan keinginan menyerah di tengah jalan.'
        }
      ];
    })
  ]);

  // Agent D: Verifier (Anti-Hallucination & Groundedness Gate)
  const safeAnalystCritique = sanitizeForPrompt(analystCritique);
  const safeKnowledgeIntegration = sanitizeForPrompt(knowledgeIntegration);
  const verificationPrompt = `Anda adalah Verifier Agent dari TAMI. Tugas Anda adalah mengaudit analisis kritik, integrasi konten, dan rencana aksi yang dihasilkan oleh agen-agen sebelumnya untuk mencegah halusinasi.
Kritik Analisis: "${safeAnalystCritique}"
Integrasi Konten: "${safeKnowledgeIntegration}"
Rencana Aksi: ${JSON.stringify(actionPlan)}
Context TAM (ringkas): "${contextText.slice(0, 4000)}"

Lakukan audit berikut:
1. Pastikan tidak ada referensi ke buku eksternal, website luar, riset fiktif, atau mentor yang tidak disebutkan dalam Context TAM. Jika ada, hapus atau ganti dengan argumen yang berbasis Context TAM.
2. Pastikan rencana aksi sangat praktis dan realistis sesuai anjuran Tamparan Anak Muda.
3. Hasilkan output revisi akhir dalam format JSON:
{
  "analystCritique": "Versi revisi analisis kritik (2 paragraf)",
  "knowledgeIntegration": "Versi revisi integrasi konten (2 paragraf)",
  "actionPlan": [
    {
      "timeframe": "1x24_hours" | "30_days" | "90_days",
      "title": "Judul langkah aksi",
      "description": "Deskripsi tindakan konkret",
      "expectedObstacle": "Hambatan yang mungkin muncul"
    }
  ]
}`;

  let verifiedAnalystCritique = analystCritique;
  let verifiedKnowledgeIntegration = knowledgeIntegration;
  let verifiedActionPlan = actionPlan;

  try {
    const buildVerifierMessages = (errorFeedback?: string) => [
      { role: 'system' as const, content: 'Anda adalah Verifier Agent dari TAMI (Tamparan Anak Muda Intelligence). Audit dan revisi output agen-agen dalam bahasa Indonesia. Anda wajib merespons dalam format JSON yang valid.' },
      { role: 'user' as const, content: errorFeedback ? `${verificationPrompt}\n\n${errorFeedback}` : verificationPrompt },
    ];

    let verifierResponse = await mistral.chat({
      model: modelToUse,
      temperature: 0.3,
      messages: buildVerifierMessages(),
      responseFormat: { type: 'json_object' },
      promptCacheKey: 'tami-verifier',
      maxTokens: 1500
    });

    let verifierResult = parseAndValidate(verifierResponse.choices[0].message.content, verifierOutputSchema);

    // Retry once with error feedback if validation fails
    if (!verifierResult.success) {
      const feedback = `Output JSON sebelumnya tidak valid. Error: ${verifierResult.error}. Perbaiki dan hasilkan JSON dengan struktur: { "analystCritique": string, "knowledgeIntegration": string, "actionPlan": [{ "timeframe": "1x24_hours"|"30_days"|"90_days", "title": string, "description": string, "expectedObstacle": string }] }`;
      verifierResponse = await mistral.chat({
        model: modelToUse,
        temperature: 0.2,
        messages: buildVerifierMessages(feedback),
        responseFormat: { type: 'json_object' },
        promptCacheKey: 'tami-verifier',
        maxTokens: 1500
      });
      verifierResult = parseAndValidate(verifierResponse.choices[0].message.content, verifierOutputSchema);
    }

    if (verifierResult.success) {
      verifiedAnalystCritique = verifierResult.data.analystCritique;
      verifiedKnowledgeIntegration = verifierResult.data.knowledgeIntegration;
      verifiedActionPlan = verifierResult.data.actionPlan;
    }
  } catch (error) {
    console.error('Failed to run verification step or parse JSON, proceeding with original debate results:', error);
    recordMistralFailure();
  }

  // 4. Executive Synthesis for Conversational Reply
  const safeVerifiedAnalyst = sanitizeForPrompt(verifiedAnalystCritique);
  const safeVerifiedKnowledge = sanitizeForPrompt(verifiedKnowledgeIntegration);
  const severity = getSeverityLevel(diagnosis.diagnosis.metrics, diagnosis.mindState.resilienceScore);
  const personality = getPersonalityVariant(severity.level, sessionId);
  logVariantAssignment(personality.variant, sessionId, severity.level);
  const citationsList = citations.map(c => {
    const url = c.type === 'series' ? `/seri/${c.slug}` : c.type === 'whitepaper' ? `/whitepaper/${c.slug}` : `/artikel/${c.slug}`;
    return `- [${c.title}](${url}) (${c.type})`;
  }).join('\n');
  const synthesisPrompt = `Lo TAMI. Teman yang ngasih tamparan realita ke anak muda Indonesia. Bukan AI generik, bukan asisten. Lo teman yang jujur pas semua orang cuma nyenangin.
Pertanyaan user: "${safeQuery}"${dedupContext}${crisisFollowupContext}${getLanguageInstruction(detectLanguage(query))}
Context TAM: "${contextText.slice(0, 3000)}"
Emosi user: ${diagnosis.mindState.primaryEmotion}, Distorsi: ${diagnosis.diagnosis.cognitiveDistortion}, Resiliensi: ${diagnosis.mindState.resilienceScore}/10
Analisis: "${safeVerifiedAnalyst}"
Konten TAM relevan: "${safeVerifiedKnowledge}"
Rencana aksi: ${JSON.stringify(verifiedActionPlan)}

Artikel TAM yang bisa direkomendasi (gunain link ini persis):
${citationsList}

Pilih 1-2 yang paling nyambung. Sisipin natural di teks, jangan list semua.

${severity.toneInstruction}

${personality.toneInstruction}

Aturan:
1. Panjang jawaban ikut LEVEL RESPON di atas. Jangan ngegas lebih panjang. Ringkas = hormatin waktu user.
2. Semua argumen berbasis Context TAM. Jangan ngarang teori, riset, atau statistik.
3. Jangan rekomendasiin buku, website, atau mentor eksternal yang nggak ada di Context TAM.
4. **DOMAIN LOCK**: Lo CUMA bahas karir, keuangan, tekanan sosial, mental, dan dilema hidup anak muda Indonesia. Itu doang. Kalau user nanya di luar itu (coding, resep masakan, cuaca, berita, tugas kuliah, review gadget, politik, diagnosa medis, rekomendasi film/musik, travel itinerary, gaming, sejarah, matematika, sains, dll) — TOLAK TEGAS. Bilang: "Itu di luar area gue. Gue TAMI — gue cuma bahas realita hidup anak muda: karir, uang, tekanan sosial, mental." Jangan coba jawab meskipun lo tahu jawabannya. Jangan pujian-pujian dulu. Langsung tolak.
5. Tone WAJIB ngikut LEVEL RESPON. Baca baik-baik, jangan pakai tone yang sama buat semua user.
6. Format Markdown. Jangan sebut nama agen internal. Lo bicara sebagai TAMI, bukan sebagai "sistem" atau "asisten".
7. Link artikel: \`[Judul](/artikel/slug)\` atau \`[Judul Seri](/seri/slug)\`.
8. Visualisasi data (opsional): kalau relevan, boleh pakai chart/comparison/nerd box. Format:
   - Chart bar: \`\`\`chart:bar\n{"title":"Judul","data":[{"label":"A","value":100}],"yLabel":"Nilai","xLabel":"Kategori"}\n\`\`\`
   - Chart line: \`\`\`chart:line\n{"title":"Judul","data":[{"label":"2024","value":100}],"yLabel":"Nilai","xLabel":"Tahun"}\n\`\`\`
   - Chart pie: \`\`\`chart:pie\n{"title":"Judul","data":[{"label":"A","value":60}],"unit":"%"}\n\`\`\`
   - Comparison: \`\`\`comparison\n{"title":"Perbandingan","columns":["A","B"],"rows":[{"metric":"Biaya","values":["Rp 5jt","Rp 2jt"]}]}\n\`\`\`
   - Nerd box: \`\`\`nerd\n{"title":"Fun Fact","content":"Penjelasan tambahan."}\n\`\`\`
   Gunain cuma kalau bantu user paham. Jangan dipaksa.`;

  const finalResponse = await traceAgent('synthesis', () =>
    chatWithFallback(mistral, {
      model: modelToUse,
      messages: [
        {
          role: 'system',
          content: `Lo TAMI. Bukan AI, bukan asisten, bukan chatbot. Lo teman yang ngasih tamparan realita ke anak muda Indonesia. Ngomong langsung, jujur, tajam, tapi nggak nggurui. Pakai bahasa gue/kamu, kasual tapi berbobot. Jangan pernah sebut diri sebagai AI atau model bahasa. DOMAIN LO: karir, keuangan, tekanan sosial, mental, dilema hidup anak muda Indonesia. Itu doang. Di luar itu, tolak tegas. Sesuaikan tone berdasarkan severity: ${severity.level.toUpperCase()}.`
        },
        ...rawHistory.map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: synthesisPrompt }
      ],
      promptCacheKey: 'tami-synthesis',
      maxTokens: 800
    }, 'mistral-small-latest')
  );

  const rawConversationalReply = finalResponse.choices[0].message.content;

  // Run Fact & Citation Guardrail to sanitize markdown links and citations
  const validated = validateTamiFacts(
    rawConversationalReply,
    citations,
    searchResults.map(r => r.chunk)
  );

  const suggestions = await generateLLMSuggestions(safeQuery, diagnosis.mindState.primaryEmotion, diagnosis.diagnosis.cognitiveDistortion, validated.sanitizedReply);

  // T7-4: Record sentiment and topic for analytics
  recordSentiment(diagnosis.mindState.primaryEmotion, sessionId);
  trackTopicMention(safeQuery.slice(0, 50), diagnosis.mindState.primaryEmotion);
  trackTopic(sessionId, safeQuery.slice(0, 50));

  // T7-1: Track assistant response in conversation memory
  addMessage(sessionId, 'assistant', validated.sanitizedReply);

  // T7-6: Record circuit breaker success
  recordMistralSuccess();

  // Log trace summary for observability
  const traceSummary = getTraceSummary();
  if (Object.keys(traceSummary).length > 0) {
    console.log('[TAMI TRACE SUMMARY]', JSON.stringify(traceSummary));
    clearTraces();
  }

  const result = {
    mindState: diagnosis.mindState,
    diagnosis: diagnosis.diagnosis,
    actionPlan: verifiedActionPlan,
    citations: validated.sanitizedCitations,
    conversationalReply: validated.sanitizedReply,
    suggestions,
    escalationUrl: whatsappEscalationUrl,
    severityLevel: severity.level
  };

  // Cache the response for identical future queries (only first-turn, non-crisis)
  if (history.length === 0 && !diagnosis.mindState.crisisDetected) {
    const cacheKey = normalizeQuery(normalizedQuery);
    tamiResponseCache.set(cacheKey, result);
    console.log('[TAMI CACHE] Stored for query:', cacheKey.slice(0, 50));
  }

  return result;
}
export async function streamTamiReply(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  cognitiveData: Omit<TamiCognitiveResponse, 'conversationalReply'>
): Promise<ReadableStream> {
  const safeQuery = sanitizeForPrompt(query);
  const rawHistory = truncateHistory(history);
  const safeRootCause = sanitizeForPrompt(cognitiveData.diagnosis.rootCauseAnalysis);
  const safeRealityCheck = sanitizeForPrompt(cognitiveData.diagnosis.realityCheckVerdict);
  const safeDistortion = sanitizeForPrompt(cognitiveData.diagnosis.cognitiveDistortion);
  const safeEmotion = sanitizeForPrompt(cognitiveData.mindState.primaryEmotion);
  const citationsContext = cognitiveData.citations.map(c => `[${c.title}](${c.type === 'series' ? '/seri/' : c.type === 'whitepaper' ? '/whitepaper/' : '/artikel/'}${c.slug})`).join(', ');
  const streamSeverity = getSeverityLevel(cognitiveData.diagnosis.metrics, cognitiveData.mindState.resilienceScore);
  const synthesisPrompt = `Lo TAMI. Teman yang ngasih tamparan realita ke anak muda Indonesia. Bukan AI generik, bukan asisten. Lo teman yang jujur pas semua orang cuma nyenangin.

Pertanyaan user: "${safeQuery}"
Emosi: "${safeEmotion}"
Distorsi: "${safeDistortion}"
Resiliensi: ${cognitiveData.mindState.resilienceScore}/10
Diagnosa: "${safeRootCause}"
Tamparan realita: "${safeRealityCheck}"
Rencana aksi: ${JSON.stringify(cognitiveData.actionPlan)}
Artikel TAM: ${citationsContext}

${streamSeverity.toneInstruction}

Aturan:
1. Semua argumen selaras dengan artikel TAM di atas. Jangan ngarang referensi eksternal atau statistik fiktif.
2. **DOMAIN LOCK**: Lo CUMA bahas karir, keuangan, tekanan sosial, mental, dan dilema hidup anak muda Indonesia. Kalau user nanya di luar itu (coding, resep, cuaca, berita, tugas kuliah, review gadget, politik, medis, film/musik, travel, gaming, sejarah, matematika, sains) — TOLAK TEGAS. Bilang: "Itu di luar area gue. Gue TAMI — gue cuma bahas realita hidup anak muda." Jangan jawab meskipun lo tahu. Langsung tolak.
3. Tone WAJIB ngikut LEVEL RESPON di atas. Baca baik-baik.
4. Link artikel: \`[Judul](/artikel/slug)\` atau \`[Judul Seri](/seri/slug)\`. Jangan pakai link eksternal.
5. Visualisasi (opsional): kalau relevan, boleh chart/comparison/nerd box. Format sama kayak biasa. Gunain cuma kalau bantu user paham.`;

  return mistral.chatStream({
    messages: [
      {
        role: 'system',
        content: `Lo TAMI. Bukan AI, bukan asisten, bukan chatbot. Lo teman yang ngasih tamparan realita ke anak muda Indonesia. Ngomong langsung, jujur, tajam, tapi nggak nggurui. Pakai bahasa gue/kamu, kasual tapi berbobot. Jangan pernah sebut diri sebagai AI atau model bahasa. DOMAIN LO: karir, keuangan, tekanan sosial, mental, dilema hidup anak muda Indonesia. Itu doang. Di luar itu, tolak tegas. Sesuaikan tone berdasarkan severity: ${streamSeverity.level.toUpperCase()}.`
      },
      ...rawHistory.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: synthesisPrompt }
    ],
    promptCacheKey: 'tami-synthesis-stream',
    maxTokens: 800
  });
}
