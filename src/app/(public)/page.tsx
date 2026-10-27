import Link from "next/link";
import { Suspense } from "react";
import { Briefcase, Building2, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/features/jobs/job-card";
import { JobSearchForm } from "@/features/jobs/job-search-form";
import { getRecentJobs } from "@/lib/jobs/query";

export const metadata: Metadata = {
  title: "VISION — See opportunity. Find your future.",
  description:
    "VISION is a Uganda-first employment platform connecting job seekers with employers.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="bg-[var(--color-navy)] text-white">
        <PageContainer className="grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <Badge className="bg-white/10 text-[var(--color-cyan)]">Uganda first</Badge>
            <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              See opportunity.
              <br />
              Find your future.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              VISION helps people in Uganda discover genuine published jobs, understand the
              companies offering them, and build a professional profile.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/jobs"
                className="inline-flex h-11 items-center rounded-md bg-[var(--color-cyan)] px-4 text-sm font-medium text-[var(--color-navy)]"
              >
                Browse jobs
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-11 items-center rounded-md border border-white/20 px-4 text-sm font-medium text-white"
              >
                How VISION works
              </Link>
            </div>
          </div>
          <JobSearchForm />
        </PageContainer>
      </section>

      <Suspense
        fallback={
          <PageContainer>
            <Spinner />
          </PageContainer>
        }
      >
        <RecentJobsSection />
      </Suspense>

      <PageContainer className="grid gap-6 md:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-cyan)]">
            Job seekers
          </p>
          <CardTitle className="mt-2">Create a professional profile</CardTitle>
          <CardDescription>
            Register, confirm your email, and keep a clear profile. Applications and CV
            workflows come in a later phase.
          </CardDescription>
          <Link
            href="/auth/register"
            className="mt-4 inline-flex text-sm font-medium text-[var(--color-navy)] underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-cyan)]">
            Employers
          </p>
          <CardTitle className="mt-2">Company pages first</CardTitle>
          <CardDescription>
            Employer job posting and applicant review ship in Phase Three. Creating an
            employer-ready account now does not verify a company.
          </CardDescription>
          <Link
            href="/companies"
            className="mt-4 inline-flex text-sm font-medium text-[var(--color-navy)] underline-offset-4 hover:underline"
          >
            Browse companies
          </Link>
        </Card>
      </PageContainer>

      <section className="bg-white">
        <PageContainer className="grid gap-6 md:grid-cols-3">
          <Card className="border-none shadow-none">
            <Briefcase className="h-6 w-6 text-[var(--color-navy)]" aria-hidden="true" />
            <CardTitle className="mt-4">Published jobs only</CardTitle>
            <CardDescription>
              Discovery uses the public job listings view. Drafts, expired deadlines, and
              closed vacancies stay out of search.
            </CardDescription>
          </Card>
          <Card className="border-none shadow-none">
            <Building2 className="h-6 w-6 text-[var(--color-navy)]" aria-hidden="true" />
            <CardTitle className="mt-4">Company-first employers</CardTitle>
            <CardDescription>
              Hiring happens through companies and membership roles, not a personal dashboard
              pretending to be an ATS.
            </CardDescription>
          </Card>
          <Card className="border-none shadow-none">
            <ShieldCheck className="h-6 w-6 text-[var(--color-navy)]" aria-hidden="true" />
            <CardTitle className="mt-4">Trust and safety</CardTitle>
            <CardDescription>
              Private profile fields, including phone numbers, are not shown on public pages.
              Privileged roles cannot be self-assigned from registration.
            </CardDescription>
          </Card>
        </PageContainer>
      </section>
    </>
  );
}

async function RecentJobsSection() {
  const recent = await getRecentJobs(6);

  return (
    <PageContainer>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-[var(--color-navy)]">Recent jobs</h2>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]/75">
            Published vacancies from the live directory, when this environment is connected.
          </p>
        </div>
        <Link href="/jobs" className="text-sm font-medium text-[var(--color-navy)] underline">
          View all
        </Link>
      </div>
      {!recent.ok ? (
        <div className="mt-6">
          <EmptyState title="Jobs could not be loaded" description={recent.message} />
        </div>
      ) : recent.data.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="No published jobs yet"
            description="When employers publish vacancies, they will appear here. VISION does not invent listings or success counts."
            action={
              <Link href="/jobs" className="text-sm font-medium text-[var(--color-navy)] underline">
                Open the job search
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
