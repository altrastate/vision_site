import { Suspense } from "react";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { CompanyCard } from "@/features/jobs/company-card";
import { listCompanies } from "@/lib/jobs/query";

export const metadata: Metadata = {
  title: "Companies",
  description: "Browse employers with public profiles on VISION.",
  alternates: { canonical: "/companies" },
};

export default function CompaniesPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <Spinner />
        </PageContainer>
      }
    >
      <CompaniesResults />
    </Suspense>
  );
}

async function CompaniesResults() {
  const result = await listCompanies();

  return (
    <PageContainer>
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Companies</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-charcoal)]/80">
        Public employer profiles from the VISION directory. Internal membership and
        verification notes stay private.
      </p>
      {!result.ok ? (
        <div className="mt-8">
          <EmptyState title="Companies could not be loaded" description={result.message} />
        </div>
      ) : result.data.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No public companies yet"
            description="Employer profiles appear here once they exist in the directory. VISION does not invent organisations."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
