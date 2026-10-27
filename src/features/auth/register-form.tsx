"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/ui/password-field";
import { ConfigurationError } from "@/lib/env/errors";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { PASSWORD_HINT, registerSchema } from "@/lib/validation/auth";

export function RegisterForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setFormError(null);
    const form = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      full_name: form.get("full_name"),
      email: form.get("email"),
      password: form.get("password"),
      confirm_password: form.get("confirm_password"),
      intended_purpose: form.get("intended_purpose"),
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const origin = window.location.origin;
      const { data, error } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/seeker/profile`,
          data: {
            full_name: parsed.data.full_name,
            intended_purpose: parsed.data.intended_purpose,
          },
        },
      });
      if (error) {
        setFormError(friendlyAuthError(error.message));
        return;
      }
      if (data.session) {
        router.push("/seeker/profile");
        router.refresh();
        return;
      }
      router.push(`/auth/confirm?email=${encodeURIComponent(parsed.data.email)}`);
    } catch (caught) {
      setFormError(
        caught instanceof ConfigurationError
          ? caught.message
          : "Registration is unavailable until Supabase is configured.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required maxLength={120} />
        {errors.full_name ? <FieldError>{errors.full_name}</FieldError> : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        {errors.email ? <FieldError>{errors.email}</FieldError> : null}
      </div>
      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="new-password"
        hint={PASSWORD_HINT}
        error={errors.password}
        required
      />
      <PasswordField
        id="confirm_password"
        name="confirm_password"
        label="Confirm password"
        autoComplete="new-password"
        error={errors.confirm_password}
        required
      />
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-[var(--color-navy)]">I am joining as</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="intended_purpose" value="seeker" defaultChecked />
          Job seeker
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="intended_purpose" value="employer" />
          Employer
        </label>
        <p className="text-xs text-[var(--color-charcoal)]/70">
          This chooses your starting workspace. It does not verify an employer or grant
          administrator access.
        </p>
      </fieldset>
      {formError ? (
        <p className="text-sm text-red-700" role="alert">
          {formError}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-xs leading-5 text-[var(--color-charcoal)]/70">
        By creating an account you agree to the{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>
        .
      </p>
    </form>
  );
}

function FieldError({ children }: { children: string }) {
  return (
    <p className="text-sm text-red-700" role="alert">
      {children}
    </p>
  );
}

function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Sign in or recover your password.";
  }
  if (lower.includes("invalid email")) {
    return "That email address is not valid.";
  }
  return message;
}
