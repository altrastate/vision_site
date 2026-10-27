import { describe, expect, it } from "vitest";

import { formatDate, formatSalary, isDeadlinePassed } from "@/lib/jobs/format";

describe("salary formatting", () => {
  it("hides salary when it is not disclosed", () => {
    expect(
      formatSalary({
        salary_is_disclosed: false,
        salary_min: 1_000_000,
        salary_max: 2_000_000,
        salary_currency: "UGX",
        salary_period: "month",
      }),
    ).toBeNull();
  });

  it("formats a disclosed UGX range", () => {
    const text = formatSalary({
      salary_is_disclosed: true,
      salary_min: 1_000_000,
      salary_max: 2_000_000,
      salary_currency: "UGX",
      salary_period: "month",
    });
    expect(text).toMatch(/USh|UGX/);
    expect(text).toContain("month");
  });

  it("respects a non-UGX currency when present", () => {
    const text = formatSalary({
      salary_is_disclosed: true,
      salary_min: 500,
      salary_max: 500,
      salary_currency: "USD",
      salary_period: "month",
    });
    expect(text).toMatch(/US\$|USD/);
  });
});

describe("dates and deadlines", () => {
  it("formats a valid date for Uganda locale", () => {
    expect(formatDate("2026-03-01T00:00:00.000Z")).toContain("2026");
  });

  it("treats a past deadline as expired", () => {
    expect(isDeadlinePassed("2020-01-01T00:00:00.000Z", new Date("2026-01-01"))).toBe(true);
    expect(isDeadlinePassed("2030-01-01T00:00:00.000Z", new Date("2026-01-01"))).toBe(false);
    expect(isDeadlinePassed(null)).toBe(false);
  });
});
