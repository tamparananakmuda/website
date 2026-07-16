import { NextResponse } from 'next/server';
import { getAllCategories } from '@/lib/db/queries/categories';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  try {
    const cats = await getAllCategories();
    return NextResponse.json(cats);
  } catch {
    return NextResponse.json([]);
  }
}
