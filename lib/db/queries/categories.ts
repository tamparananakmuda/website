import { db } from '@/lib/db';
import { categories, subcategories } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import type { Category, CategoryWithSubcategories, Subcategory } from '@/lib/db/schema';

export async function getAllCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.title));
}

export async function getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
  const result = await db.query.categories.findMany({
    with: { subcategories: true },
  });
  return result as CategoryWithSubcategories[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
  return db.select().from(subcategories)
    .where(eq(subcategories.categoryId, categoryId))
    .orderBy(asc(subcategories.sortOrder));
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  return db.select().from(subcategories).orderBy(asc(subcategories.title));
}

export async function getCategoryWithSubcategoriesBySlug(slug: string): Promise<CategoryWithSubcategories | undefined> {
  const result = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
    with: { subcategories: true },
  });
  return result as CategoryWithSubcategories | undefined;
}

export async function getCategoriesForSitemap(): Promise<{ slug: string; updatedAt: string | null }[]> {
  return db.select({ slug: categories.slug, updatedAt: categories.updatedAt }).from(categories);
}

export async function getSubcategoriesForSitemap(): Promise<{ slug: string; categoryId: string }[]> {
  return db.select({ slug: subcategories.slug, categoryId: subcategories.categoryId }).from(subcategories);
}
