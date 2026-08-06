import { AuthApiError } from "@/lib/api/auth";
import { fetcher } from "@/lib/fetcher";
import { handleUnauthorizedResponse } from "@/lib/session";
import type { AuthResponse } from "@/types/auth";
import type { WishlistResponse } from "@/types/wishlist";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getWishlist = async (
  query?: Record<string, string | number | boolean>
): Promise<WishlistResponse> => {
  return fetcher(`${API_URL}/wishlist`, query);
};

async function wishlistRequest(
  productId: string | number,
  method: "POST" | "DELETE",
  token: string
): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const res = await fetch(`${API_URL}/wishlist/${productId}`, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  let data: Record<string, unknown> | null = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    await handleUnauthorizedResponse(res.status, true);

    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      `Request failed (${res.status})`;
    throw new AuthApiError(message, res.status);
  }

  return data as AuthResponse;
}

export function addToWishlist(productId: string | number, token: string) {
  return wishlistRequest(productId, "POST", token);
}

export function removeFromWishlist(productId: string | number, token: string) {
  return wishlistRequest(productId, "DELETE", token);
}
