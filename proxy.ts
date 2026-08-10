import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "./lib/auth-cookie";
import { CURRENCY_COOKIE } from "./lib/currency-cookie";
import { getCurrencyForCountry, normalizeCurrency } from "./lib/currencies";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function getCountryFromRequest(request: NextRequest): string | null {
  const country =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code") ||
    request.headers.get("cloudfront-viewer-country");

  if (!country || country === "XX" || country === "T1") {
    return null;
  }
  return country;
}

function applyCurrencyCookie(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(CURRENCY_COOKIE)?.value;
  if (existing) {
    const normalized = normalizeCurrency(decodeURIComponent(existing));
    if (normalized !== existing) {
      response.cookies.set(CURRENCY_COOKIE, normalized, {
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
        sameSite: "lax",
      });
    }
    return response;
  }

  const country = getCountryFromRequest(request);
  if (country) {
    response.cookies.set(CURRENCY_COOKIE, getCurrencyForCountry(country), {
      path: "/",
      maxAge: ONE_YEAR_SECONDS,
      sameSite: "lax",
    });
  }

  return response;
}

const PROTECTED_ROUTES = [
  "/profile",
  "/orders",
  "/wishlist",
  "/settings",
  "/address",
] as const;

function getLocaleFromPathname(pathname: string) {
  const maybeLocale = pathname.split("/")[1];
  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    return maybeLocale;
  }
  return routing.defaultLocale;
}

function getPathnameWithoutLocale(pathname: string) {
  const segments = pathname.split("/");
  const maybeLocale = segments[1];

  if (routing.locales.includes(maybeLocale as (typeof routing.locales)[number])) {
    const rest = `/${segments.slice(2).join("/")}`;
    return rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  }

  return pathname;
}

function isProtectedRoute(pathnameWithoutLocale: string) {
  return PROTECTED_ROUTES.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`)
  );
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameWithoutLocale = getPathnameWithoutLocale(pathname);

  if (isProtectedRoute(pathnameWithoutLocale)) {
    const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!token) {
      const locale = getLocaleFromPathname(pathname);
      const signInUrl = new URL(`/${locale}/sign-in`, request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return applyCurrencyCookie(
        request,
        NextResponse.redirect(signInUrl)
      );
    }
  }

  return applyCurrencyCookie(request, handleI18nRouting(request));
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
