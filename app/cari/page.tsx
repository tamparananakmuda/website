import type { Metadata } from 'next';
import { SearchForm } from './search-form';

export const metadata: Metadata = {
  title: 'Cari Artikel',
  description: 'Cari artikel dan perspektif dari TAMPARAN ANAK MUDA.',
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
