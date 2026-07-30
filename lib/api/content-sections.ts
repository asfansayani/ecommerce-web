import { fetcher } from "@/lib/fetcher";
import { ContentSectionsResponse } from "@/types/content-section";

export const getContentSections = async (
  pageName: string
): Promise<ContentSectionsResponse> => {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/public/content-sections`, {
    pageName,
  });
};
