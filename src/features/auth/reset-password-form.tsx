"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { updatePasswordAction } from "@/features/auth/actions";
import { PASSWORD_HINT } from "@/lib/validation/auth";

const initial = { ok: false, message: "" };

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePasswordAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <PasswordField
        id="password"
        name="password"
        label="New password"
        autoComplete="new-password"
        hint={PASSWORD_HINT}
        required
      />
      <PasswordField
        id="confirm_password"
        name="confirm_password"
        label="Confirm new password"
        autoComplete="new-password"
        required
      />
      {state.message ? (
        <p className={state.ok ? "text-sm text-[var(--color-navy)]" : "text-sm text-red-700"} role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
