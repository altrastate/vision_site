"use server";

import { redirect } from "next/navigation";

import { requireAuthenticatedUser } from "@/lib/auth/session";
import { hasPublicEnv } from "@/lib/env/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation/auth";

export async function signOutAction() {
  if (hasPublicEnv()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

export async function requestPasswordResetAction(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Enter a valid email." };
  }
  if (!hasPublicEnv()) {
    return { ok: false, message: "Password recovery is unavailable until Supabase is configured." };
  }
  const supabase = await createServerSupabaseClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  });
  if (error) {
    return { ok: false, message: "The reset request could not be sent. Try again shortly." };
  }
  return {
    ok: true,
    message:
      "If an account exists for that email, a reset link will arrive when email delivery is configured in Supabase.",
  };
}

export async function updatePasswordAction(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check your new password." };
  }
  await requireAuthenticatedUser();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true, message: "Your password has been updated." };
}

export async function resendConfirmationAction(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const email = String(formData.get("email") ?? "");
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return { ok: false, message: "Enter the email you used to register." };
  }
  if (!hasPublicEnv()) {
    return { ok: false, message: "Email confirmation cannot be resent until Supabase is configured." };
  }
  const supabase = await createServerSupabaseClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/seeker/profile` },
  });
  if (error) {
    return { ok: false, message: "The confirmation email could not be resent yet. Wait a minute and try again." };
  }
  return {
    ok: true,
    message: "If that address still needs confirmation, another email will be sent when delivery is enabled.",
  };
}

