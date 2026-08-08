import { getPublishedPostsWithPagination } from '@/lib/db/queries/posts';
import { ArticleCard } from '@/components/article-card';
import { Pagination } from '@/components/pagination';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

export const revalidate = 60;

const PER_PAGE = 9;

export const metadata = {
  title: 'Semua Artikel',
  description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  keywords: ['artikel gen z', 'artikel anak muda', 'perspektif gen z', 'tamparan anak muda', 'mindset', 'karier', 'keuangan', 'teknologi', 'kehidupan', 'bisnis'],
  robots: { index: true, follow: true },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/artikel`,
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com'}/artikel`,
    title: 'Semua Artikel - Tamparan Anak Muda',
    description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Semua Artikel - Tamparan Anak Muda',
    description: 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.',
  },
};

interface ArticlesPageProps {
  searchParams: { page?: string };
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const { posts, total, totalPages } = await getPublishedPostsWithPagination(page, PER_PAGE);

  return (
    <main className="container mx-auto px-4 py-20 md:py-32">
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Artikel', href: '/artikel' }]} />
      <header className="mb-12 max-w-2xl">
        <h1 className="mb-4 font-display text-3xl font-semibold md:text-4xl">
          Semua Artikel
        </h1>
        <p className="text-lg text-muted-foreground">
          Kumpulan perspektif jujur untuk anak muda yang lagi berproses.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/70">
          {total} artikel
        </p>
      </header>

      {posts && posts.length > 0 ? (
        <>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} basePath="/artikel" />
        </>
      ) : (
        <p className="text-muted-foreground">
          Belum ada artikel yang dipublish. Nantikan konten pertama kami.
        </p>
      )}
    </main>
  );
}
