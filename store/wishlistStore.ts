"use client";

import { create } from "zustand";
import { getWishlist } from "@/lib/api/wishlist";

type WishlistState = {
  count: number;
  isReady: boolean;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  syncFromApi: () => Promise<void>;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  count: 0,
  isReady: false,

  setCount: (count) => set({ count: Math.max(0, count), isReady: true }),

  increment: () => set({ count: get().count + 1, isReady: true }),

  decrement: () => set({ count: Math.max(0, get().count - 1), isReady: true }),

  reset: () => set({ count: 0, isReady: false }),

  syncFromApi: async () => {
    try {
      const response = await getWishlist({ page: 1, limit: 1 });
      const total =
        response?.meta?.total ??
        (Array.isArray(response?.data) ? response.data.length : 0);
      set({ count: Math.max(0, total), isReady: true });
    } catch {
      set({ count: 0, isReady: true });
    }
  },
}));
