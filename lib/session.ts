import { routing } from "@/i18n/routing";
import {
  ACCESS_TOKEN_COOKIE,
  clearAccessTokenCookie,
} from "@/lib/auth-cookie";

export class SessionExpiredError extends Error {
  statusCode = 401;

  constructor(message = "Session expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

const AUTH_STORAGE_KEY = "bijou-auth";

let isExpiring = false;

function getLocaleFromPathname(pathname: string) {
  const maybeLocale = pathname.split("/")[1];
  if (
    routing.locales.includes(
      maybeLocale as (typeof routing.locales)[number]
    )
  ) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

async function clearServerAccessTokenCookie() {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    cookieStore.delete(ACCESS_TOKEN_COOKIE);
  } catch {
    // Cookie mutation is only allowed in certain server contexts.
  }
}

function clearClientSession() {
  clearAccessTokenCookie();

  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
}

async function resetAuthStore() {
  try {
    const { useAuthStore } = await import("@/store/authStore");
    useAuthStore.setState({
      user: null,
      token: null,
      email: null,
      otp: null,
      purpose: null,
      error: null,
      isLoading: false,
    });
  } catch {
    // Store may be unavailable outside the client bundle.
  }
}

function redirectToSignIn() {
  const { pathname, search } = window.location;

  if (pathname.includes("/sign-in")) return;

  const locale = getLocaleFromPathname(pathname);
  const callbackUrl = `${pathname}${search}`;
  const signInUrl = new URL(`/${locale}/sign-in`, window.location.origin);
  signInUrl.searchParams.set("callbackUrl", callbackUrl);
  window.location.assign(signInUrl.toString());
}

/**
 * Clears the local auth session when the backend rejects the access token (401).
 * On the client, also redirects to sign-in once.
 */
export async function handleSessionExpired(): Promise<void> {
  if (isExpiring) return;
  isExpiring = true;

  try {
    if (typeof window === "undefined") {
      await clearServerAccessTokenCookie();
      return;
    }

    clearClientSession();
    await resetAuthStore();
    redirectToSignIn();
  } finally {
    // Allow a later session expiry after a successful re-login.
    if (typeof window === "undefined") {
      isExpiring = false;
    } else {
      // Keep locked until full navigation finishes to avoid multi-401 storms.
      window.setTimeout(() => {
        isExpiring = false;
      }, 2000);
    }
  }
}

export async function handleUnauthorizedResponse(
  status: number,
  hadAuthToken: boolean
): Promise<void> {
  if (status === 401 && hadAuthToken) {
    await handleSessionExpired();
  }
}
