import { createClient } from '@/lib/supabase/server';
import { isReaderAdmin } from '@/lib/db/queries/reader';
import { NextResponse } from 'next/server';

type AdminAuthSuccess = { isAdmin: true; response: null };
type AdminAuthFailure = { isAdmin: false; response: NextResponse };
type AdminAuthResult = AdminAuthSuccess | AdminAuthFailure;

export async function checkAdminAuth(): Promise<AdminAuthResult> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

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

  const isAdmin = await isReaderAdmin(user.id);

  if (isAdmin) {
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
