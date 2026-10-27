import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { initials } from "@/lib/jobs/format";
import type { CompanyListing } from "@/lib/jobs/types";
import { publicStorageUrl } from "@/lib/storage/public-url";

export function CompanyCard({ company }: { company: CompanyListing }) {
  const logo = publicStorageUrl("company-logos", company.logo_path);

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--color-gray)] text-sm font-semibold text-[var(--color-navy)]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(company.name)
          )}
        </div>
        <div>
          <Link
            href={`/companies/${company.slug}`}
            className="font-display text-lg text-[var(--color-navy)] hover:underline"
          >
            {company.name}
          </Link>
          {company.industry_name ? (
            <p className="text-sm text-[var(--color-charcoal)]/75">{company.industry_name}</p>
          ) : null}
        </div>
      </div>
      {company.verification_status === "verified" ? <Badge>Verified employer</Badge> : null}
      <p className="text-sm text-[var(--color-charcoal)]/75">
        {company.location_name ?? company.country_code}
      </p>
      {company.description ? (
        <p className="line-clamp-3 text-sm leading-6 text-[var(--color-charcoal)]/80">
          {company.description}
        </p>
      ) : null}
      <p className="mt-auto text-xs text-[var(--color-charcoal)]/60">
        {company.active_job_count} open {company.active_job_count === 1 ? "job" : "jobs"}
      </p>
    </Card>
  );
}
