"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { validateCoupon } from "@/lib/api/coupon";
import { useCartStore } from "@/store/cartStore";
import type { Coupon } from "@/types/coupon";

/**
 * Shared promo apply/remove state for guest + logged-in checkout.
 */
export function useCheckoutPromo(resolveEmail: () => string) {
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const cartSignature = useCartStore((s) =>
    s.items.map((i) => `${i.cartKey}:${i.quantity}:${i.price}`).join("|"),
  );
  const [promoCode, setPromoCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Re-validate needed if cart changes after a code is applied
  useEffect(() => {
    setAppliedCoupon(null);
  }, [cartSignature]);

  const onPromoCodeChange = useCallback((value: string) => {
    setPromoCode(value);
    setAppliedCoupon(null);
  }, []);

  const onRemovePromo = useCallback(() => {
    setAppliedCoupon(null);
    setPromoCode("");
  }, []);

  const onApplyPromo = useCallback(async () => {
    const code = promoCode.trim();
    if (!code) {
      toast.error("Enter a promo code first");
      return;
    }

    const email = resolveEmail().trim();
    if (!email) {
      toast.error("Email is required to apply a promo code");
      return;
    }

    const cartSubtotal = getSubtotal();
    if (cartSubtotal <= 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsApplyingPromo(true);
    try {
      const response = await validateCoupon({
        email,
        code,
        cartSubtotal: Number(cartSubtotal.toFixed(2)),
      });

      if (!response.data) {
        toast.error(response.message || "Invalid promo code");
        setAppliedCoupon(null);
        return;
      }

      setAppliedCoupon(response.data);
      setPromoCode(response.data.code || code);
      toast.success(`Promo code ${response.data.code} applied`);
    } catch (err) {
      setAppliedCoupon(null);
      const message =
        err instanceof Error ? err.message : "Unable to validate promo code";
      toast.error(message);
    } finally {
      setIsApplyingPromo(false);
    }
  }, [getSubtotal, promoCode, resolveEmail]);

  return {
    promoCode,
    appliedCoupon,
    isApplyingPromo,
    onPromoCodeChange,
    onApplyPromo,
    onRemovePromo,
  };
}
