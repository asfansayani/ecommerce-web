import {
  DEFAULT_CURRENCY,
  getCurrencyForCountry,
  isValidCurrency,
  normalizeCurrency,
} from "@/lib/currencies";

/**
 * Detect visitor currency from public IP geolocation APIs.
 * Returns null when detection fails so callers can fall back.
 */
export async function detectCurrencyFromIp(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch("https://ipwho.is/", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = (await res.json()) as {
      success?: boolean;
      country_code?: string;
      currency?: { code?: string } | string;
    };

    if (data.success === false) return null;

    const currencyCode =
      typeof data.currency === "string"
        ? data.currency
        : data.currency?.code;

    if (isValidCurrency(currencyCode)) {
      return normalizeCurrency(currencyCode);
    }

    if (data.country_code) {
      return getCurrencyForCountry(data.country_code);
    }

    return null;
  } catch {
    return null;
  }
}

export function currencyFromRequestHeaders(
  headers: Headers | { get(name: string): string | null }
): string {
  const country =
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    headers.get("cloudfront-viewer-country");

  if (!country || country === "XX" || country === "T1") {
    return DEFAULT_CURRENCY;
  }

  return getCurrencyForCountry(country);
}
