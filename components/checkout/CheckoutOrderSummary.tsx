"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { getPlatformSettings } from "@/lib/api/platform-settings";
import { useCartStore } from "@/store/cartStore";
import type { Coupon } from "@/types/coupon";
import { calculateCouponDiscount } from "@/types/coupon";
import type { PlatformSettings } from "@/types/platform-settings";
import { calculateOrderTotals } from "@/types/platform-settings";

function formatMoney(value: number) {
  return value.toFixed(2);
}

type CheckoutOrderSummaryProps = {
  promoCode: string;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
  onRemovePromo?: () => void;
  appliedCoupon?: Coupon | null;
  isApplyingPromo?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export default function CheckoutOrderSummary({
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  onRemovePromo,
  appliedCoupon = null,
  isApplyingPromo = false,
  isSubmitting = false,
  submitLabel = "Place Order",
}: CheckoutOrderSummaryProps) {
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const items = useCartStore((s) => s.items);

  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setSettingsLoading(true);
      try {
        const response = await getPlatformSettings();
        if (!cancelled) setSettings(response?.data ?? null);
      } catch {
        if (!cancelled) setSettings(null);
      } finally {
        if (!cancelled) setSettingsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const discount = calculateCouponDiscount(appliedCoupon, subtotal);
  const totals = calculateOrderTotals(subtotal, discount, settings);
  const currency = totals.currency;

  const discountLabel =
    appliedCoupon &&
    String(appliedCoupon.type).toUpperCase() === "PERCENTAGE"
      ? `Discount (${appliedCoupon.code} · ${Number(appliedCoupon.discountValue)}%)`
      : appliedCoupon
        ? `Discount (${appliedCoupon.code})`
        : "Discount";

  return (
    <div className="rounded-lg border border-border bg-white p-5 md:p-6">
      <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
        Order Summary
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        {totalItems} item{totalItems === 1 ? "" : "s"}
      </p>

      {items.length > 0 ? (
        <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto border-b border-border pb-4">
          {items.map((item) => (
            <li
              key={item.cartKey}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="min-w-0 text-gray-600">
                <span className="line-clamp-1 capitalize text-primary">
                  {item.name}
                </span>
                <span className="text-gray-400"> × {item.quantity}</span>
              </span>
              <span className="shrink-0 text-primary">
                {currency}{" "}
                {formatMoney(Number(item.price) * item.quantity || 0)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-primary">Promo code</p>
        <div className="flex gap-2">
          <FormField
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            containerClassName="flex-1"
            className="uppercase"
            disabled={!!appliedCoupon || isApplyingPromo}
          />
          {appliedCoupon ? (
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 rounded-md px-4 text-xs font-semibold uppercase tracking-[0.08em]"
              onClick={onRemovePromo}
            >
              Remove
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="h-11 shrink-0 rounded-md px-4 text-xs font-semibold uppercase tracking-[0.08em]"
              onClick={onApplyPromo}
              disabled={isApplyingPromo}
            >
              {isApplyingPromo ? "…" : "Apply"}
            </Button>
          )}
        </div>
        {appliedCoupon ? (
          <p className="mt-2 text-xs text-emerald-700">
            Code {appliedCoupon.code} applied
            {String(appliedCoupon.type).toUpperCase() === "PERCENTAGE"
              ? ` · ${Number(appliedCoupon.discountValue)}% off`
              : null}
          </p>
        ) : null}
      </div>

      <div className="mt-5 divide-y divide-border border-t border-border">
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-primary">
            {currency} {formatMoney(totals.subtotal)}
          </span>
        </div>
        {totals.discount > 0 ? (
          <div className="flex items-center justify-between gap-4 py-3 text-sm">
            <span className="text-gray-500">{discountLabel}</span>
            <span className="text-emerald-700">
              − {currency} {formatMoney(totals.discount)}
            </span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className="text-right text-primary">
            {settingsLoading
              ? "…"
              : totals.isShippingFree
                ? "Free"
                : `${currency} ${formatMoney(totals.shipping)}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="text-gray-500">
            Tax
            {totals.taxPercentage > 0
              ? ` (${totals.taxPercentage}%)`
              : null}
          </span>
          <span className="text-right text-primary">
            {settingsLoading
              ? "…"
              : `${currency} ${formatMoney(totals.tax)}`}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-3 text-sm">
          <span className="font-semibold text-primary">Total</span>
          <span className="font-semibold text-primary">
            {settingsLoading
              ? "…"
              : `${currency} ${formatMoney(totals.total)}`}
          </span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting || isApplyingPromo}
        className="mt-6 h-11 w-full rounded-md bg-tertiary text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90"
      >
        {isSubmitting ? "Placing order…" : submitLabel}
      </Button>
    </div>
  );
}
