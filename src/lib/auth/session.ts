import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { AccountStatus, AppRole } from "@/types/database";

export type AuthenticatedUser = {
  id: string;
  email: string | undefined;
  fullName: string | null;
  accountStatus: AccountStatus | null;
  roles: AppRole[];
};

export class AuthenticationError extends Error {
  constructor(message = "Authentication required.") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class AccountStatusError extends Error {
  constructor(readonly accountStatus: AccountStatus) {
    super(`This account is ${accountStatus} and cannot continue.`);
    this.name = "AccountStatusError";
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims.sub) {
    return null;
  }

  const userId = data.claims.sub;
  const email = typeof data.claims.email === "string" ? data.claims.email : undefined;

  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("account_status, full_name").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);

  return {
    id: userId,
    email,
    fullName: profile?.full_name ?? null,
    accountStatus: profile?.account_status ?? null,
    roles: (roleRows ?? []).map((row) => row.role),
  };
}

export async function requireAuthenticatedUser(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new AuthenticationError();
  }
  if (user.accountStatus === "suspended") {
    throw new AccountStatusError("suspended");
  }
  return user;
}

export function hasRole(user: AuthenticatedUser, role: AppRole): boolean {
  return user.roles.includes(role);
}

export function isStaff(user: AuthenticatedUser): boolean {
  return user.roles.includes("admin") || user.roles.includes("moderator");
}
