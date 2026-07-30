import { getAccessToken } from "@/lib/auth-cookie";

export async function fetcher(
  url: string,
  query?: Record<string, string | number | boolean>,
  options?: RequestInit
) {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      params.append(key, String(value));
    });
  }

  const token = await getAccessToken();
  const headers = new Headers(options?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const { next: nextOption, cache, ...restOptions } = options ?? {};
  const shouldSkipCache = cache === "no-store";

  const res = await fetch(
    `${url}${params.toString() ? `?${params}` : ""}`,
    {
      ...restOptions,
      headers,
      ...(shouldSkipCache
        ? { cache: "no-store" as const }
        : { next: nextOption ?? { revalidate: 10 } }),
    }
  );

  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}
