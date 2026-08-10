"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getCategories } from "@/lib/api/categories";
import {
  findCategoryBySlug,
  getCategoryChildren,
  getCategoryDisplayName,
  getCategorySlug,
  toCategorySlug,
} from "@/lib/category-slug";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

function getCollectionSlugs(pathname: string): string[] {
  const parts = pathname.split("/").filter(Boolean);
  const collectionsIndex = parts.indexOf("collections");
  if (collectionsIndex === -1) return [];
  return parts.slice(collectionsIndex + 1).map(toCategorySlug);
}

type CategoryTreeItemProps = {
  category: Category;
  locale: string;
  hrefBase: string;
  activeSlugs: string[];
  parentSlugs: string[];
  depth?: number;
  onNavigate?: () => void;
};

function CategoryTreeItem({
  category,
  locale,
  hrefBase,
  activeSlugs,
  parentSlugs,
  depth = 0,
  onNavigate,
}: CategoryTreeItemProps) {
  const slug = getCategorySlug(category);
  const pathSlugs = [...parentSlugs, slug];
  const children = getCategoryChildren(category);
  const hasChildren = children.length > 0;

  const isActive =
    activeSlugs.length === pathSlugs.length &&
    pathSlugs.every((s, i) => s === activeSlugs[i]);

  const [open, setOpen] = useState(true);
  const href = `${hrefBase}/${pathSlugs.join("/")}`;

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={href}
          onClick={onNavigate}
          className={cn(
            "min-w-0 flex-1 capitalize transition-colors hover:text-primary",
            isActive ? "font-medium text-primary" : "text-gray-500"
          )}
          style={
            depth > 0
              ? { paddingInlineStart: `${depth * 0.75}rem` }
              : undefined
          }
        >
          {getCategoryDisplayName(category, locale)}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            aria-label={open ? "Collapse" : "Expand"}
            aria-expanded={open}
            className="inline-flex size-6 shrink-0 items-center justify-center rounded text-gray-400 transition hover:text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-200",
                open && "rotate-90"
              )}
            />
          </button>
        ) : null}
      </div>

      {hasChildren && open ? (
        <ul className="mt-2 space-y-2">
          {children.map((child) => (
            <CategoryTreeItem
              key={child.id}
              category={child}
              locale={locale}
              hrefBase={hrefBase}
              activeSlugs={activeSlugs}
              parentSlugs={pathSlugs}
              depth={depth + 1}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

type FiltersPanelProps = {
  showTitle?: boolean;
  className?: string;
  scrollClassName?: string;
  onNavigate?: () => void;
  idPrefix?: string;
};

function FiltersPanel({
  showTitle = true,
  className,
  scrollClassName,
  onNavigate,
  idPrefix = "",
}: FiltersPanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const priceMinParam = searchParams.get("priceMin") ?? "";
  const priceMaxParam = searchParams.get("priceMax") ?? "";
  const specialOffer = searchParams.get("specialOffer") === "true";

  const [priceMin, setPriceMin] = useState(priceMinParam);
  const [priceMax, setPriceMax] = useState(priceMaxParam);

  useEffect(() => {
    setPriceMin(priceMinParam);
    setPriceMax(priceMaxParam);
  }, [priceMinParam, priceMaxParam]);

  const slugPath = useMemo(() => getCollectionSlugs(pathname), [pathname]);
  const mainSlug = slugPath[0] ?? "";
  const activeNestedSlugs = slugPath.slice(1);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      try {
        const response = await getCategories({
          depth: 10,
          limit: 999,
        });
        if (!cancelled) {
          setCategories(response?.data ?? []);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const mainCategory = useMemo(
    () => findCategoryBySlug(categories, mainSlug),
    [categories, mainSlug]
  );

  const isMainCategoriesView = !mainSlug;
  const categoryList = isMainCategoriesView
    ? categories
    : getCategoryChildren(mainCategory);

  const hrefBase = isMainCategoriesView
    ? "/shop/products"
    : `/shop/products/${mainSlug}`;
  const activeSlugs = isMainCategoriesView
    ? mainSlug
      ? [mainSlug]
      : []
    : activeNestedSlugs;

  function updateSearchParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (value == null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function applyPriceFilter(nextMin: string, nextMax: string) {
    const params = new URLSearchParams(searchParams.toString());

    const min = nextMin.trim();
    const max = nextMax.trim();

    if (!min) params.delete("priceMin");
    else params.set("priceMin", min);

    if (!max) params.delete("priceMax");
    else params.set("priceMax", max);

    params.set("page", "1");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function onPriceBlur() {
    const currentMin = priceMinParam;
    const currentMax = priceMaxParam;
    if (priceMin === currentMin && priceMax === currentMax) return;
    applyPriceFilter(priceMin, priceMax);
  }

  function onPriceKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  const priceMinId = `${idPrefix}price-min`;
  const priceMaxId = `${idPrefix}price-max`;
  const specialOfferId = `${idPrefix}special-offer`;

  return (
    <div className={cn("border rounded-2xl p-5", className)}>
      {showTitle ? (
        <h3 className="text-lg font-medium pb-3">Filters</h3>
      ) : null}
      <div
        className={cn(
          "max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar divide-y divide-gray-200",
          scrollClassName
        )}
      >
        {isLoading || categoryList.length === 0 ? null : (
          <div className="py-3">
            <ul className="space-y-2 text-sm">
              {categoryList.map((item) => (
                <CategoryTreeItem
                  key={item.id}
                  category={item}
                  locale={locale}
                  hrefBase={hrefBase}
                  activeSlugs={activeSlugs}
                  parentSlugs={[]}
                  onNavigate={onNavigate}
                />
              ))}
            </ul>
          </div>
        )}

        <div className="py-3">
          <label
            htmlFor={specialOfferId}
            className="flex cursor-pointer items-center gap-2.5 text-sm"
          >
            <Checkbox
              id={specialOfferId}
              checked={specialOffer}
              onCheckedChange={(checked) =>
                updateSearchParam(
                  "specialOffer",
                  checked === true ? "true" : "false"
                )
              }
            />
            <span className="font-medium">Discount Products</span>
          </label>
        </div>

        <div className="py-3">
          <p className="mb-3 text-sm font-medium">Price</p>
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label htmlFor={priceMinId} className="text-xs text-gray-500">
                Min
              </Label>
              <Input
                id={priceMinId}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="0"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                onBlur={onPriceBlur}
                onKeyDown={onPriceKeyDown}
                className="h-9"
              />
            </div>
            <span className="mt-6 shrink-0 text-gray-400">–</span>
            <div className="min-w-0 flex-1 space-y-1.5">
              <Label htmlFor={priceMaxId} className="text-xs text-gray-500">
                Max
              </Label>
              <Input
                id={priceMaxId}
                type="number"
                inputMode="decimal"
                min={0}
                step="any"
                placeholder="Any"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onBlur={onPriceBlur}
                onKeyDown={onPriceKeyDown}
                className="h-9"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileFilters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const searchKey = searchParams.toString();

  useEffect(() => {
    setSheetOpen(false);
  }, [pathname, searchKey]);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0 border-border bg-white"
            aria-label="Filters"
          />
        }
      >
        <SlidersHorizontal className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex max-h-[85dvh] flex-col gap-0 rounded-t-2xl p-0 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-muted" />
        <SheetHeader className="border-b border-border px-5 py-3 text-start">
          <SheetTitle className="text-lg">Filters</SheetTitle>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6">
          <FiltersPanel
            showTitle={false}
            className="border-0 p-0"
            scrollClassName="max-h-none"
            idPrefix="mobile-"
            onNavigate={() => setSheetOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Desktop sticky sidebar filters */
export default function Filters() {
  return <FiltersPanel idPrefix="desktop-" />;
}
