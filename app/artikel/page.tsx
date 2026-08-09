import { Metadata } from 'next';
import { getPublishedPostsWithPagination } from '@/lib/db/queries/posts';
import { ArticleCard } from '@/components/article-card';
import { Pagination } from '@/components/pagination';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

export const revalidate = 60;

const PER_PAGE = 9;

interface ArticlesPageProps {
  searchParams: { page?: string };
}

export async function generateMetadata({ searchParams }: ArticlesPageProps): Promise<Metadata> {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10) || 1);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const baseUrl = `${siteUrl}/artikel`;
  const canonicalUrl = page > 1 ? `${baseUrl}?page=${page}` : baseUrl;
  const ogImageUrl = 'https://cdn.tamparananakmuda.com/og/homepage-feature.webp';

  const title = page > 1 ? `Semua Artikel - Halaman ${page}` : 'Semua Artikel';
  const description = 'Kumpulan perspektif jujur untuk anak muda Indonesia tentang mindset, bisnis, keuangan, teknologi, dan kehidupan.';

  const alternates: Metadata['alternates'] = {
    canonical: canonicalUrl,
  };

  if (page > 1) {
    alternates.types = {
      'text/html': [
        { url: `${baseUrl}?page=${page - 1}`, title: 'Halaman sebelumnya' },
      ],
    };
  }

  return {
    title,
    description,
    keywords: ['artikel gen z', 'artikel anak muda', 'perspektif gen z', 'tamparan anak muda', 'mindset', 'karier', 'keuangan', 'teknologi', 'kehidupan', 'bisnis'],
    robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
    alternates,
    openGraph: {
      type: 'website',
      locale: 'id_ID',
      url: canonicalUrl,
      title: `${title} - Tamparan Anak Muda`,
      description,
      siteName: 'TAMPARAN ANAK MUDA',
      images: [{ url: ogImageUrl, width: 1600, height: 900, alt: 'Semua Artikel - TAMPARAN ANAK MUDA' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Tamparan Anak Muda`,
      description,
      images: [ogImageUrl],
    },
  };
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
