import { fetcher } from "@/lib/fetcher";
import type {
  CollectionListingResponse,
  ProductsResponse,
} from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = async (
  query?: Record<string, string | number | boolean>
): Promise<ProductsResponse> => {
  return fetcher(`${API_URL}/user/product`, query);
};

export const getBestSellingProducts = async (limit = 4) => {
  return getProducts({
    limit,
    sort: "best_selling",
  });
};

export const getCollectionListingBySlug = async (
  slug: string,
  query?: Record<string, string | number | boolean>
): Promise<CollectionListingResponse> => {
  return fetcher(
    `${API_URL}/public/collections/slug/${slug}/listing`,
    query
  );
};

export const getNewArrivals = async (limit = 4) => {
  return getCollectionListingBySlug("new-arrivals", { limit });
};
