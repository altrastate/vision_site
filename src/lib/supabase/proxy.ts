import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { safeInternalPath } from "@/lib/auth/redirects";
import { hasPublicEnv, getPublicEnv } from "@/lib/env/public";
import { logger } from "@/lib/logging/logger";

const PROTECTED_PREFIXES = ["/seeker", "/employer", "/admin"];

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  if (!hasPublicEnv()) {
    return NextResponse.next({ request });
  }

  const env = getPublicEnv();
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(env.supabaseUrl, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  try {
    const { data } = await supabase.auth.getClaims();
    const path = request.nextUrl.pathname;
    const isProtected = PROTECTED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
    if (isProtected && !data?.claims.sub) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `?next=${encodeURIComponent(safeInternalPath(`${path}${request.nextUrl.search}`, "/seeker/profile"))}`;
      const redirect = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirect.cookies.set(cookie);
      });
      return redirect;
    }
  } catch (error) {
    logger.warn("session refresh failed", {
      path: request.nextUrl.pathname,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }

  return supabaseResponse;
}
