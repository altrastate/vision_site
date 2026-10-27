"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/features/auth/actions";

const initial = { ok: false, message: "" };

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      {state.message ? (
        <p className={state.ok ? "text-sm text-[var(--color-navy)]" : "text-sm text-red-700"} role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
