"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendConfirmationAction } from "@/features/auth/actions";

const initial = { ok: false, message: "" };

export function ResendConfirmationForm({ email }: { email?: string }) {
  const [state, action, pending] = useActionState(resendConfirmationAction, initial);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          required
        />
      </div>
      {state.message ? (
        <p className={state.ok ? "text-sm text-[var(--color-navy)]" : "text-sm text-red-700"} role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Resend confirmation email"}
      </Button>
    </form>
  );
}
