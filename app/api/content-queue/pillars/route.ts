import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkAdminAuth } from '@/lib/auth/admin-check';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await checkAdminAuth();
  if (!auth.isAdmin) return auth.response;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('subcategories')
      .select('id, title, slug, categories(title)')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    const pillars = (data || []).map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      category_title: (s as unknown as { categories?: { title: string }[] })?.categories?.[0]?.title,
    }));

    return NextResponse.json({ pillars });
  } catch (error) {
    console.error('Pillars fetch error:', error);
    return NextResponse.json({ pillars: [] }, { status: 500 });
  }
}
