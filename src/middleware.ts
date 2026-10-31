import NextAuth from "next-auth";
import {
  type NextFetchEvent,
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from "next/server";
import { authConfig } from "@/lib/auth.config";
import { detectLocaleRedirect, LOCALE_COOKIE } from "@/lib/i18n";

/**
 * ANTI-PATTERN WARNING (spec §5.6-2): do NOT import `@/lib/auth` here, and do
 * not add any network/db call to this file. `@/lib/auth` wires up
 * `DrizzleAdapter` (pulling in `@electric-sql/pglite`/`postgres`), which is
 * Node-only — bundling it into Middleware would either break the Edge
 * runtime or, worse, silently add a per-request database round trip to
 * every matched request (the classic "call a `getUser()`-style API in
 * middleware" latency trap).
 *
 * This file builds its own `NextAuth()` instance from the edge-safe
 * `authConfig` alone (no adapter), so `auth()` below only decodes the
 * JWT/cookie already present on the request and runs the pure, in-memory
 * `authorized()` callback (path-based only — see auth.config.ts). It is a
 * coarse, fast, optimistic gate. `requireUser()`
 * (src/features/auth/require-user.ts) is the real guard that hits the
 * database via the full `auth()`, and every protected server
 * component/action must call it directly — never rely on middleware alone
 * for authorization.
 *
 * The storefront paths get the language redirect instead: a pure function of
 * the request's own cookie and headers (src/lib/i18n.ts), nothing remote.
 * The RU static export stashes this file; ludvik4.ru has no middleware.
 */
const { auth } = NextAuth(authConfig);
const authMiddleware = auth as unknown as NextMiddleware;

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/dashboard")) return authMiddleware(request, event);
  if (request.method !== "GET" && request.method !== "HEAD") return;

  const target = detectLocaleRedirect({
    pathname,
    search,
    savedLocale: request.cookies.get(LOCALE_COOKIE)?.value,
    acceptLanguage: request.headers.get("accept-language"),
    userAgent: request.headers.get("user-agent"),
  });
  if (!target) return;
  return NextResponse.redirect(new URL(target, request.url), 307);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    // The English storefront pages that exist in every language
    // (isTranslatedPath in src/lib/i18n.ts).
    "/",
    "/services/:path*",
    "/work/:path*",
    "/about",
    "/contact",
    "/privacy",
    "/cookies",
    "/legal-notice",
    "/terms-of-service",
  ],
};
