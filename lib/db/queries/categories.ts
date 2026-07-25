import {
  categories as categoriesConfig,
  subcategories as subcategoriesConfig,
  getCategoryBySlug,
  getSubcategoriesByCategorySlug,
  type CategoryConfig,
  type SubcategoryConfig,
} from '@/content/config';
import type { Category, CategoryWithSubcategories, Subcategory } from '@/lib/db/schema';

function configToCategory(c: CategoryConfig): Category {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    color: c.color,
    createdAt: '2026-07-01 12:38:03.617726+00',
    updatedAt: '2026-07-01 13:49:07.459295+00',
  };
}

function configToSubcategory(s: SubcategoryConfig): Subcategory {
  return {
    id: s.id,
    categoryId: s.categoryId,
    title: s.title,
    slug: s.slug,
    description: s.description,
    sortOrder: s.sortOrder,
    createdAt: '2026-07-15 01:49:28.306176+00',
  };
}

export async function getAllCategories(): Promise<Category[]> {
  return categoriesConfig.map(configToCategory);
}

export async function getCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
  return categoriesConfig.map((c) => ({
    ...configToCategory(c),
    subcategories: subcategoriesConfig
      .filter((s) => s.categoryId === c.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(configToSubcategory),
  }));
}

export async function getCategoryBySlugAsync(slug: string): Promise<Category | undefined> {
  const c = getCategoryBySlug(slug);
  return c ? configToCategory(c) : undefined;
}

export async function getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
  return subcategoriesConfig
    .filter((s) => s.categoryId === categoryId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(configToSubcategory);
}

export async function getAllSubcategories(): Promise<Subcategory[]> {
  return subcategoriesConfig.map(configToSubcategory);
}

export async function getCategoryWithSubcategoriesBySlug(slug: string): Promise<CategoryWithSubcategories | undefined> {
  const c = getCategoryBySlug(slug);
  if (!c) return undefined;
  return {
    ...configToCategory(c),
    subcategories: getSubcategoriesByCategorySlug(slug).map(configToSubcategory),
  };
}

export async function getCategoriesForSitemap(): Promise<{ slug: string; updatedAt: string | null }[]> {
  return categoriesConfig.map((c) => ({ slug: c.slug, updatedAt: '2026-07-01 13:49:07.459295+00' }));
}

export async function getSubcategoriesForSitemap(): Promise<{ slug: string; categoryId: string }[]> {
  return subcategoriesConfig.map((s) => ({ slug: s.slug, categoryId: s.categoryId }));
}

export { getCategoryBySlugAsync as getCategoryBySlug };
