import type { Metadata } from 'next';
import { SearchForm } from './search-form';

export const metadata: Metadata = {
  title: 'Cari Artikel',
  description: 'Cari artikel dan perspektif dari TAMPARAN ANAK MUDA.',
  robots: { index: false, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/cari`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/cari`,
    title: 'Cari Artikel - Tamparan Anak Muda',
    description: 'Cari artikel dan perspektif dari TAMPARAN ANAK MUDA.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cari Artikel - Tamparan Anak Muda',
    description: 'Cari artikel dan perspektif dari TAMPARAN ANAK MUDA.',
  },
};

export default function SearchPage() {
  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">
          Cari artikel
        </h1>
        <p className="mb-8 text-muted-foreground">
          Ketik kata kunci untuk mencari artikel dari TAM.
        </p>
        <SearchForm />
      </div>
    </main>
  );
}
