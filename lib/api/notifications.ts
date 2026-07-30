import { AuthApiError } from "@/lib/api/auth";
import type {
  AuthResponse,
  UpdateNotificationPreferencePayload,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function updateNotificationPreferences(
  payload: UpdateNotificationPreferencePayload,
  token: string
): Promise<AuthResponse> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const params = new URLSearchParams({
    pushPromotional: String(payload.pushPromotional),
    inAppPromotional: String(payload.inAppPromotional),
    inAppSystem: String(payload.inAppSystem),
  });

  const res = await fetch(
    `${API_URL}/notifications/preference?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

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

  return data as AuthResponse;
}
