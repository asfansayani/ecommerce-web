import ProductsNotFound from "@/components/common/ProductsNotFound";
import PaginationControls from "@/components/dashboard/PaginationControls";
import ProductCard from "@/components/home/ProductCard";
import { MobileFilters } from "@/components/ui/filters";
import Sort from "@/components/ui/sort";
import { getCategories } from "@/lib/api/categories";
import { getProductByCategory } from "@/lib/api/products";
import {
  findCategoryBySlugPath,
  toCategorySlug,
} from "@/lib/category-slug";
import { localizeProducts } from "@/lib/utils";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{
    slug: string[];
    locale: string;
  }>;
  searchParams: Promise<{
    page?: string;
    sort?: string;
    color?: string;
    size?: string;
    priceMin?: string;
    priceMax?: string;
    specialOffer?: string;
  }>;
}) {
  const PAGE_SIZE = 8;
  const { slug, locale } = await params;
  const { page, sort, color, size, priceMin, priceMax, specialOffer } =
    await searchParams;
  const requestedPage = Math.max(1, Number(page) || 1);

  const slugParts = (slug ?? []).map(toCategorySlug);

  const query = new URLSearchParams();
  if (sort) query.set("sort", sort);
  if (color) query.set("color", color);
  if (size) query.set("size", size);
  if (priceMin) query.set("priceMin", priceMin);
  if (priceMax) query.set("priceMax", priceMax);
  if (specialOffer === "true" || specialOffer === "false") {
    query.set("specialOffer", specialOffer);
  }

  const slugPath = slugParts.length > 0 ? slugParts.join("/") : "";
  const basePath = `/shop/products/${slugPath}${
    query.toString() ? `?${query}` : ""
  }`;

  const categories = await getCategories({
    depth: 10,
    limit: 999,
  });

  // Resolve nested path: main / sub / nested … from first slug segment root
  // Collections root (no slug): no category filter — all products
  const resolvedCategory = findCategoryBySlugPath(categories?.data, slugParts);
  const categoryId = resolvedCategory?.id;

  const { data: productsResponse, meta } = await getProductByCategory({
    page: requestedPage,
    limit: PAGE_SIZE,
    ...(categoryId != null && categoryId !== undefined ? { categoryId } : {}),
    ...(sort && { sort }),
    ...(priceMin && { priceMin }),
    ...(priceMax && { priceMax }),
    ...(specialOffer === "true" || specialOffer === "false"
      ? { specialOffer: specialOffer === "true" }
      : {}),
  });

  const products = localizeProducts(productsResponse ?? [], locale);
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const isEmpty = products.length === 0;

  const heading =
    slugParts.length > 0
      ? slugParts[slugParts.length - 1]?.replaceAll("-", " ")
      : "Collections";

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-start justify-between gap-2 md:mb-4">
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold capitalize sm:text-2xl">
            {heading}
          </h2>
          {!isEmpty && (
            <p className="mt-0.5 text-xs text-gray-500 capitalize sm:text-sm">
              showing {PAGE_SIZE * (requestedPage - 1) + 1}-
              {Math.min(PAGE_SIZE * requestedPage, meta?.total ?? 0)} of{" "}
              {meta?.total ?? 0} products
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
          <div className="md:hidden">
            <MobileFilters />
          </div>
          <Sort sort={sort} />
        </div>
      </div>
      {isEmpty ? (
        <ProductsNotFound />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-10">
            <PaginationControls
              currentPage={requestedPage}
              totalPages={totalPages}
              basePath={basePath}
            />
          </div>
        </>
      )}
    </div>
  );
}
