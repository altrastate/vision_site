import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";
import { safeInternalPath } from "@/lib/auth/redirects";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  config: "Sign-in is unavailable until Supabase is configured for this environment.",
  callback: "That confirmation or reset link could not be used. Request a new one.",
  expired: "That link has expired or was already used. Request a new one.",
  suspended: "This account cannot sign in. Contact VISION support if you need help.",
};

type PageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <Suspense>
      <LoginContent searchParams={searchParams} />
    </Suspense>
  );
}

async function LoginContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const nextPath = safeInternalPath(params.next, "/seeker/profile");
  const errorMessage = params.error ? ERRORS[params.error] : null;

  return (
    <PageContainer className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email and password for your VISION account.</CardDescription>
        {errorMessage ? (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-6">
          <LoginForm nextPath={nextPath} />
        </div>
        <p className="mt-4 text-sm text-[var(--color-charcoal)]/75">
          <Link href="/auth/forgot-password" className="font-medium text-[var(--color-navy)] underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </p>
        <p className="mt-2 text-sm text-[var(--color-charcoal)]/75">
          Need an account?{" "}
          <Link href="/auth/register" className="font-medium text-[var(--color-navy)] underline-offset-4 hover:underline">
            Create one
          </Link>
        </p>
      </Card>
    </PageContainer>
  );
}
