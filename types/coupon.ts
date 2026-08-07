export type CouponType = "PERCENTAGE" | "FIXED" | "FIXED_AMOUNT" | string;

export type ValidateCouponPayload = {
  email: string;
  code: string;
  cartSubtotal: number;
};

export type Coupon = {
  id: number;
  code: string;
  type: CouponType;
  discountValue: string | number;
  minCartSpend?: number;
  usageLimitGlobal?: number;
  usedCountGlobal?: number;
  usageLimitPerUser?: number;
  startAt?: string;
  endAt?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  minCartSpendBase?: number;
  currency?: string;
  locale?: string;
  exchangeRate?: number;
  exchangeRateAt?: string;
};

export type ValidateCouponResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: Coupon;
};

export function calculateCouponDiscount(
  coupon: Coupon | null | undefined,
  subtotal: number
): number {
  if (!coupon || !Number.isFinite(subtotal) || subtotal <= 0) return 0;

  const value = Number(coupon.discountValue);
  if (!Number.isFinite(value) || value <= 0) return 0;

  const type = String(coupon.type).toUpperCase();

  if (type === "PERCENTAGE") {
    return Math.min(subtotal, (subtotal * value) / 100);
  }

  // FIXED / FIXED_AMOUNT / default flat amount
  return Math.min(subtotal, value);
}
