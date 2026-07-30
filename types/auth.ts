export type OtpPurpose = "SIGNUP" | "PASSWORD_RESET";

export type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
  from: "front";
  deviceId: string;
};

export type SendOtpPayload = {
  email: string;
  purpose: OtpPurpose;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
  purpose: OtpPurpose;
  deviceId: string;
};

export type ResetPasswordPayload = {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
};

export type UpdateProfilePayload = {
  firstName: string;
  lastName: string;
};

export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export type NotificationPreferences = {
  emailPromotional?: boolean;
  emailSystem?: boolean;
  pushPromotional?: boolean;
  pushSystem?: boolean;
  inAppPromotional?: boolean;
  inAppSystem?: boolean;
};

export type UpdateNotificationPreferencePayload = {
  pushPromotional: boolean;
  inAppPromotional: boolean;
  inAppSystem: boolean;
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
  isEmailVerified?: boolean;
  phone?: string | null;
  status?: string;
  isGuest?: boolean;
  selectedLanguage?: string;
  createdAt?: string;
  updatedAt?: string;
  role?: {
    id: number;
    name: string;
    [key: string]: unknown;
  };
  userNotificationPref?: NotificationPreferences & {
    id?: number;
    userId?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  devices?: Array<{
    id: number;
    deviceId: string;
    userId: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
};

export type AuthResponse = {
  message?: string;
  success?: boolean;
  statusCode?: number;
  data?: AuthUser | (AuthUser & { user?: AuthUser }) | null;
  meta?: {
    accessToken?: string;
    [key: string]: unknown;
  };
  token?: string;
  accessToken?: string;
  user?: AuthUser;
  [key: string]: unknown;
};
