import { handleUnauthorizedResponse } from "@/lib/session";
import { buildApiHeaders } from "@/lib/api-headers";
import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  ResetPasswordPayload,
  SendOtpPayload,
  SignUpPayload,
  VerifyOtpPayload,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class AuthApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
  }
}

async function postAuth<T>(
  path: string,
  body?: unknown,
  token?: string | null
): Promise<T> {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }

  const headers = await buildApiHeaders({
    token: token ?? null,
    json: body !== undefined,
  });

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
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
    await handleUnauthorizedResponse(res.status, Boolean(token));

    const message =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      `Request failed (${res.status})`;
    throw new AuthApiError(message, res.status);
  }

  return data as T;
}

export function signup(payload: SignUpPayload) {
  return postAuth<AuthResponse>("/auth/signup", payload);
}

export function login(payload: LoginPayload) {
  return postAuth<AuthResponse>("/auth/login", payload);
}

export function sendOtp(payload: SendOtpPayload) {
  return postAuth<AuthResponse>("/auth/send-otp", payload);
}

export function verifyOtp(payload: VerifyOtpPayload) {
  return postAuth<AuthResponse>("/auth/verify-otp", payload);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return postAuth<AuthResponse>("/auth/reset-password", payload);
}

export function logout(token: string) {
  return postAuth<AuthResponse>("/auth/logout", undefined, token);
}

export function changePassword(payload: ChangePasswordPayload, token: string) {
  return postAuth<AuthResponse>("/auth/change-password", payload, token);
}
