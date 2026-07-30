import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "./lib/auth-cookie";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

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
      return NextResponse.redirect(signInUrl);
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
