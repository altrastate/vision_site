import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <PageContainer className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Register to save a professional profile. Choosing Employer does not verify a
          company or grant administrator access.
        </CardDescription>
        <div className="mt-6">
          <RegisterForm />
        </div>
        <p className="mt-4 text-sm text-[var(--color-charcoal)]/75">
          Already registered?{" "}
          <Link href="/auth/login" className="font-medium text-[var(--color-navy)] underline-offset-4 hover:underline">
            Sign in
          </Link>
        </p>
      </Card>
    </PageContainer>
  );
}
