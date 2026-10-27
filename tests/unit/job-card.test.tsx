/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EmptyState } from "@/components/ui/empty-state";
import { JobCard } from "@/features/jobs/job-card";
import type { JobListing } from "@/lib/jobs/types";

const baseJob: JobListing = {
  id: "job-1",
  company_id: "co-1",
  title: "Registered Nurse",
  job_slug: "registered-nurse",
  company_slug: "kampala-health",
  company_name: "Kampala Health",
  company_logo_path: null,
  verification_status: "unverified",
  industry_id: null,
  industry_name: "Healthcare",
  industry_slug: "healthcare",
  description: "Provide patient care.",
  responsibilities: null,
  qualifications: null,
  job_type: "full_time",
  work_arrangement: "on_site",
  experience_level: "mid",
  location_id: null,
  location_name: "Kampala",
  location_region: "Central",
  location_country: "UG",
  is_remote: false,
  salary_min: 1_500_000,
  salary_max: 2_000_000,
  salary_currency: "UGX",
  salary_period: "month",
  salary_is_disclosed: true,
  published_at: "2026-10-01T00:00:00.000Z",
  application_deadline: "2026-12-01T00:00:00.000Z",
  created_at: "2026-10-01T00:00:00.000Z",
  updated_at: "2026-10-01T00:00:00.000Z",
};

afterEach(() => {
  cleanup();
});

describe("job cards", () => {
  it("renders disclosed salary and hides unverified badges", () => {
    render(<JobCard job={baseJob} />);
    expect(screen.getByText("Registered Nurse")).toBeTruthy();
    expect(screen.getByText("Kampala Health")).toBeTruthy();
    expect(screen.queryByText("Verified employer")).toBeNull();
    expect(screen.getByText(/USh|UGX/)).toBeTruthy();
  });

  it("omits salary when it is not disclosed", () => {
    render(
      <JobCard
        job={{
          ...baseJob,
          salary_is_disclosed: false,
          salary_min: null,
          salary_max: null,
        }}
      />,
    );
    expect(screen.queryByText(/USh|UGX/)).toBeNull();
  });

  it("shows a verified badge only for verified employers", () => {
    render(<JobCard job={{ ...baseJob, verification_status: "verified" }} />);
    expect(screen.getByText("Verified employer")).toBeTruthy();
  });
});

describe("empty and error states", () => {
  it("renders the provided title and description", () => {
    render(
      <EmptyState
        title="No published jobs yet"
        description="VISION does not invent vacancies."
      />,
    );
    expect(screen.getByText("No published jobs yet")).toBeTruthy();
    expect(screen.getByText("VISION does not invent vacancies.")).toBeTruthy();
  });
});
