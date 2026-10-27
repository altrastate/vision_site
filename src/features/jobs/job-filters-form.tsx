import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EXPERIENCE_LEVELS,
  JOB_TYPES,
  WORK_ARRANGEMENTS,
  type JobFilters,
} from "@/lib/jobs/filters";
import { formatExperienceLevel, formatJobType, formatWorkArrangement } from "@/lib/jobs/format";

const selectClass =
  "h-11 w-full rounded-md border border-[var(--color-navy)]/15 bg-white px-3 text-sm text-[var(--color-charcoal)]";

type JobFiltersFormProps = {
  filters: JobFilters;
  locations: { id: string; name: string }[];
  industries: { name: string; slug: string }[];
};

export function JobFiltersForm({ filters, locations, industries }: JobFiltersFormProps) {
  return (
    <form method="get" action="/jobs" className="grid gap-3 rounded-xl border border-[var(--color-navy)]/10 bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-2 lg:col-span-2">
        <Label htmlFor="q">Search</Label>
        <Input id="q" name="q" defaultValue={filters.q} placeholder="Title, company, or keywords" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <select id="location" name="location" defaultValue={filters.locationId} className={selectClass}>
          <option value="">Any location</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Job type</Label>
        <select id="type" name="type" defaultValue={filters.jobType} className={selectClass}>
          <option value="">Any type</option>
          {JOB_TYPES.map((value) => (
            <option key={value} value={value}>
              {formatJobType(value)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="work">Work arrangement</Label>
        <select id="work" name="work" defaultValue={filters.workArrangement} className={selectClass}>
          <option value="">Any arrangement</option>
          {WORK_ARRANGEMENTS.map((value) => (
            <option key={value} value={value}>
              {formatWorkArrangement(value)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="level">Experience</Label>
        <select id="level" name="level" defaultValue={filters.experienceLevel} className={selectClass}>
          <option value="">Any level</option>
          {EXPERIENCE_LEVELS.map((value) => (
            <option key={value} value={value}>
              {formatExperienceLevel(value)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <select id="industry" name="industry" defaultValue={filters.industry} className={selectClass}>
          <option value="">Any industry</option>
          {industries.map((industry) => (
            <option key={industry.slug} value={industry.slug}>
              {industry.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="sort">Sort</Label>
        <select id="sort" name="sort" defaultValue={filters.sort} className={selectClass}>
          <option value="newest">Most recently published</option>
          <option value="closing">Closing soon</option>
          <option value="salary_ugx_month">Highest monthly UGX salary</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-[var(--color-navy)] lg:mt-7">
        <input type="checkbox" name="salary" value="disclosed" defaultChecked={filters.disclosedSalary} />
        Salary disclosed
      </label>
      <div className="flex flex-wrap items-end gap-3 lg:col-span-4">
        <Button type="submit">Apply filters</Button>
        <Link href="/jobs" className="text-sm font-medium text-[var(--color-navy)] underline">
          Clear all
        </Link>
      </div>
    </form>
  );
}
