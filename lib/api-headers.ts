import { getAccessToken } from "@/lib/auth-cookie";
import { getCurrency } from "@/lib/currency-cookie";

type BuildApiHeadersOptions = {
  token?: string | null;
  json?: boolean;
  /** Extra headers to merge (extra wins only if you set them after). */
  headers?: HeadersInit;
  accept?: string;
};

/**
 * Shared API headers: Accept, optional Content-Type/Authorization, and X-Currency.
 */
export async function buildApiHeaders(
  options: BuildApiHeadersOptions = {}
): Promise<Record<string, string>> {
  const currency = await getCurrency();
  const headers = new Headers(options.headers);

  if (!headers.has("Accept")) {
    headers.set("Accept", options.accept ?? "application/json");
  }

  if (options.json && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    options.token !== undefined ? options.token : await getAccessToken();

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!headers.has("X-Currency")) {
    headers.set("X-Currency", currency);
  }

  const result: Record<string, string> = {};
  headers.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
