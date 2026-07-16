import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { callAI, TAM_SYSTEM_PROMPT, aiErrorResponse } from '@/lib/ai/helper';
import { aiIdeasSchema } from '@/lib/validations/ai';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const parsed = await parseRequestBody(request, aiIdeasSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { pillar, keyword, pov_tag, count } = parsed.data;

    const userPrompt = `Buat ${count || 5} ide artikel untuk TAM.

Pillar: ${pillar || 'bebas'}
${keyword ? `Keyword inspirasi: ${keyword}` : ''}
${pov_tag ? `POV tag: ${pov_tag}` : ''}

Format output JSON array:
[
  {
    "title": "judul artikel",
    "angle": "1-2 kalimat angle unik TAM",
    "pov_tag": "salah satu dari 9 POV tags",
    "target_keyword": "keyword utama untuk SEO"
  }
]

Aturan:
- Judul provokatif tapi jujur, max 70 karakter
- Angle harus berbeda dari artikel generik di Google
- Setiap ide harus bisa dijawab dengan formula Tamparan-Penjelasan-Solusi
- Bahasa Indonesia
- Jangan pakai em-dash`;

    const content = await callAI([
      { role: 'system', content: TAM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.8 });

    let ideas: unknown[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      ideas = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      ideas = [];
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
