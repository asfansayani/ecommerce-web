export const ACCESS_TOKEN_COOKIE = "accessToken";

const ONE_DAY_SECONDS = 60 * 60 * 24;

export function setAccessTokenCookie(token: string) {
  if (typeof document === "undefined") return;

  const secure =
    window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${ONE_DAY_SECONDS}; SameSite=Lax${secure}`;
}

export function clearAccessTokenCookie() {
  if (typeof document === "undefined") return;

  document.cookie = `${ACCESS_TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getAccessTokenFromDocument(): string | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${ACCESS_TOKEN_COOKIE}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export async function getAccessToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const value = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    return value ? decodeURIComponent(value) : null;
  }

  return getAccessTokenFromDocument();
}
