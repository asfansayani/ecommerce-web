"use client";

import { useEffect } from "react";
import { detectCurrencyFromIp } from "@/lib/detect-currency";
import {
  getCurrencyFromDocument,
  setCurrencyCookie,
} from "@/lib/currency-cookie";
import { useCurrencyStore } from "@/store/currencyStore";
import { DEFAULT_CURRENCY } from "@/lib/currencies";

/**
 * On first visit (no currency cookie), detect currency from IP and persist it.
 * Skips if middleware / previous visits already set the cookie.
 */
export default function CurrencyBootstrap() {
  const hydrate = useCurrencyStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();

    if (getCurrencyFromDocument()) return;

    let cancelled = false;

    (async () => {
      const detected = await detectCurrencyFromIp();
      if (cancelled || !detected) {
        // Persist default so we don't re-detect every visit
        if (!cancelled && !getCurrencyFromDocument()) {
          setCurrencyCookie(DEFAULT_CURRENCY);
          useCurrencyStore.setState({
            currency: DEFAULT_CURRENCY,
            isHydrated: true,
          });
        }
        return;
      }

      setCurrencyCookie(detected);
      useCurrencyStore.setState({ currency: detected, isHydrated: true });

      // Reload when geo currency differs so API prices use X-Currency
      if (detected !== DEFAULT_CURRENCY) {
        window.location.reload();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrate]);

  return null;
}
