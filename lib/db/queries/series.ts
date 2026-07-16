import { db } from '@/lib/db';
import { series } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { Series } from '@/lib/db/schema';

export async function getAllSeries(): Promise<Series[]> {
  return db.select().from(series).orderBy(asc(series.title));
}

export async function getSeriesBySlug(slug: string): Promise<Series | undefined> {
  const result = await db.select().from(series).where(eq(series.slug, slug)).limit(1);
  return result[0];
}
