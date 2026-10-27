import { describe, expect, it } from "vitest";

import {
  hasActiveFilters,
  jobsPath,
  parseJobFilters,
  sanitizeSearchTerm,
  serializeJobFilters,
} from "@/lib/jobs/filters";

describe("job filter serialization", () => {
  it("parses and serializes supported filters", () => {
    const filters = parseJobFilters({
      q: "  nurse  ",
      location: "abc",
      type: "full_time",
      work: "hybrid",
      level: "entry",
      industry: "healthcare",
      salary: "disclosed",
      sort: "closing",
      page: "2",
    });

    expect(filters).toMatchObject({
      q: "nurse",
      locationId: "abc",
      jobType: "full_time",
      workArrangement: "hybrid",
      experienceLevel: "entry",
      industry: "healthcare",
      disclosedSalary: true,
      sort: "closing",
      page: 2,
    });

    expect(serializeJobFilters(filters).toString()).toContain("q=nurse");
    expect(jobsPath({ ...filters, page: 1 })).toContain("/jobs?");
  });

  it("ignores unsupported sort and type values", () => {
    const filters = parseJobFilters({ sort: "popularity", type: "gig", page: "0" });
    expect(filters.sort).toBe("newest");
    expect(filters.jobType).toBe("");
    expect(filters.page).toBe(1);
    expect(hasActiveFilters(filters)).toBe(false);
  });

  it("strips characters that could break PostgREST filters", () => {
    expect(sanitizeSearchTerm(`nurse%,()sql`)).toBe("nurse sql");
    expect(sanitizeSearchTerm("   ")).toBe("");
  });
});
