import type { ExperienceLevel, JobType, WorkArrangement } from "@/types/database";

export const PAGE_SIZE = 12;

export const JOB_TYPES: JobType[] = [
  "full_time",
  "part_time",
  "contract",
  "temporary",
  "internship",
];

export const WORK_ARRANGEMENTS: WorkArrangement[] = ["on_site", "hybrid", "remote"];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "intern",
  "entry",
  "mid",
  "senior",
  "lead",
  "executive",
];

export const SORT_OPTIONS = ["newest", "closing", "salary_ugx_month"] as const;
export type JobSort = (typeof SORT_OPTIONS)[number];

export type JobFilters = {
  q: string;
  locationId: string;
  jobType: JobType | "";
  workArrangement: WorkArrangement | "";
  experienceLevel: ExperienceLevel | "";
  industry: string;
  disclosedSalary: boolean;
  sort: JobSort;
  page: number;
};

const EMPTY: JobFilters = {
  q: "",
  locationId: "",
  jobType: "",
  workArrangement: "",
  experienceLevel: "",
  industry: "",
  disclosedSalary: false,
  sort: "newest",
  page: 1,
};

export function sanitizeSearchTerm(value: string): string {
  return value
    .replace(/["\\]/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function parseJobFilters(
  params: Record<string, string | string[] | undefined>,
): JobFilters {
  const sortRaw = first(params.sort);
  const sort: JobSort = SORT_OPTIONS.includes(sortRaw as JobSort)
    ? (sortRaw as JobSort)
    : "newest";
  const page = Math.max(1, Number.parseInt(first(params.page) || "1", 10) || 1);

  return {
    q: sanitizeSearchTerm(first(params.q)),
    locationId: first(params.location),
    jobType: JOB_TYPES.includes(first(params.type) as JobType)
      ? (first(params.type) as JobType)
      : "",
    workArrangement: WORK_ARRANGEMENTS.includes(first(params.work) as WorkArrangement)
      ? (first(params.work) as WorkArrangement)
      : "",
    experienceLevel: EXPERIENCE_LEVELS.includes(first(params.level) as ExperienceLevel)
      ? (first(params.level) as ExperienceLevel)
      : "",
    industry: first(params.industry),
    disclosedSalary: first(params.salary) === "disclosed",
    sort,
    page,
  };
}

export function serializeJobFilters(filters: Partial<JobFilters>): URLSearchParams {
  const params = new URLSearchParams();
  const merged = { ...EMPTY, ...filters };
  if (merged.q) params.set("q", merged.q);
  if (merged.locationId) params.set("location", merged.locationId);
  if (merged.jobType) params.set("type", merged.jobType);
  if (merged.workArrangement) params.set("work", merged.workArrangement);
  if (merged.experienceLevel) params.set("level", merged.experienceLevel);
  if (merged.industry) params.set("industry", merged.industry);
  if (merged.disclosedSalary) params.set("salary", "disclosed");
  if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
  if (merged.page > 1) params.set("page", String(merged.page));
  return params;
}

export function jobsPath(filters: Partial<JobFilters>): string {
  const params = serializeJobFilters(filters);
  const query = params.toString();
  return query ? `/jobs?${query}` : "/jobs";
}

export function hasActiveFilters(filters: JobFilters): boolean {
  return Boolean(
    filters.q ||
      filters.locationId ||
      filters.jobType ||
      filters.workArrangement ||
      filters.experienceLevel ||
      filters.industry ||
      filters.disclosedSalary ||
      filters.sort !== "newest",
  );
}
