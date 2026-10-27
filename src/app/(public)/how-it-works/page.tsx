import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How it works",
  description: "How job seekers and employers use VISION.",
  alternates: { canonical: "/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <PageContainer className="max-w-3xl space-y-6">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">How VISION works</h1>
      <p className="text-sm leading-7 text-[var(--color-charcoal)]/80">
        VISION is a Uganda-first employment platform from Altrastate Technologies Ltd. The
        current release covers discovery, accounts, and professional profiles.
      </p>
      <Card>
        <CardTitle>1. Browse published jobs</CardTitle>
        <CardDescription>
          Anyone can search public vacancies without an account. Only jobs that are published
          and still within their application deadline appear.
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>2. Create an account</CardTitle>
        <CardDescription>
          Register as a job seeker or employer. That choice is an onboarding preference. It
          does not verify a company or grant administrator access.
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>3. Build a profile</CardTitle>
        <CardDescription>
          Add a name, headline, summary, location, and optional photo. Incomplete profiles can
          still browse jobs.
        </CardDescription>
      </Card>
      <Card>
        <CardTitle>Coming later</CardTitle>
        <CardDescription>
          Job applications, CV management, employer vacancy dashboards, and interviews belong
          to later phases. Those controls are not shown as if they already work.
        </CardDescription>
      </Card>
      <p className="text-sm">
        <Link href="/jobs" className="font-medium text-[var(--color-navy)] underline">
          Find jobs
        </Link>
        {" · "}
        <Link href="/auth/register" className="font-medium text-[var(--color-navy)] underline">
          Create an account
        </Link>
      </p>
    </PageContainer>
  );
}
