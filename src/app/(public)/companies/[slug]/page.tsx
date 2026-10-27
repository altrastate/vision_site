import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/features/jobs/job-card";
import { initials } from "@/lib/jobs/format";
import { getCompanyBySlug, getCompanyJobs } from "@/lib/jobs/query";
import { publicStorageUrl } from "@/lib/storage/public-url";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getCompanyBySlug(slug);
  if (!result.ok || !result.data) {
    return { title: "Company not found", robots: { index: false, follow: false } };
  }
  return {
    title: result.data.name,
    description: result.data.description?.slice(0, 160) ?? `Public employer profile for ${result.data.name}.`,
    alternates: { canonical: `/companies/${slug}` },
  };
}

export default function CompanyDetailPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Spinner />
        </PageContainer>
      }
    >
      <CompanyDetail params={params} />
    </Suspense>
  );
}

async function CompanyDetail({ params }: PageProps) {
  const { slug } = await params;
  const result = await getCompanyBySlug(slug);
  if (!result.ok) {
    return (
      <PageContainer>
        <h1 className="font-display text-3xl text-[var(--color-navy)]">Company unavailable</h1>
        <p className="mt-3 text-sm">{result.message}</p>
      </PageContainer>
    );
  }
  if (!result.data) {
    notFound();
  }

  const company = result.data;
  const jobs = await getCompanyJobs(company.id);
  const logo = publicStorageUrl("company-logos", company.logo_path);

  return (
    <PageContainer>
      <p className="text-sm">
        <Link href="/companies" className="underline">
          Companies
        </Link>
      </p>
      <div className="mt-4 flex items-start gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-md bg-white text-lg font-semibold text-[var(--color-navy)]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(company.name)
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl text-[var(--color-navy)]">{company.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2">
            {company.verification_status === "verified" ? <Badge>Verified employer</Badge> : null}
            {company.industry_name ? <Badge>{company.industry_name}</Badge> : null}
          </div>
          <p className="mt-2 text-sm text-[var(--color-charcoal)]/75">
            {company.location_name ?? company.country_code}
          </p>
        </div>
      </div>
      {company.description ? (
        <p className="mt-6 max-w-3xl text-sm leading-7 text-[var(--color-charcoal)]/85">
          {company.description}
        </p>
      ) : null}
      {company.website_url ? (
        <p className="mt-3 text-sm">
          <a href={company.website_url} className="underline" rel="noopener noreferrer">
            Company website
          </a>
        </p>
      ) : null}
      <h2 className="mt-10 font-display text-2xl text-[var(--color-navy)]">Open jobs</h2>
      {!jobs.ok ? (
        <p className="mt-4 text-sm">{jobs.message}</p>
      ) : jobs.data.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No open jobs right now"
            description="This employer has no published vacancies that are still accepting applications."
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {jobs.data.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
