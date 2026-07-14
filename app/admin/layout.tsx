import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Admin - Import Konten Sosial',
  description: 'Import konten sosial media ke TAM',
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
            <nav className="flex gap-4 text-sm">
              <Link href="/admin/import" className="text-primary font-medium">Import Sosial</Link>
              <Link href="/admin/posts" className="text-muted-foreground hover:text-foreground">Kelola Posts</Link>
            </nav>
          </div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Lihat Situs</Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">{children}</div>
    </div>
  );
}
