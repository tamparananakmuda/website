import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateReaderProfile } from '@/lib/db/queries/reader';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';
import { parseRequestBody } from '@/lib/validations/helpers';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const profileUpdateSchema = z.object({
  name: z.string().trim().max(100).optional(),
});

export async function PATCH(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'profile-update',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      );
    }

    const parsed = await parseRequestBody(request, profileUpdateSchema);
    if (!parsed.success) return parsed.errorResponse;

    const updateData: Record<string, unknown> = {};
    if (parsed.data.name !== undefined) updateData.name = parsed.data.name;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: true });
    }

    await updateReaderProfile(user.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Gagal update profil' },
      { status: 500 }
    );
  }
}
