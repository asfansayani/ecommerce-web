import { fetcher } from "@/lib/fetcher";
import type { PlatformSettingsResponse } from "@/types/platform-settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getPlatformSettings(): Promise<PlatformSettingsResponse> {
  return fetcher(`${API_URL}/public/platform-settings`, undefined, {
    // Fees can change; avoid long cache for checkout accuracy
    next: { revalidate: 60 },
  });
}
