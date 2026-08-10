import {
  DEFAULT_CURRENCY,
  normalizeCurrency,
} from "@/lib/currencies";

export const CURRENCY_COOKIE = "currency";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function setCurrencyCookie(currency: string) {
  if (typeof document === "undefined") return;

  const value = normalizeCurrency(currency);
  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CURRENCY_COOKIE}=${encodeURIComponent(value)}; Path=/; Max-Age=${ONE_YEAR_SECONDS}; SameSite=Lax${secure}`;
}

export function getCurrencyFromDocument(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${CURRENCY_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getCurrency(): Promise<string> {
  if (typeof window === "undefined") {
    try {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      const value = cookieStore.get(CURRENCY_COOKIE)?.value;
      if (value) {
        return normalizeCurrency(decodeURIComponent(value));
      }
    } catch {
      // cookies() unavailable outside a request context
    }
    return DEFAULT_CURRENCY;
  }

  return normalizeCurrency(getCurrencyFromDocument() ?? DEFAULT_CURRENCY);
}
