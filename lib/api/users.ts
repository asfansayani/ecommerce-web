import { AuthApiError } from "@/lib/api/auth";
import { buildApiHeaders } from "@/lib/api-headers";
import { handleUnauthorizedResponse } from "@/lib/session";
import type { AuthResponse, UpdateProfilePayload } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function requestUsersApi(
  path: string,
  method: string,
  token: string,
  body?: unknown
): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({
    token,
    json: body !== undefined,
  });

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

  return data as AuthResponse;
}

export function updateProfile(payload: UpdateProfilePayload, token: string) {
  return requestUsersApi("/users", "PATCH", token, payload);
}

export function deleteAccount(token: string) {
  return requestUsersApi("/users/delete", "POST", token);
}
