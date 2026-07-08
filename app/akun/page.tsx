import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReaderDashboard from './reader-dashboard';

export const metadata = {
  title: 'Akun Saya',
  description: 'Dashboard reader TAMPARAN ANAK MUDA',
};

export default async function AkunPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/masuk?next=/akun');
  }

  const { data: profile } = await supabase
    .from('reader_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select(`
      post_id,
      created_at,
      posts(id, title, slug, excerpt, category_id, categories(name, slug))
    `)
    .eq('reader_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const { data: history } = await supabase
    .from('reading_history')
    .select(`
      post_id,
      read_at,
      progress,
      posts(id, title, slug, excerpt, category_id, categories(name, slug))
    `)
    .eq('reader_id', user.id)
    .order('read_at', { ascending: false })
    .limit(10);

  const { data: donations } = await supabase
    .from('donations')
    .select('transaction_id, amount, status, payment_type, created_at')
    .eq('customer_email', user.email || '')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <ReaderDashboard
      profile={profile}
      bookmarks={bookmarks || []}
      history={history || []}
      donations={donations || []}
      email={user.email || ''}
    />
  );
}
