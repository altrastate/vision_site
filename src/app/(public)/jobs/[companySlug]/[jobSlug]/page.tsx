import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  formatDate,
  formatExperienceLevel,
  formatJobType,
  formatSalary,
  formatWorkArrangement,
  initials,
} from "@/lib/jobs/format";
import { getJobBySlugs } from "@/lib/jobs/query";
import { publicStorageUrl } from "@/lib/storage/public-url";

type PageProps = {
  params: Promise<{ companySlug: string; jobSlug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { companySlug, jobSlug } = await params;
  const result = await getJobBySlugs(companySlug, jobSlug);
  if (!result.ok || !result.data) {
    return { title: "Job not found", robots: { index: false, follow: false } };
  }
  const job = result.data;
  return {
    title: `${job.title} at ${job.company_name}`,
    description: `${formatJobType(job.job_type)} role in ${job.location_name ?? (job.is_remote ? "a remote setting" : "Uganda")}.`,
    alternates: { canonical: `/jobs/${companySlug}/${jobSlug}` },
  };
}

export default function JobDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Spinner />
        </PageContainer>
      }
    >
      <JobDetail params={params} />
    </Suspense>
  );
}

async function JobDetail({ params }: PageProps) {
  const { companySlug, jobSlug } = await params;
  const result = await getJobBySlugs(companySlug, jobSlug);
  if (!result.ok) {
    return (
      <PageContainer>
        <h1 className="font-display text-3xl text-[var(--color-navy)]">Job unavailable</h1>
        <p className="mt-3 text-sm text-[var(--color-charcoal)]/75">{result.message}</p>
      </PageContainer>
    );
  }
  if (!result.data) {
    notFound();
  }

  const job = result.data;
  const salary = formatSalary(job);
  const logo = publicStorageUrl("company-logos", job.company_logo_path);

  return (
    <PageContainer className="grid gap-8 lg:grid-cols-[1.4fr_0.7fr]">
      <article>
        <p className="text-sm text-[var(--color-charcoal)]/70">
          <Link href="/jobs" className="underline">
            Jobs
          </Link>{" "}
          / {job.company_name}
        </p>
        <h1 className="mt-3 font-display text-3xl text-[var(--color-navy)] sm:text-4xl">{job.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {job.verification_status === "verified" ? <Badge>Verified employer</Badge> : null}
          <Badge>{formatJobType(job.job_type)}</Badge>
          <Badge>{formatWorkArrangement(job.work_arrangement)}</Badge>
          <Badge>{formatExperienceLevel(job.experience_level)}</Badge>
        </div>
        <p className="mt-4 text-sm text-[var(--color-charcoal)]/80">
          {job.location_name ?? (job.is_remote ? "Remote" : "Location not specified")}
          {job.location_country ? ` · ${job.location_country}` : ""}
        </p>
        {salary ? <p className="mt-2 text-lg font-medium text-[var(--color-navy)]">{salary}</p> : null}
        <section className="mt-8 space-y-4 text-sm leading-7 text-[var(--color-charcoal)]/85">
          <h2 className="font-display text-xl text-[var(--color-navy)]">About this role</h2>
          <p className="whitespace-pre-wrap">{job.description}</p>
          {job.responsibilities ? (
            <>
              <h2 className="font-display text-xl text-[var(--color-navy)]">Responsibilities</h2>
              <p className="whitespace-pre-wrap">{job.responsibilities}</p>
            </>
          ) : null}
          {job.qualifications ? (
            <>
              <h2 className="font-display text-xl text-[var(--color-navy)]">Requirements</h2>
              <p className="whitespace-pre-wrap">{job.qualifications}</p>
            </>
          ) : null}
        </section>
        <p className="mt-8 rounded-md border border-dashed border-[var(--color-navy)]/20 bg-white p-4 text-sm text-[var(--color-charcoal)]/75">
          Applications open in a later phase. Saving jobs will also arrive then. You can still
          create a profile and follow the employer page.
        </p>
      </article>
      <aside className="space-y-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[var(--color-gray)] font-semibold text-[var(--color-navy)]">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logo} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(job.company_name)
              )}
            </div>
            <div>
              <p className="font-medium text-[var(--color-navy)]">{job.company_name}</p>
              <Link href={`/companies/${job.company_slug}`} className="text-sm underline">
                Company profile
              </Link>
            </div>
          </div>
        </Card>
        <Card className="space-y-2 text-sm">
          <p>Posted {formatDate(job.published_at) ?? "recently"}</p>
          {job.application_deadline ? <p>Apply by {formatDate(job.application_deadline)}</p> : null}
          {job.industry_name ? <p>Industry: {job.industry_name}</p> : null}
        </Card>
      </aside>
    </PageContainer>
  );
}
