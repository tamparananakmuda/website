import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun TAM kamu untuk menyimpan artikel dan melihat riwayat baca.',
  robots: { index: false, follow: false },
};

export default function MasukLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
