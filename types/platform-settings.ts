export type PlatformSettings = {
  id: number;
  taxPercentage: string | number;
  shippingFee: number;
  shippingFeeExemptedAfter: number;
  baseCurrency?: string;
  createdAt?: string;
  updatedAt?: string;
  shippingFeeBase?: number;
  shippingFeeExemptedAfterBase?: number;
  currency?: string;
  locale?: string;
  exchangeRate?: number;
  exchangeRateAt?: string;
};

export type PlatformSettingsResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: PlatformSettings;
};

export type OrderTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  isShippingFree: boolean;
  taxPercentage: number;
  currency: string;
};

export function calculateOrderTotals(
  subtotal: number,
  discount: number,
  settings: PlatformSettings | null | undefined
): OrderTotals {
  const safeSubtotal = Math.max(0, Number.isFinite(subtotal) ? subtotal : 0);
  const safeDiscount = Math.min(
    safeSubtotal,
    Math.max(0, Number.isFinite(discount) ? discount : 0),
  );
  const net = Math.max(0, safeSubtotal - safeDiscount);

  const shippingFee = Number(settings?.shippingFee);
  const exemptAfter = Number(settings?.shippingFeeExemptedAfter);
  const taxPct = Number(settings?.taxPercentage);

  const isShippingFree =
    Number.isFinite(exemptAfter) && net >= exemptAfter;

  const shipping =
    !settings || isShippingFree
      ? 0
      : Number.isFinite(shippingFee)
        ? Math.max(0, shippingFee)
        : 0;

  const taxRate = Number.isFinite(taxPct) ? Math.max(0, taxPct) : 0;
  // Tax on merchandise after discount (not on shipping)
  const tax = (net * taxRate) / 100;

  const total = Math.max(0, net + shipping + tax);

  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    shipping,
    tax,
    total,
    isShippingFree,
    taxPercentage: taxRate,
    currency: settings?.baseCurrency || settings?.currency || "AED",
  };
}
