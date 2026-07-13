import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/jwt";
import { readAuthCookie, AUTH_COOKIE_NAME } from "@/lib/cookies";
import { matchRoleRule, userHasAccess } from "@/lib/role-config";

/**
 * Paths that should NEVER go through Discord auth: OAuth flow itself,
 * public sign-in / denied pages, and the Next.js internals.
 *
 * We deliberately use exact-match (`===`) rather than prefix-match here
 * so that any future `/login/<something>` or `/unauthorized/<something>`
 * page stays protected by default.
 */
function isPublicPath(pathname: string): boolean {
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname === "/login" ||
    pathname === "/unauthorized"
  ) {
    return true;
  }
  return false;
}

/**
 * Edge-runtime middleware. Reads the `ftd_auth` cookie, verifies the JWT,
 * checks the user's Discord role IDs against the route-role rules in
 * `src/configs/roles.ts`, and redirects to /login or /unauthorized as
 * appropriate. `/api/auth/*` is explicitly allowed through so the OAuth
 * flow works.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = readAuthCookie(req);
  if (!token) return redirectToLogin(req);

  const payload = await verifySessionToken(token);
  if (!payload) return redirectToLogin(req, /* expired */ true);

  if (!userHasAccess(pathname, payload.roles, payload.discordId)) {
    const rule = matchRoleRule(pathname);
    const url = req.nextUrl.clone();
    url.pathname = "/unauthorized";
    url.searchParams.set("path", pathname);
    if (rule?.requireAnyRole?.length) {
      url.searchParams.set("hint", "role");
    }
    return NextResponse.redirect(url);
  }

  // We deliberately do NOT forward `x-ftd-*` headers to downstream handlers
  // — those would be a trust boundary issue, since the headers are just
  // mirror of the JWT contents and any API route that needs identity
  // should re-verify the cookie itself.
  return NextResponse.next();
}

function redirectToLogin(req: NextRequest, expired = false): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("returnTo", req.nextUrl.pathname + req.nextUrl.search);
  if (expired) url.searchParams.set("reason", "expired");
  return NextResponse.redirect(url);
}

/**
 * Limit middleware to non-static paths. Next.js auto-applies this matcher
 * and skips `_next/*`, `favicon.ico`, and common static extensions.
 */
export const config = {
  matcher: [
    /*
     * Match everything EXCEPT:
     *  - _next/static, _next/image (static assets)
     *  - favicon.ico / other files with extensions in the regex
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};

// Re-export so the cookie name lives next to the matcher for clarity.
export { AUTH_COOKIE_NAME };
