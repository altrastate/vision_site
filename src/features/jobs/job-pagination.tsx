import Link from "next/link";

import { PAGE_SIZE, jobsPath, type JobFilters } from "@/lib/jobs/filters";

export function JobPagination({ filters, total }: { filters: JobFilters; total: number }) {
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (pageCount <= 1) {
    return null;
  }

  const previous = filters.page > 1 ? jobsPath({ ...filters, page: filters.page - 1 }) : null;
  const next = filters.page < pageCount ? jobsPath({ ...filters, page: filters.page + 1 }) : null;

  return (
    <nav className="mt-8 flex items-center justify-between text-sm" aria-label="Pagination">
      {previous ? (
        <Link href={previous} className="font-medium text-[var(--color-navy)] underline">
          Previous
        </Link>
      ) : (
        <span className="text-[var(--color-charcoal)]/50">Previous</span>
      )}
      <p>
        Page {filters.page} of {pageCount}
      </p>
      {next ? (
        <Link href={next} className="font-medium text-[var(--color-navy)] underline">
          Next
        </Link>
      ) : (
        <span className="text-[var(--color-charcoal)]/50">Next</span>
      )}
    </nav>
  );
}
