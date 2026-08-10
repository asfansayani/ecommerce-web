import { AuthApiError } from "@/lib/api/auth";
import { buildApiHeaders } from "@/lib/api-headers";
import type {
  ValidateCouponPayload,
  ValidateCouponResponse,
} from "@/types/coupon";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function validateCoupon(
  payload: ValidateCouponPayload
): Promise<ValidateCouponResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({ token: null, json: true });

  const res = await fetch(`${API_URL}/public/coupon/validate-coupon`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  let data: Record<string, unknown> | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      `Request failed (${res.status})`;
    throw new AuthApiError(message, res.status);
  }

  return data as ValidateCouponResponse;
}
