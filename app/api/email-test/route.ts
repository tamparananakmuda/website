import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/client';
import { renderDigestEmail } from '@/lib/email/templates/article-notification';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const testEmail = request.nextUrl.searchParams.get('email');
  const template = request.nextUrl.searchParams.get('template') || 'basic';

  if (!testEmail) {
    return NextResponse.json({ error: 'Parameter email wajib diisi. Contoh: ?email=kamu@email.com' }, { status: 400 });
  }

  let subject: string;
  let htmlContent: string;
  let tags: string[];

  if (template === 'article') {
    const result = renderDigestEmail({
      articles: [
        {
          title: 'Hustle Culture: Kenapa Gen Z Berhenti Berlari',
          slug: 'hustle-culture-kenapa-gen-z-berhenti-berlari',
          excerpt: 'Sekitar 60% Gen Z sekarang menolak hustle culture. Mereka memilih work-life balance daripada kerja 60 jam seminggu. Apakah ini kemunduran atau kematangan?',
          categoryTitle: 'Kehidupan',
          categoryColor: '#10b981',
          categorySlug: 'kehidupan',
          authorName: 'Yovie Setiawan',
          readingTime: 6,
          isPremium: false,
          isSponsored: false,
        },
        {
          title: 'Viral Bukan Bisnis: Kenapa Bisnis Gen Z Cepat Meledak Lalu Cepat Mati',
          slug: 'viral-bukan-bisnis-kenapa-bisnis-gen-z-cepat-meledak-lalu-cepat-mati',
          excerpt: 'Ribuan bisnis Gen Z lahir dari viralitas TikTok, lalu mati dalam 6 bulan. Data menunjukkan hanya 12% yang bertahan lebih dari setahun. Apa yang salah?',
          categoryTitle: 'Bisnis',
          categoryColor: '#f59e0b',
          categorySlug: 'bisnis',
          authorName: 'Yovie Setiawan',
          readingTime: 8,
          isPremium: true,
          isSponsored: false,
        },
        {
          title: 'Perbandingan Diri di Era Media Sosial: Kenapa Kamu Merasa Tidak Cukup',
          slug: 'perbandingan-diri-era-media-sosial',
          excerpt: 'Setiap kali kamu scroll Instagram, otakmu memproses 227 kali lebih banyak informasi sosial dibanding 30 tahun lalu. Efeknya: kecemasan kronis dan perasaan tidak pernah cukup.',
          categoryTitle: 'Mindset',
          categoryColor: '#8b5cf6',
          categorySlug: 'mindset',
          authorName: 'Yovie Setiawan',
          readingTime: 5,
          isPremium: false,
          isSponsored: false,
        },
      ],
      unsubscribeToken: 'test-token-00000000-0000-0000-0000-000000000000',
    });
    subject = result.subject;
    htmlContent = result.html;
    tags = ['article-notification', 'test'];
  } else {
    subject = 'Test Email - TAM Email System';
    htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-left: 4px solid #e11d48; padding-left: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: #e11d48; margin: 0 0 4px 0; font-weight: 600;">TAMPARAN ANAK MUDA</p>
        </div>
        <h2 style="color: #1a1a1a; font-size: 24px; margin-bottom: 16px;">Test Email Berhasil</h2>
        <p style="color: #333; font-size: 16px; line-height: 1.6;">
          Email system TAM berfungsi dengan baik.
        </p>
        <p style="color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
          TAMPARAN ANAK MUDA<br>
          tamparananakmuda.com
        </p>
      </div>
    `;
    tags = ['test'];
  }

  const result = await sendEmail({
    to: testEmail,
    subject,
    htmlContent,
    tags,
  });

  if (result.success) {
    return NextResponse.json({ success: true, message: `Test email (${template}) sent to ${testEmail}`, messageId: result.messageId });
  }

  return NextResponse.json({ success: false, error: result.error }, { status: 500 });
}
