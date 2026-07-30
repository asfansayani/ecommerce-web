"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  AuthApiError,
  changePassword as changePasswordApi,
  login as loginApi,
  logout as logoutApi,
  resetPassword as resetPasswordApi,
  sendOtp as sendOtpApi,
  signup as signupApi,
  verifyOtp as verifyOtpApi,
} from "@/lib/api/auth";
import {
  updateProfile as updateProfileApi,
  deleteAccount as deleteAccountApi,
} from "@/lib/api/users";
import { updateNotificationPreferences as updateNotificationPreferencesApi } from "@/lib/api/notifications";
import {
  clearAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/auth-cookie";
import { getDeviceId } from "@/lib/deviceId";
import type {
  AuthResponse,
  AuthUser,
  ChangePasswordPayload,
  OtpPurpose,
  ResetPasswordPayload,
  SignUpPayload,
  UpdateNotificationPreferencePayload,
  UpdateProfilePayload,
} from "@/types/auth";

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  email: string | null;
  otp: string | null;
  purpose: OtpPurpose | null;
  isLoading: boolean;
  error: string | null;

  clearError: () => void;
  logout: () => Promise<void>;
  setPendingAuth: (email: string, purpose: OtpPurpose) => void;

  signup: (payload: SignUpPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  sendOtp: (email: string, purpose: OtpPurpose) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resetPassword: (
    payload: Pick<ResetPasswordPayload, "password" | "confirmPassword">
  ) => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateNotificationPreferences: (
    payload: UpdateNotificationPreferencePayload
  ) => Promise<void>;
};

function extractToken(response: AuthResponse): string | null {
  return (
    response.meta?.accessToken ??
    response.token ??
    response.accessToken ??
    null
  );
}

function extractUser(response: AuthResponse): AuthUser | null {
  if (response.user) {
    return response.user;
  }

  const data = response.data;
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("user" in data && data.user && typeof data.user === "object") {
    return data.user as AuthUser;
  }

  if ("id" in data && "email" in data) {
    return data as AuthUser;
  }

  return null;
}

function persistSession(token: string | null) {
  if (token) {
    setAccessTokenCookie(token);
  } else {
    clearAccessTokenCookie();
  }
}

function toastApiMessage(
  response: AuthResponse | null | undefined,
  fallback: string,
  type: "success" | "error" = "success"
) {
  const message =
    (typeof response?.message === "string" && response.message) || fallback;

  if (type === "error") {
    toast.error(message);
  } else {
    toast.success(message);
  }
}

function toastApiError(err: unknown, fallback: string) {
  const message = err instanceof Error ? err.message : fallback;
  toast.error(message);
  return message;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      email: null,
      otp: null,
      purpose: null,
      isLoading: false,
      error: null,

      clearError: () => set({ error: null }),

      logout: async () => {
        const token = get().token;

        try {
          if (token) {
            const response = await logoutApi(token);
            toastApiMessage(response, "Logged out successfully");
          }
        } catch (err) {
          toastApiError(err, "Logged out");
        } finally {
          clearAccessTokenCookie();
          set({
            user: null,
            token: null,
            email: null,
            otp: null,
            purpose: null,
            error: null,
            isLoading: false,
          });
        }
      },

      setPendingAuth: (email, purpose) =>
        set({ email, purpose, otp: null, error: null }),

      signup: async (payload) => {
        set({ isLoading: true, error: null });
        try {
          const response = await signupApi(payload);
          toastApiMessage(response, "Account created successfully");
          set({
            email: payload.email,
            purpose: "SIGNUP",
            otp: null,
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(err, "Sign up failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginApi({
            email,
            password,
            from: "front",
            deviceId: getDeviceId(),
          });
          const token = extractToken(response);
          persistSession(token);
          toastApiMessage(response, "Signed in successfully");
          set({
            user: extractUser(response),
            token,
            isLoading: false,
            email: null,
            otp: null,
            purpose: null,
          });
        } catch (err) {
          if (err instanceof AuthApiError && err.statusCode === 409) {
            toast.info(err.message);
            set({
              email,
              purpose: "SIGNUP",
              otp: null,
              isLoading: false,
              error: null,
            });
            throw err;
          }

          const message = toastApiError(err, "Sign in failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      sendOtp: async (email, purpose) => {
        set({ isLoading: true, error: null });
        try {
          const response = await sendOtpApi({ email, purpose });
          toastApiMessage(response, "OTP sent successfully");
          set({
            email,
            purpose,
            otp: null,
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(err, "Failed to send OTP");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      verifyOtp: async (otp) => {
        const { email, purpose } = get();
        if (!email || !purpose) {
          const message = "Missing email or purpose. Please restart the flow.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await verifyOtpApi({
            email,
            otp,
            purpose,
            deviceId: getDeviceId(),
          });
          toastApiMessage(response, "OTP verified successfully");

          if (purpose === "SIGNUP") {
            const token = extractToken(response);
            persistSession(token);
            set({
              user: extractUser(response),
              token,
              email: null,
              otp: null,
              purpose: null,
              isLoading: false,
            });
            return;
          }

          set({
            otp,
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(err, "OTP verification failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      resetPassword: async ({ password, confirmPassword }) => {
        const { email, otp } = get();
        if (!email || !otp) {
          const message =
            "Missing email or OTP. Please restart the password reset flow.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await resetPasswordApi({
            email,
            otp,
            password,
            confirmPassword,
          });
          toastApiMessage(response, "Password reset successfully");
          set({
            isLoading: false,
            email: null,
            otp: null,
            purpose: null,
          });
        } catch (err) {
          const message = toastApiError(err, "Password reset failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      updateProfile: async (payload) => {
        const token = get().token;
        if (!token) {
          const message = "You must be signed in to update your profile.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await updateProfileApi(payload, token);
          const updatedUser = extractUser(response);
          toastApiMessage(response, "Profile updated successfully");
          set({
            user: updatedUser
              ? updatedUser
              : {
                  ...get().user!,
                  firstName: payload.firstName,
                  lastName: payload.lastName,
                },
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(err, "Profile update failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      changePassword: async (payload) => {
        const token = get().token;
        if (!token) {
          const message = "You must be signed in to change your password.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await changePasswordApi(payload, token);
          toastApiMessage(response, "Password changed successfully");
          set({ isLoading: false });
        } catch (err) {
          const message = toastApiError(err, "Password change failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      deleteAccount: async () => {
        const token = get().token;
        if (!token) {
          const message = "You must be signed in to delete your account.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await deleteAccountApi(token);
          toastApiMessage(response, "Account deleted successfully");
          clearAccessTokenCookie();
          set({
            user: null,
            token: null,
            email: null,
            otp: null,
            purpose: null,
            error: null,
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(err, "Account deletion failed");
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      updateNotificationPreferences: async (payload) => {
        const token = get().token;
        const user = get().user;
        if (!token) {
          const message =
            "You must be signed in to update notification preferences.";
          toast.error(message);
          set({ error: message });
          throw new Error(message);
        }

        set({ isLoading: true, error: null });
        try {
          const response = await updateNotificationPreferencesApi(
            payload,
            token
          );
          toastApiMessage(
            response,
            "Notification preferences updated successfully"
          );
          set({
            user: user
              ? {
                  ...user,
                  userNotificationPref: {
                    ...user.userNotificationPref,
                    ...payload,
                  },
                }
              : user,
            isLoading: false,
          });
        } catch (err) {
          const message = toastApiError(
            err,
            "Failed to update notification preferences"
          );
          set({ isLoading: false, error: message });
          throw err;
        }
      },
    }),
    {
      name: "bijou-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        email: state.email,
        otp: state.otp,
        purpose: state.purpose,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setAccessTokenCookie(state.token);
        }
      },
    }
  )
);
