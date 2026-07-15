import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AdminNav } from '@/components/admin-nav';

export const metadata: Metadata = {
  title: 'Admin - TAMPARAN ANAK MUDA',
  description: 'Dashboard admin TAM',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk?next=/admin');
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((e) => e.trim()) ?? [];
  const isAdminByEmail = adminEmails.length > 0 && adminEmails.includes(user.email ?? '');

  if (!isAdminByEmail) {
    const { data: profile } = await supabase
      .from('reader_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      redirect('/');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-foreground">TAM Admin</span>
            <AdminNav />
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Lihat Situs</Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
