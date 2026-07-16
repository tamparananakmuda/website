import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getReaderProfile, getReadingHistory } from '@/lib/db/queries/reader';
import { getBookmarksByUser } from '@/lib/db/queries/bookmarks';
import { getDonationsByEmail } from '@/lib/db/queries/donations';
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

  const profile = await getReaderProfile(user.id);
  const bookmarks = await getBookmarksByUser(user.id, 10);
  const history = await getReadingHistory(user.id, 10);
  const donations = await getDonationsByEmail(user.email || '', 5);

  return (
    <ReaderDashboard
      profile={profile ?? null}
      bookmarks={bookmarks || []}
      history={history || []}
      donations={donations || []}
      email={user.email || ''}
    />
  );
}
