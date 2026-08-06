import { AuthApiError } from "@/lib/api/auth";
import { fetcher } from "@/lib/fetcher";
import { handleUnauthorizedResponse } from "@/lib/session";
import type {
  AddressPayload,
  AddressResponse,
  AddressesResponse,
} from "@/types/address";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAddresses = async (
  query?: Record<string, string | number | boolean>
): Promise<AddressesResponse> => {
  return fetcher(`${API_URL}/user/address`, query, { cache: "no-store" });
};

export const getAddressById = async (
  id: string | number
): Promise<AddressResponse> => {
  return fetcher(`${API_URL}/user/address/${id}`, undefined, {
    cache: "no-store",
  });
};

async function addressRequest<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  token: string,
  body?: unknown
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
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

  return data as T;
}

export function createAddress(payload: AddressPayload, token: string) {
  return addressRequest<AddressResponse>("/user/address", "POST", token, payload);
}

export function updateAddress(
  id: string | number,
  payload: AddressPayload,
  token: string
) {
  return addressRequest<AddressResponse>(
    `/user/address/${id}`,
    "PATCH",
    token,
    payload
  );
}

export function deleteAddress(id: string | number, token: string) {
  return addressRequest<{ message?: string; success?: boolean }>(
    `/user/address/${id}`,
    "DELETE",
    token
  );
}
