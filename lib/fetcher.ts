import { getAccessToken } from "@/lib/auth-cookie";
import { getCurrency } from "@/lib/currency-cookie";
import {
  handleUnauthorizedResponse,
  SessionExpiredError,
} from "@/lib/session";

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
  const currency = await getCurrency();
  const headers = new Headers(options?.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("X-Currency")) {
    headers.set("X-Currency", currency);
  }

  const hadAuthToken =
    Boolean(token) || headers.has("Authorization");

  const { next: nextOption, cache, ...restOptions } = options ?? {};
  const shouldSkipCache = cache === "no-store";
  console.log(`${url}${params.toString() ? `?${params}` : ""}`);
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
    await handleUnauthorizedResponse(res.status, hadAuthToken);

    if (res.status === 401 && hadAuthToken) {
      throw new SessionExpiredError();
    }

    throw new Error(`Request failed (${res.status})`);
  }

  return res.json();
}
