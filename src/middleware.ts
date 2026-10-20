import { NextResponse, type NextRequest } from "next/server";

// lyfestyl.1moments.com serves the LYFESTYL pages from this same deployment.
// The subdomain's own paths are rewritten onto the /lyfestyl routes, and
// anything else on it (nav links like /artifacts) is sent to the main site.
// Hosts that don't start with "lyfestyl." are untouched. Locally, try
// http://lyfestyl.localhost:3000.

const SUBDOMAIN = "lyfestyl.";

const APP_PATHS: Record<string, string> = {
  "/": "/lyfestyl",
  "/privacy": "/lyfestyl/privacy",
  "/terms": "/lyfestyl/terms",
  "/support": "/lyfestyl/support",
};

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Routes are lowercase; send the brand spelling to the real one.
  if (pathname === "/LYFESTYL") {
    const url = req.nextUrl.clone();
    url.pathname = "/lyfestyl";
    return NextResponse.redirect(url, 308);
  }

  const host = req.headers.get("host") ?? "";
  if (!host.startsWith(SUBDOMAIN)) return NextResponse.next();

  // In-page links point at /lyfestyl/...; on the subdomain, drop the prefix
  // so the address bar shows lyfestyl.1moments.com/privacy.
  if (pathname === "/lyfestyl" || pathname.startsWith("/lyfestyl/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.slice("/lyfestyl".length) || "/";
    return NextResponse.redirect(url, 308);
  }

  const target = APP_PATHS[pathname];
  if (target) {
    const url = req.nextUrl.clone();
    url.pathname = target;
    return NextResponse.rewrite(url);
  }

  // Everything else lives on the main site. (Locally this can't be tried:
  // Next treats any loopback redirect as same-host and makes it relative.)
  const mainHost = host.slice(SUBDOMAIN.length);
  return NextResponse.redirect(
    new URL(`${pathname}${search}`, `${req.nextUrl.protocol}//${mainHost}`),
    307
  );
}

export const config = {
  // Skip Next internals, API routes, Vercel's own paths and static files.
  matcher: ["/((?!_next/|_vercel/|api/|.*\\.[a-zA-Z0-9]+$).*)"],
};
