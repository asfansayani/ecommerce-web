import { fetcher } from "@/lib/fetcher";
import { AuthApiError } from "@/lib/api/auth";
import { buildApiHeaders } from "@/lib/api-headers";
import { handleUnauthorizedResponse } from "@/lib/session";
import type {
  ValidateCartItemsPayload,
  ValidateCartItemsResponse,
} from "@/types/cart";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  OrderDetailResponse,
  OrdersResponse,
  TrackOrderPayload,
  TrackOrderResponse,
} from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getOrders = async (
  query?: Record<string, string | number | boolean>
): Promise<OrdersResponse> => {
  return fetcher(`${API_URL}/user/orders`, query);
};

export const getOrderById = async (
  id: string | number
): Promise<OrderDetailResponse> => {
  return fetcher(`${API_URL}/user/orders/${id}`);
};

export async function trackOrder(
  payload: TrackOrderPayload
): Promise<TrackOrderResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({ token: null, json: true });

  const res = await fetch(`${API_URL}/public/orders/track`, {
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

  return data as TrackOrderResponse;
}

export async function validateCartItems(
  payload: ValidateCartItemsPayload
): Promise<ValidateCartItemsResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({ token: null, json: true });

  const res = await fetch(`${API_URL}/public/orders/validate-cart-items`, {
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

  return data as ValidateCartItemsResponse;
}

export async function createOrder(
  payload: CreateOrderPayload,
  token?: string | null
): Promise<CreateOrderResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({
    token: token ?? null,
    json: true,
  });

  const res = await fetch(`${API_URL}/public/orders`, {
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
    if (token) {
      await handleUnauthorizedResponse(res.status, true);
    }
    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      `Request failed (${res.status})`;
    throw new AuthApiError(message, res.status);
  }

  return data as CreateOrderResponse;
}

export async function downloadOrderInvoice(
  id: string | number,
  token: string
): Promise<{ blob: Blob; filename: string }> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({
    token,
    accept: "application/pdf,application/octet-stream,*/*",
  });

  const res = await fetch(`${API_URL}/user/orders/${id}/invoice/download`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    await handleUnauthorizedResponse(res.status, true);

    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data?.message === "string") message = data.message;
      else if (typeof data?.error === "string") message = data.error;
    } catch {
      // Response may be a non-JSON error body
    }
    throw new AuthApiError(message, res.status);
  }

  const contentDisposition = res.headers.get("content-disposition");
  const filenameMatch = contentDisposition?.match(
    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i
  );
  const filename = filenameMatch?.[1]
    ? filenameMatch[1].replace(/['"]/g, "")
    : `invoice-${id}.pdf`;

  const blob = await res.blob();
  return { blob, filename };
}
