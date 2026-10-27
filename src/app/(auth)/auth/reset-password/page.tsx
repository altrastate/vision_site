import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { hasPublicEnv } from "@/lib/env/public";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}

async function ResetPasswordContent() {
  const user = hasPublicEnv() ? await getAuthenticatedUser().catch(() => null) : null;

  return (
    <PageContainer className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Set a new password</CardTitle>
        {user ? (
          <>
            <CardDescription>
              Choose a new password for {user.email ?? "your account"}.
            </CardDescription>
            <div className="mt-6">
              <ResetPasswordForm />
            </div>
          </>
        ) : (
          <>
            <CardDescription>
              This reset session is missing or has expired. Request a new password-recovery
              email and open the latest link.
            </CardDescription>
            <p className="mt-6 text-sm">
              <Link href="/auth/forgot-password" className="font-medium text-[var(--color-navy)] underline">
                Request a new reset link
              </Link>
            </p>
          </>
        )}
      </Card>
    </PageContainer>
  );
}
