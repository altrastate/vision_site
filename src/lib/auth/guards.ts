import { redirect } from "next/navigation";

import { loginPath } from "@/lib/auth/redirects";
import {
  AccountStatusError,
  AuthenticationError,
  requireAuthenticatedUser,
  type AuthenticatedUser,
} from "@/lib/auth/session";
import { hasPublicEnv } from "@/lib/env/public";

export async function requirePageUser(nextPath = "/seeker/profile"): Promise<AuthenticatedUser> {
  if (!hasPublicEnv()) {
    redirect("/auth/login?error=config");
  }

  try {
    return await requireAuthenticatedUser();
  } catch (error) {
    if (error instanceof AccountStatusError) {
      redirect("/auth/login?error=suspended");
    }
    if (error instanceof AuthenticationError) {
      redirect(loginPath(nextPath));
    }
    redirect(loginPath(nextPath));
  }
}
