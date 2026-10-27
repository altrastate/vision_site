import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ResendConfirmationForm } from "@/features/auth/resend-confirmation-form";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default function ConfirmPage({ searchParams }: PageProps) {
  return (
    <Suspense>
      <ConfirmContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ConfirmContent({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <PageContainer className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardTitle>Check your inbox</CardTitle>
        <CardDescription>
          If email confirmation is enabled for this VISION project, open the message from
          Supabase and follow the link. Delivery depends on the project&apos;s Auth email
          settings and has not been assumed to work until those settings are tested.
        </CardDescription>
        <div className="mt-6">
          <ResendConfirmationForm email={params.email} />
        </div>
      </Card>
    </PageContainer>
  );
}
