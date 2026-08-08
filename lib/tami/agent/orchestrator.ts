import { analyzeCognitiveState } from '../cognitive/analyzer';
import { knowledgeGraph } from '../rag/knowledge-graph';
import { mistral } from '../mistral/client';
import { TamiCognitiveResponse, ActionStep, CitationRef } from '../cognitive/types';
import { validateTamiFacts } from '../guardrails/fact-guardrail';

function generateQuickSuggestions(query: string, emotion: string, distortion: string): string[] {
  const suggestions: string[] = [];
  const q = query.toLowerCase();

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
  } else {
    suggestions.push('Apa langkah pertama untuk benahi finansialku?');
    suggestions.push('Bagaimana menemukan arah karir yang rasional?');
    suggestions.push('Gimana cara bangun ketahanan mental di tengah tekanan?');
  }

  return suggestions.slice(0, 3);
}

export async function processTamiIntelligence(query: string, history: { role: 'user' | 'assistant'; content: string }[] = []): Promise<TamiCognitiveResponse> {
  // 0. Fast-path Greeting Detection
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
        ? 'Sama-sama! Senang bisa mendampingi proses berpikirmu. Kalau ada realita hidup, karir, atau keuangan lainnya yang mau kamu bedah, silakan tumpahkan di sini.'
        : 'Halo! Aku TAMI (Tamparan Anak Muda Intelligence). Tumpahkan curhat karir, keuangan, tekanan sosial, atau dilema hidupmu di sini agar bisa kita bedah akar masalahnya secara jujur dan realistis.',
      suggestions: [
        'Gimana cara atasi rasa tertinggal dari teman seumuran?',
        'Berapa besar dana darurat yang ideal untuk anak muda?',
        'Bagaimana menghadapi burnout karir & beban ekspektasi?'
      ]
    };
  }

  // Determine query complexity (number of words)
  const isSimpleQuery = query.split(/\s+/).length <= 6;
  const modelToUse = isSimpleQuery ? 'mistral-small-latest' : 'mistral-large-latest';

  // 1. Cognitive Diagnosis & Crisis Detection (Stateful)
  const diagnosis = await analyzeCognitiveState(query, history);

  // WhatsApp Escalation link if crisis or high stress is present
  const showEscalation = diagnosis.mindState.crisisDetected || 
    diagnosis.mindState.resilienceScore <= 3 || 
    diagnosis.diagnosis.metrics.financialStress === 'high' || 
    diagnosis.diagnosis.metrics.careerBurnout === 'high' || 
    diagnosis.diagnosis.metrics.futureAnxiety === 'high';
  
  const whatsappEscalationUrl = showEscalation 
    ? `https://wa.me/6287859713765?text=${encodeURIComponent(`Halo Tim TAM, saya butuh teman diskusi/konsultasi intensif mengenai masalah: ${diagnosis.diagnosis.rootCauseAnalysis}`)}`
    : undefined;

  // If crisis detected, return immediately with supportive response and crisis citations
  if (diagnosis.mindState.crisisDetected) {
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
      conversationalReply: `Saya mendeteksi situasi yang sangat berat dan sinyal krisis dalam pesan Anda. 

Keselamatan dan kesehatan mental Anda adalah prioritas paling utama. Mohon jangan hadapi ini sendirian. Anda dapat menghubungi layanan konseling darurat gratis di Indonesia melalui **Healing119.id** atau hubungi telepon **119 ext 8**. Ada orang-orang profesional yang siap mendengarkan dan mendampingi Anda melewati masa sulit ini.`,
      escalationUrl: whatsappEscalationUrl,
      suggestions: [
        'Hubungi 119 ext 8 (Layanan Konseling Darurat)',
        'Konsultasi Langsung dengan Tim TAM via WhatsApp'
      ]
    };
  }

  // 2. Hybrid RAG Search
  const searchResults = await knowledgeGraph.search(query, 5);
  const citations = knowledgeGraph.getCitations(searchResults);

  // Format context text from matching chunks
  const contextText = searchResults.map(r => `[Konteks Artikel: ${r.chunk.title} (${r.chunk.type === 'series' ? 'Seri ' + r.chunk.seriesName : 'Artikel'})]\n${r.chunk.text}`).join('\n\n');

  // 3. Multi-Agent Reasoning (Parallelized using Promise.all)
  const analystPrompt = `Anda adalah Analyst Agent dari TAMI. Tugas Anda adalah menganalisis curhatan anak muda berikut, mencari asumsi salah yang mereka yakini (misal: "saya gagal karena umur 25 belum kaya"), dan membedah kenyataan aslinya.
Input: "${query}"
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi):
- Wajib gunakan Context TAM di atas sebagai landasan analisis utama Anda. Jangan mengarang asumsi di luar Context yang disediakan.
- Berikan analisis kritis Anda dalam 2 paragraf singkat secara tajam dan realistis.`;

  const knowledgePrompt = `Anda adalah Knowledge Integrator Agent dari TAMI. Tugas Anda adalah menghubungkan kritik realita berikut dengan referensi konten TAM yang relevan.
Pertanyaan User: "${query}"
Citations Terkait: ${JSON.stringify(citations)}
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi):
- Hanya referensikan konten TAM yang tercantum secara nyata di dalam Citations Terkait dan Context TAM.
- Dilarang keras merekomendasikan artikel, seri, buku, website, atau sumber eksternal lain yang tidak ada dalam data di atas.
- Jelaskan bagaimana konten TAM tersebut menjawab dilema pengguna secara esensial. Tulis dalam 2 paragraf padat.`;

  const executionPrompt = `Anda adalah Execution Synthesizer Agent dari TAMI. Berdasarkan pertanyaan pengguna dan konteks berikut, susunlah 3 rencana aksi nyata (action steps) untuk pengguna.
Pertanyaan User: "${query}"
Context TAM: "${contextText}"

Aturan Penting (Anti-Halusinasi & Realisme):
- Rencana aksi harus membumi, sangat realistis, praktis, dan aman dilakukan oleh anak muda.
- Jangan menyarankan konseling klinis/medis kecuali jika terdeteksi indikasi krisis berat.
- Jangan merujuk ke buku atau mentor fiktif/luar context.
- Hasilkan output dalam format JSON yang valid berupa array dari ActionStep:
[
  {
    "timeframe": "1x24_hours" | "30_days" | "90_days",
    "title": "Judul langkah aksi",
    "description": "Deskripsi tindakan konkret dan praktis yang harus dilakukan",
    "expectedObstacle": "Hambatan mental atau realita yang mungkin muncul saat melakukannya"
  }
]`;

  let analystCritique = '';
  let knowledgeIntegration = '';
  let actionPlan: ActionStep[] = [];

  // Run the core agents in parallel to drastically improve response times
  await Promise.all([
    mistral.chat({
      model: modelToUse,
      messages: [{ role: 'user', content: analystPrompt }]
    }).then(res => {
      analystCritique = res.choices[0].message.content;
    }).catch(err => {
      console.error('Analyst Agent failed:', err);
      analystCritique = 'Gagal membedah asumsi pikiran Anda karena kendala pemrosesan.';
    }),

    mistral.chat({
      model: modelToUse,
      messages: [{ role: 'user', content: knowledgePrompt }]
    }).then(res => {
      knowledgeIntegration = res.choices[0].message.content;
    }).catch(err => {
      console.error('Knowledge Agent failed:', err);
      knowledgeIntegration = 'Gagal mengintegrasikan referensi artikel TAM karena kendala pemrosesan.';
    }),

    mistral.chat({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'Anda wajib merespons dalam format JSON yang valid.' },
        { role: 'user', content: executionPrompt }
      ],
      responseFormat: { type: 'json_object' }
    }).then(res => {
      let parsedContent = res.choices[0].message.content.trim();
      // Simple markdown code block cleaner
      if (parsedContent.startsWith('```json')) {
        parsedContent = parsedContent.substring(7, parsedContent.length - 3).trim();
      } else if (parsedContent.startsWith('```')) {
        parsedContent = parsedContent.substring(3, parsedContent.length - 3).trim();
      }
      actionPlan = JSON.parse(parsedContent);
      if (!Array.isArray(actionPlan)) {
        throw new Error('Action plan is not an array');
      }
    }).catch(err => {
      console.error('Execution Agent failed or returned invalid JSON:', err);
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
  const verificationPrompt = `Anda adalah Verifier Agent dari TAMI. Tugas Anda adalah mengaudit analisis kritik, integrasi konten, dan rencana aksi yang dihasilkan oleh agen-agen sebelumnya untuk mencegah halusinasi.
Kritik Analisis: "${analystCritique}"
Integrasi Konten: "${knowledgeIntegration}"
Rencana Aksi: ${JSON.stringify(actionPlan)}
Context TAM: "${contextText}"

Lakukan audit berikut:
1. Pastikan tidak ada referensi ke buku eksternal, website luar, riset fiktif, atau mentor yang tidak disebutkan dalam Context TAM. Jika ada, hapus atau ganti dengan argumen yang berbasis Context TAM.
2. Pastikan rencana aksi sangat praktis dan realistis sesuai anjuran Tamparan Anak Muda.
3. Hasilkan output revisi akhir dalam format JSON:
{
  "analystCritique": "Versi revisi analisis kritik (2 paragraf)",
  "knowledgeIntegration": "Versi revisi integrasi konten (2 paragraf)",
  "actionPlan": [ array dari ActionStep ]
}`;

  let verifiedAnalystCritique = analystCritique;
  let verifiedKnowledgeIntegration = knowledgeIntegration;
  let verifiedActionPlan = actionPlan;

  try {
    const verifierResponse = await mistral.chat({
      model: modelToUse,
      messages: [
        { role: 'system', content: 'Anda wajib merespons dalam format JSON yang valid.' },
        { role: 'user', content: verificationPrompt }
      ],
      responseFormat: { type: 'json_object' }
    });
    let verifiedContent = verifierResponse.choices[0].message.content.trim();
    if (verifiedContent.startsWith('```json')) {
      verifiedContent = verifiedContent.substring(7, verifiedContent.length - 3).trim();
    } else if (verifiedContent.startsWith('```')) {
      verifiedContent = verifiedContent.substring(3, verifiedContent.length - 3).trim();
    }
    const verifiedData = JSON.parse(verifiedContent);
    if (verifiedData.analystCritique) verifiedAnalystCritique = verifiedData.analystCritique;
    if (verifiedData.knowledgeIntegration) verifiedKnowledgeIntegration = verifiedData.knowledgeIntegration;
    if (Array.isArray(verifiedData.actionPlan)) verifiedActionPlan = verifiedData.actionPlan;
  } catch (error) {
    console.error('Failed to run verification step or parse JSON, proceeding with original debate results:', error);
  }

  // 4. Executive Synthesis for Conversational Reply
  const synthesisPrompt = `Anda adalah TAMI (Tamparan Anak Muda Indonesia), asisten kecerdasan kognitif yang realistis, tajam, dan edukatif untuk anak muda Indonesia.
Tugas Anda adalah merangkum seluruh analisis di bawah ini menjadi balasan percakapan (conversational reply) yang mengalir, mencerahkan, dan memberikan tamparan realita yang jujur namun membangun.

Pertanyaan User: "${query}"
Context TAM: "${contextText}"
Hasil Analisis Kritik: "${verifiedAnalystCritique}"
Integrasi Konten TAM: "${verifiedKnowledgeIntegration}"
Rencana Aksi: ${JSON.stringify(verifiedActionPlan)}

Aturan Penting (Anti-Halusinasi & Batasan Konteks):
1. Anda wajib melandaskan seluruh isi argumen pada "Context TAM" di atas. Jangan mengarang teori, riset, atau statistik fiktif.
2. Jangan pernah menyarankan buku, situs web, layanan, atau nama mentor eksternal yang tidak disebutkan di dalam Context TAM.
3. Tetaplah berada pada koridor curhat karir, keuangan, tekanan sosial, dan mental anak muda. Jika pertanyaan pengguna sama sekali tidak berkaitan dengan tema ini (misalnya menanyakan baris kode pemrograman, tugas sains, matematika murni, resep makanan, cuaca, dll), jawablah secara tegas, lugas, namun sopan bahwa TAMI hanya didesain untuk mendiagnosis realita hidup dan emosi anak muda, bukan menjawab hal teknis tersebut.
4. Gunakan gaya bahasa Indonesia yang kasual namun tegas, realistis, dan berbobot. Berikan tamparan keras yang menyadarkan mereka dari ilusi, lalu arahkan mereka untuk membaca rekomendasi artikel/seri yang dicantumkan.
5. Tulis respon dalam format Markdown. Jangan sebutkan nama-nama agen internal (Analyst, Knowledge, Execution, Verifier), bicaralah langsung sebagai TAMI secara utuh.
6. Untuk merujuk pada artikel/seri TAM yang relevan di dalam teks, wajib gunakan format link internal yang tepat: \`[Judul Artikel](/artikel/slug-artikel)\` untuk esai/artikel atau \`[Judul Seri](/seri/slug-seri)\` untuk seri investigasi. Pastikan slug yang Anda gunakan sama persis dengan yang ada pada rekomendasi artikel/konteks TAM. Jangan pernah mengarang slug atau URL baru.`;

  const finalResponse = await mistral.chat({
    model: modelToUse,
    messages: [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: synthesisPrompt }
    ]
  });

  const rawConversationalReply = finalResponse.choices[0].message.content;

  // Run Fact & Citation Guardrail to sanitize markdown links and citations
  const validated = validateTamiFacts(
    rawConversationalReply,
    citations,
    searchResults.map(r => r.chunk)
  );

  const suggestions = generateQuickSuggestions(query, diagnosis.mindState.primaryEmotion, diagnosis.diagnosis.cognitiveDistortion);

  return {
    mindState: diagnosis.mindState,
    diagnosis: diagnosis.diagnosis,
    actionPlan: verifiedActionPlan,
    citations: validated.sanitizedCitations,
    conversationalReply: validated.sanitizedReply,
    suggestions,
    escalationUrl: whatsappEscalationUrl
  };
}
export async function streamTamiReply(
  query: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  cognitiveData: Omit<TamiCognitiveResponse, 'conversationalReply'>
): Promise<ReadableStream> {
  const synthesisPrompt = `Anda adalah TAMI (Tamparan Anak Muda Intelligence), asisten kecerdasan kognitif yang realistis, tajam, dan edukatif untuk anak muda Indonesia.
Gunakan data kognitif, hasil diagnosis, dan referensi context berikut untuk memberikan respon streaming langsung (conversational reply) kepada pengguna.

Pertanyaan User: "${query}"
Diagnosa Masalah: "${cognitiveData.diagnosis.rootCauseAnalysis}"
Tamparan Realita: "${cognitiveData.diagnosis.realityCheckVerdict}"
Rencana Aksi: ${JSON.stringify(cognitiveData.actionPlan)}
Rekomendasi Artikel TAM: ${JSON.stringify(cognitiveData.citations)}

Aturan Penting (Anti-Halusinasi & Batasan Konteks):
1. Seluruh pernyataan Anda harus selaras dengan rekomendasi artikel TAM yang disediakan. Jangan mengarang referensi eksternal, buku luar, atau fakta/statistik yang tidak berdasar.
2. Jika pertanyaan di luar domain karir/keuangan/tekanan hidup anak muda (seperti tugas sekolah, resep makanan, koding, cuaca, dll), sampaikan secara tegas dan lugas bahwa TAMI hanya membahas realita hidup anak muda.
3. Gunakan gaya bahasa Indonesia yang kasual namun tegas, realistis, dan berbobot.
4. Ketika menyisipkan tautan (link) ke artikel/seri TAM di dalam balasan chat, Anda wajib menggunakan format \`[Judul Artikel](/artikel/slug-artikel)\` atau \`[Judul Seri](/seri/slug-seri)\` sesuai persis dengan slug yang disediakan di bagian Rekomendasi Artikel TAM. Jangan pernah menggunakan link eksternal atau memodifikasi jalurnya.`;

  return mistral.chatStream({
    messages: [
      ...history.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: synthesisPrompt }
    ]
  });
}
