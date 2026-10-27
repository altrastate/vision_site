import { NextResponse, type NextRequest } from "next/server";

import { safeInternalPath } from "@/lib/auth/redirects";
import { hasPublicEnv } from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeInternalPath(url.searchParams.get("next"), "/seeker/profile");
  const origin = url.origin;

  if (!hasPublicEnv()) {
    return NextResponse.redirect(`${origin}/auth/login?error=config`);
  }

  const supabase = await createServerSupabaseClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=callback`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type === "recovery" ? "recovery" : "email",
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(`${origin}/auth/login?error=expired`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/auth/login?error=callback`);
}
