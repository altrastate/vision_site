"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfigurationError } from "@/lib/env/errors";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { signUpSchema } from "@/lib/validation/profile";

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      full_name: form.get("full_name"),
    });

    if (!parsed.success) {
      setPending(false);
      setError("Check your name, email, and password (8+ characters).");
      return;
    }

    try {
      const supabase = createBrowserSupabaseClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: parsed.data.email,
        password: parsed.data.password,
        options: {
          data: { full_name: parsed.data.full_name },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setNotice(
        "If this project has email confirmation enabled, check your inbox before signing in. Profile provisioning happens on the server when the Auth user is created.",
      );
    } catch (caught) {
      if (caught instanceof ConfigurationError) {
        setError(caught.message);
      } else {
        setError("Registration is unavailable until Supabase is configured.");
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input id="full_name" name="full_name" autoComplete="name" required maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {notice ? <p className="text-sm text-[var(--color-navy)]">{notice}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
