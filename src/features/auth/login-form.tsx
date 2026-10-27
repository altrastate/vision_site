"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/ui/password-field";
import { ConfigurationError } from "@/lib/env/errors";
import { safeInternalPath } from "@/lib/auth/redirects";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validation/auth";

export function LoginForm({ nextPath }: { nextPath?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [email, setEmail] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNeedsVerification(false);
    const form = new FormData(event.currentTarget);
    const parsed = loginSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      next: nextPath,
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your email and password.");
      return;
    }
    setEmail(parsed.data.email);
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (signInError) {
        const lower = signInError.message.toLowerCase();
        if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
          setNeedsVerification(true);
          setError("Confirm your email before signing in. Check your inbox for the VISION link.");
          return;
        }
        setError("Those details did not match an account. Check the email and password.");
        return;
      }
      router.push(safeInternalPath(nextPath, "/seeker/profile"));
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof ConfigurationError
          ? caught.message
          : "Sign-in is unavailable until Supabase is configured.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
        required
      />
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {needsVerification ? (
        <p className="text-sm text-[var(--color-navy)]">
          Need a new link?{" "}
          <a className="underline" href={`/auth/confirm?email=${encodeURIComponent(email)}`}>
            Resend confirmation
          </a>
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
