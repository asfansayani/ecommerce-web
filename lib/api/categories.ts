import { fetcher } from "@/lib/fetcher";
import { CategoriesResponse } from "@/types/category";

export const getCategories = async (
  query?: Record<string, string | number | boolean>
): Promise<CategoriesResponse> => {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/public/categories`,
    query
  );
};