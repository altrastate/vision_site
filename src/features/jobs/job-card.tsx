import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  formatDate,
  formatExperienceLevel,
  formatJobType,
  formatSalary,
  formatWorkArrangement,
  initials,
} from "@/lib/jobs/format";
import type { JobListing } from "@/lib/jobs/types";
import { publicStorageUrl } from "@/lib/storage/public-url";

export function JobCard({ job }: { job: JobListing }) {
  const salary = formatSalary(job);
  const logo = publicStorageUrl("company-logos", job.company_logo_path);
  const href = `/jobs/${job.company_slug}/${job.job_slug}`;

  return (
    <Card className="flex h-full flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-[var(--color-gray)] text-sm font-semibold text-[var(--color-navy)]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(job.company_name)
          )}
        </div>
        <div>
          <Link href={href} className="font-display text-lg text-[var(--color-navy)] hover:underline">
            {job.title}
          </Link>
          <p className="text-sm text-[var(--color-charcoal)]/80">
            <Link href={`/companies/${job.company_slug}`} className="hover:underline">
              {job.company_name}
            </Link>
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {job.verification_status === "verified" ? <Badge>Verified employer</Badge> : null}
        <Badge>{formatJobType(job.job_type)}</Badge>
        <Badge>{formatWorkArrangement(job.work_arrangement)}</Badge>
        <Badge>{formatExperienceLevel(job.experience_level)}</Badge>
      </div>
      <p className="text-sm text-[var(--color-charcoal)]/75">
        {job.location_name ?? (job.is_remote ? "Remote" : "Location not specified")}
        {job.location_country ? ` · ${job.location_country}` : ""}
      </p>
      {salary ? <p className="text-sm font-medium text-[var(--color-navy)]">{salary}</p> : null}
      <p className="mt-auto text-xs text-[var(--color-charcoal)]/60">
        Posted {formatDate(job.published_at) ?? "recently"}
        {job.application_deadline
          ? ` · Apply by ${formatDate(job.application_deadline)}`
          : ""}
      </p>
    </Card>
  );
}
