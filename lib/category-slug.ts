import type { Category } from "@/types/category";

export function toCategorySlug(name?: string | null): string {
  return (name ?? "").toLowerCase().trim().replaceAll(" ", "-");
}

/** Prefer English name for stable URLs (matches CategoryCard / collections page). */
export function getCategorySlug(category: Category): string {
  const enName = category.translations?.find(
    (translation) => translation.language === "en"
  )?.name;
  return toCategorySlug(enName || category.name);
}

/** Nested children — supports common API field variants. */
export function getCategoryChildren(category: Category | null | undefined): Category[] {
  if (!category) return [];
  const raw = category as Category & {
    children?: Category[];
    subCategories?: Category[];
    subcategory?: Category[];
  };
  return (
    raw.subcategories ??
    raw.subCategories ??
    raw.children ??
    raw.subcategory ??
    []
  );
}

export function findCategoryBySlug(
  categories: Category[] | undefined,
  slug?: string | null
): Category | undefined {
  if (!categories?.length || !slug) return undefined;
  const normalized = toCategorySlug(slug);
  return categories.find((category) => getCategorySlug(category) === normalized);
}

/**
 * Walks category path [main, sub, nested, ...] and returns the deepest match.
 * First segment is matched against roots; each next segment among that node's children.
 */
export function findCategoryBySlugPath(
  roots: Category[] | undefined,
  slugPath: string[] | undefined
): Category | undefined {
  if (!roots?.length || !slugPath?.length) return undefined;

  let current: Category | undefined = findCategoryBySlug(roots, slugPath[0]);
  if (!current) return undefined;

  for (let i = 1; i < slugPath.length; i++) {
    const next = findCategoryBySlug(getCategoryChildren(current), slugPath[i]);
    if (!next) return current;
    current = next;
  }

  return current;
}

export function getCategoryDisplayName(
  category: Category,
  locale: string
): string {
  const translation =
    category.translations?.find((t) => t.language === locale) ||
    category.translations?.find((t) => t.language === "en");
  return translation?.name || category.name || getCategorySlug(category);
}
