"use client";

import { create } from "zustand";
import {
  DEFAULT_CURRENCY,
  normalizeCurrency,
} from "@/lib/currencies";
import {
  getCurrencyFromDocument,
  setCurrencyCookie,
} from "@/lib/currency-cookie";
import { useCartStore } from "@/store/cartStore";

type CurrencyState = {
  currency: string;
  isHydrated: boolean;
  setCurrency: (code: string, options?: { reload?: boolean }) => void;
  hydrate: () => void;
};

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: DEFAULT_CURRENCY,
  isHydrated: false,

  hydrate: () => {
    if (get().isHydrated) return;
    const fromCookie = getCurrencyFromDocument();
    set({
      currency: normalizeCurrency(fromCookie ?? DEFAULT_CURRENCY),
      isHydrated: true,
    });
  },

  setCurrency: (code, options = {}) => {
    const currency = normalizeCurrency(code);
    if (currency === get().currency) return;

    setCurrencyCookie(currency);
    // Cart prices are currency-specific; clear so totals stay accurate
    useCartStore.getState().clearCart();
    set({ currency, isHydrated: true });

    if (options.reload !== false && typeof window !== "undefined") {
      window.location.reload();
    }
  },
}));
