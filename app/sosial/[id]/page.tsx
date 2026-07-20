import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublishedSocialPostById, getRelatedSocialPosts } from '@/lib/db/queries/social-posts';
import SocialDetail from './social-detail';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedSocialPostById(params.id);

  if (!post) return { title: 'Konten tidak ditemukan' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/sosial/${params.id}`;
  const title = post.title || `Konten ${post.platform.toUpperCase()} - TAM`;

  return {
    title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'id_ID',
      url,
      title,
      description: post.excerpt || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: post.excerpt || undefined,
    },
  };
}

export const revalidate = 300;

export default async function SocialPostPage({ params }: Props) {
  const post = await getPublishedSocialPostById(params.id);

  if (!post) notFound();

  const related = await getRelatedSocialPosts(post.platform, post.id, 4);

  return (
    <main className="container mx-auto px-4 py-12">
      <BreadcrumbSchema items={[
        { name: 'Home', href: '/' },
        { name: 'Konten Sosial', href: '/sosial' },
        { name: post.title || 'Konten', href: `/sosial/${params.id}` },
      ]} />
      <div className="mb-4">
        <Link href="/sosial" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Semua konten sosial
        </Link>
      </div>
      <SocialDetail post={post} related={related || []} />
    </main>
  );
}
