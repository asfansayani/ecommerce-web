import { fetcher } from "@/lib/fetcher";
import { PageResponse } from "@/types/page";

export const getPage = async (id: number): Promise<PageResponse> => {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/public/page/${id}`);
};
