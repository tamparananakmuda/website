import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

type AdminAuthSuccess = { isAdmin: true; response: null };
type AdminAuthFailure = { isAdmin: false; response: NextResponse };
type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

export async function checkAdminAuth(): Promise<AdminAuthResult> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      isAdmin: false,
      response: NextResponse.json(
        { error: 'Tidak terautentikasi' },
        { status: 401 }
      ),
    };
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];

  if (adminEmails.length > 0 && adminEmails.includes(user.email ?? '')) {
    return { isAdmin: true, response: null };
  }

  const { data: profile } = await supabase
    .from('reader_profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (profile?.is_admin) {
    return { isAdmin: true, response: null };
  }

  return {
    isAdmin: false,
    response: NextResponse.json(
      { error: 'Akses ditolak' },
      { status: 403 }
    ),
  };
}
