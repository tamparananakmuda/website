import { createClient } from '@/lib/supabase/server';
import { isReaderAdmin } from '@/lib/db/queries/reader';

export interface AuthContext {
  userId: string | null;
  email: string | null;
  isAdmin: boolean;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    return { userId: null, email: null, isAdmin: false };
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  let isAdmin = adminEmails.includes(user.email ?? '');

  if (!isAdmin) {
    isAdmin = await isReaderAdmin(user.id);
  }

  return {
    userId: user.id,
    email: user.email ?? null,
    isAdmin,
  };
}

export async function requireAuth(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx.userId) {
    throw new Error('UNAUTHORIZED');
  }
  return ctx;
}

export async function requireAdmin(): Promise<AuthContext> {
  const ctx = await requireAuth();
  if (!ctx.isAdmin) {
    throw new Error('FORBIDDEN');
  }
  return ctx;
}
