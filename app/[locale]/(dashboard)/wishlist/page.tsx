import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import ProductCard from "@/components/home/ProductCard";
import PaginationControls from "@/components/dashboard/PaginationControls";
import { getProducts } from "@/lib/api/products";
import { getTranslation } from "@/lib/helpers/getTranslation";
import type { Product } from "@/types/product";

export const metadata: Metadata = {
  title: "Wishlist – Bijou Sky",
  description: "Browse your saved Bijou Sky favourites.",
};

const PAGE_SIZE = 8;

type WishlistPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function WishlistPage({ searchParams }: WishlistPageProps) {
  const locale = await getLocale();
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let products: Product[] = [];
  let totalPages = 1;
  let currentPage = requestedPage;
  let total = 0;
  let hasError = false;

  try {
    const response = await getProducts({
      page: requestedPage,
      limit: PAGE_SIZE,
    });

    products = response?.data ?? [];
    totalPages = Math.max(1, response?.meta?.totalPages ?? 1);
    currentPage = response?.meta?.page ?? requestedPage;
    total = response?.meta?.total ?? products.length;
  } catch {
    hasError = true;
  }

  const localizedProducts = products.map((product) => {
    const translation = getTranslation(product.translations, locale);

    return {
      ...product,
      name: translation?.name ?? product.name,
      description: translation?.description ?? product.description,
    };
  });

  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
          Account
        </p>
        <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
          Wishlist
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Your saved pieces, ready whenever you are.
          {!hasError && total > 0 ? ` ${total} item${total === 1 ? "" : "s"}.` : null}
        </p>
      </div>

      <div className="flex flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        {hasError ? (
          <p className="text-sm text-gray-500">
            Unable to load wishlist products right now. Please try again later.
          </p>
        ) : localizedProducts.length === 0 ? (
          <p className="text-sm text-gray-500">
            Your wishlist is empty. Explore the store and save pieces you love.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {localizedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/wishlist"
            />
          </>
        )}
      </div>
    </div>
  );
}
