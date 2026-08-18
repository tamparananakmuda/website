import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthorBySlug } from '@/content/config';
import { getPostsByAuthorSlug } from '@/lib/db/queries/posts';
import { ArticleCard } from '@/components/article-card';
import { BreadcrumbSchema } from '@/components/schema/breadcrumb-schema';
import { ArrowLeft, FileText, Globe, Instagram, Twitter, Linkedin } from 'lucide-react';

interface AuthorPageProps {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata> {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    return { title: 'Penulis Tidak Ditemukan' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tamparananakmuda.com';
  const url = `${siteUrl}/penulis/${author.slug}`;

  return {
    title: `${author.name} - Tamparan Anak Muda`,
    description: author.bio || `Artikel oleh ${author.name} di TAMPARAN ANAK MUDA.`,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'profile',
      locale: 'id_ID',
      url,
      title: `${author.name} - Tamparan Anak Muda`,
      description: author.bio || `Artikel oleh ${author.name} di TAMPARAN ANAK MUDA.`,
      siteName: 'TAMPARAN ANAK MUDA',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${author.name} - Tamparan Anak Muda`,
      description: author.bio || `Artikel oleh ${author.name} di TAMPARAN ANAK MUDA.`,
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const author = getAuthorBySlug(params.slug);

  if (!author) {
    notFound();
  }

  const posts = await getPostsByAuthorSlug(author.slug, 30);

  const socialLinks = [
    { icon: Instagram, url: author.socialInstagram, label: 'Instagram' },
    { icon: Twitter, url: author.socialTwitter, label: 'Twitter/X' },
    { icon: Linkedin, url: author.socialLinkedin, label: 'LinkedIn' },
    { icon: Globe, url: author.socialWebsite, label: 'Website' },
  ].filter((s): s is { icon: typeof Instagram; url: string; label: string } => Boolean(s.url));

  return (
    <main>
      <BreadcrumbSchema items={[{ name: 'Home', href: '/' }, { name: 'Penulis', href: '/penulis' }, { name: author.name, href: `/penulis/${author.slug}` }]} />

      {/* Hero */}
      <section className="relative w-full overflow-hidden border-b border-border">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-[#0A0A0A] to-[#141414]" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 15%, #D13A3A 0%, transparent 50%), radial-gradient(circle at 85% 85%, #D13A3A30 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 md:py-28 lg:py-32">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft size={15} />
            Beranda
          </Link>

          {/* Avatar */}
          {author.avatarUrl && (
            <div className="mb-6">
              <Image
                src={author.avatarUrl}
                alt={author.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full border-2 border-white/20 object-cover"
              />
            </div>
          )}

          {/* Name */}
          <h1 className="mb-2 font-display text-3xl font-bold leading-[1.1] tracking-tight text-white md:text-4xl lg:text-5xl">
            {author.name}
          </h1>

          {/* Job Title */}
          {author.jobTitle && (
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-white/50">
              {author.jobTitle}
            </p>
          )}

          {/* Bio */}
          {author.bio && (
            <p className="max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
              {author.bio}
            </p>
          )}

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map(({ icon: Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
                  aria-label={label}
                >
                  <Icon size={14} />
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-24">
        {posts && posts.length > 0 ? (
          <>
            <h2 className="mb-8 font-display text-xl font-bold text-foreground">
              Artikel ({posts.length})
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText size={40} className="mb-4 text-muted-foreground/40" />
            <p className="text-muted-foreground">
              Belum ada artikel dari penulis ini.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
