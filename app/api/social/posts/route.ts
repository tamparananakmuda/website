import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { socialPostUpdateSchema } from '@/lib/validations/social';
import { rateLimit, rateLimitResponse } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const platform = searchParams.get('platform');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 50);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    let query = supabase
      .from('social_posts')
      .select('*')
      .order('published_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (status !== 'all') {
      query = query.eq('status', status);
    }
    if (platform && ['x', 'instagram', 'tiktok', 'youtube'].includes(platform)) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ posts: data || [] });
  } catch (error) {
    console.error('Social posts list error:', error);
    return NextResponse.json(
      { error: 'Gagal mengambil data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 20,
      window: 60,
      identifier: 'social-posts-update',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const body = await request.json();
    const parsed = socialPostUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Input tidak valid' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { id, ...updates } = parsed.data;
    const { error } = await supabase
      .from('social_posts')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post update error:', error);
    return NextResponse.json(
      { error: 'Gagal update konten' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const limit = await rateLimit(request, {
      limit: 10,
      window: 60,
      identifier: 'social-posts-delete',
    });
    if (!limit.success) {
      return rateLimitResponse(limit);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID wajib diisi' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { error } = await supabase
      .from('social_posts')
      .delete()
      .eq('id', parseInt(id, 10));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Social post delete error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus konten' },
      { status: 500 }
    );
  }
}
