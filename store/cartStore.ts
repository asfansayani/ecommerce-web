"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartVariantSelection } from "@/types/cart";

type AddCartItemInput = Omit<CartItem, "quantity" | "cartKey"> & {
  quantity?: number;
  cartKey?: string;
};

type CartState = {
  items: CartItem[];
  addItem: (item: AddCartItemInput) => void;
  removeItem: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
};

function normalizePrice(price: string) {
  const num = Number(price);
  return Number.isFinite(num) ? num : 0;
}

function buildCartKey(
  productId: number,
  productSkuId?: number | null,
  variants?: CartVariantSelection[]
) {
  if (productSkuId != null) {
    return `${productId}-sku-${productSkuId}`;
  }
  if (variants?.length) {
    const variantPart = [...variants]
      .sort((a, b) => a.variantId - b.variantId)
      .map((v) => `${v.variantId}:${v.valueId}`)
      .join("|");
    return `${productId}-v-${variantPart}`;
  }
  return String(productId);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const quantity = Math.max(1, item.quantity ?? 1);
        const cartKey =
          item.cartKey ??
          buildCartKey(item.productId, item.productSkuId, item.variants);
        const existing = get().items.find(
          (cartItem) => cartItem.cartKey === cartKey
        );

        if (existing) {
          set({
            items: get().items.map((cartItem) =>
              cartItem.cartKey === cartKey
                ? {
                    ...cartItem,
                    quantity: cartItem.quantity + quantity,
                    name: item.name,
                    slug: item.slug,
                    price: item.price,
                    image: item.image,
                    productSkuId: item.productSkuId ?? cartItem.productSkuId,
                    variants: item.variants ?? cartItem.variants,
                  }
                : cartItem
            ),
          });
          return;
        }

        set({
          items: [
            ...get().items,
            {
              cartKey,
              productId: item.productId,
              productSkuId: item.productSkuId,
              name: item.name,
              slug: item.slug,
              price: item.price,
              image: item.image,
              quantity,
              variants: item.variants,
            },
          ],
        });
      },

      removeItem: (cartKey) => {
        set({
          items: get().items.filter((item) => item.cartKey !== cartKey),
        });
      },

      updateQuantity: (cartKey, quantity) => {
        if (quantity < 1) {
          get().removeItem(cartKey);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.cartKey === cartKey ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + normalizePrice(item.price) * item.quantity,
          0
        ),
    }),
    {
      name: "bijou-cart",
      partialize: (state) => ({ items: state.items }),
      merge: (persisted, current) => {
        const p = persisted as { items?: Array<Partial<CartItem>> } | undefined;
        const items = (p?.items ?? []).map((item) => {
          const productId = item.productId ?? 0;
          const productSkuId = item.productSkuId;
          const variants = item.variants;
          const cartKey =
            item.cartKey ??
            buildCartKey(productId, productSkuId, variants);
          return {
            cartKey,
            productId,
            productSkuId,
            name: item.name ?? "Product",
            slug: item.slug,
            price: item.price ?? "0",
            image: item.image ?? "/assets/images/productImage.svg",
            quantity: Math.max(1, item.quantity ?? 1),
            variants,
          } satisfies CartItem;
        });
        return { ...current, ...p, items };
      },
    }
  )
);
