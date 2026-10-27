import type { Metadata } from "next";
import { Suspense } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { JobCard } from "@/features/jobs/job-card";
import { JobFiltersForm } from "@/features/jobs/job-filters-form";
import { JobPagination } from "@/features/jobs/job-pagination";
import { parseJobFilters } from "@/lib/jobs/filters";
import { getFilterOptions, searchJobs } from "@/lib/jobs/query";

export const metadata: Metadata = {
  title: "Find jobs",
  description: "Browse published employment opportunities on VISION.",
  alternates: { canonical: "/jobs" },
};

type JobsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function JobsPage({ searchParams }: JobsPageProps) {
  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Find jobs</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-charcoal)]/80">
        Search published vacancies from employers on VISION. Results come from the live
        database when this environment is connected to Supabase.
      </p>
      <Suspense
        fallback={
          <div className="mt-8">
            <Spinner />
          </div>
        }
      >
        <JobsResults searchParams={searchParams} />
      </Suspense>
    </PageContainer>
  );
}

async function JobsResults({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const filters = parseJobFilters(params);
  const [result, options] = await Promise.all([searchJobs(filters), getFilterOptions()]);

  return (
    <>
      <div className="mt-8">
        <JobFiltersForm
          filters={filters}
          locations={options.ok ? options.data.locations : []}
          industries={options.ok ? options.data.industries : []}
        />
      </div>
      {!result.ok ? (
        <div className="mt-8">
          <EmptyState title="Jobs could not be loaded" description={result.message} />
        </div>
      ) : result.data.jobs.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={filters.q ? `No published jobs match “${filters.q}”` : "No published jobs yet"}
            description="VISION only lists vacancies that are published and still open. Refine the filters or check again later. No placeholder jobs are shown."
          />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-[var(--color-charcoal)]/75">
            {result.data.total} {result.data.total === 1 ? "job" : "jobs"} found
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {result.data.jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <JobPagination filters={filters} total={result.data.total} />
        </>
      )}
    </>
  );
}
