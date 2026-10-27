import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <PageContainer className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Enter the email for your account. If it exists, a reset link can be sent when
          Supabase email delivery is configured.
        </CardDescription>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-4 text-sm text-[var(--color-charcoal)]/75">
          <Link href="/auth/login" className="font-medium text-[var(--color-navy)] underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </Card>
    </PageContainer>
  );
}
