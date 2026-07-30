import { fetcher } from "@/lib/fetcher";
import { ProductsResponse } from "@/types/product";

export const getProducts = async (
  query?: Record<string, string | number | boolean>
): Promise<ProductsResponse> => {
  return fetcher(
    `${process.env.NEXT_PUBLIC_API_URL}/user/product`,
    query
  );
};
