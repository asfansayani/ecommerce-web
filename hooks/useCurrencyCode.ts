"use client";

import { useEffect } from "react";
import { DEFAULT_CURRENCY } from "@/lib/currencies";
import { useCurrencyStore } from "@/store/currencyStore";

/** Reactive selected currency for client price labels. */
export function useCurrencyCode(fallback?: string): string {
  const currency = useCurrencyStore((s) => s.currency);
  const isHydrated = useCurrencyStore((s) => s.isHydrated);
  const hydrate = useCurrencyStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated && fallback) return fallback;
  return currency || fallback || DEFAULT_CURRENCY;
}
