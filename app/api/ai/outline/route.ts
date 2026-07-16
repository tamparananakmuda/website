import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';
import { callAI, TAM_SYSTEM_PROMPT, aiErrorResponse } from '@/lib/ai/helper';
import { aiOutlineSchema } from '@/lib/validations/ai';
import { parseRequestBody } from '@/lib/validations/helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const parsed = await parseRequestBody(request, aiOutlineSchema);
    if (!parsed.success) return parsed.errorResponse;

    const { title, pillar, pov_tag, target_keyword } = parsed.data;

    const userPrompt = `Buat outline artikel TAM berdasarkan info berikut:

Judul: ${title}
Pillar: ${pillar || 'bebas'}
POV Tag: ${pov_tag || 'bebas'}
Target Keyword: ${target_keyword || 'bebas'}

Format output JSON:
{
  "seo_title": "SEO title max 70 karakter",
  "meta_description": "meta description max 160 karakter",
  "hook": "1-2 kalimat pembuka yang tajam",
  "tamparan": "ilusi apa yang dibongkar, 2-3 kalimat",
  "penjelasan": [
    {"point": "judul point", "detail": "penjelasan dengan data/contoh"},
    {"point": "judul point", "detail": "penjelasan dengan data/contoh"},
    {"point": "judul point", "detail": "penjelasan dengan data/contoh"}
  ],
  "solusi": [
    "action item 1 yang spesifik",
    "action item 2 yang spesifik",
    "action item 3 yang spesifik"
  ],
  "penutup": "1-2 kalimat penutup yang bertahan",
  "internal_link_suggestions": ["topik artikel 1 yang relevan", "topik artikel 2 yang relevan"]
}

Aturan:
- Hook bukan pertanyaan retoris, bukan quote motivasi
- Tamparan harus membongkar ilusi yang dipercaya banyak orang
- Penjelasan harus butuh data/contoh nyata (tulis [DATA: ...] sebagai placeholder)
- Solusi harus actionable, bukan "semangat ya"
- Bahasa Indonesia, jangan em-dash`;

    const content = await callAI([
      { role: 'system', content: TAM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ], { temperature: 0.6 });

    let outline: Record<string, unknown> | null = null;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      outline = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      outline = null;
    }

    return NextResponse.json({ outline });
  } catch (error) {
    return aiErrorResponse(error);
  }
}
