import type { JobType, SalaryPeriod, WorkArrangement, ExperienceLevel } from "@/types/database";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: "Full time",
  part_time: "Part time",
  contract: "Contract",
  temporary: "Temporary",
  internship: "Internship",
};

const WORK_LABELS: Record<WorkArrangement, string> = {
  on_site: "On site",
  hybrid: "Hybrid",
  remote: "Remote",
};

const EXPERIENCE_LABELS: Record<ExperienceLevel, string> = {
  intern: "Intern",
  entry: "Entry level",
  mid: "Mid level",
  senior: "Senior",
  lead: "Lead",
  executive: "Executive",
};

const PERIOD_LABELS: Record<SalaryPeriod, string> = {
  hour: "hour",
  day: "day",
  week: "week",
  month: "month",
  year: "year",
};

export function formatJobType(value: JobType): string {
  return JOB_TYPE_LABELS[value];
}

export function formatWorkArrangement(value: WorkArrangement): string {
  return WORK_LABELS[value];
}

export function formatExperienceLevel(value: ExperienceLevel): string {
  return EXPERIENCE_LABELS[value];
}

export function formatDate(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en-UG")}`;
  }
}

export function formatSalary(input: {
  salary_is_disclosed: boolean;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  salary_period: SalaryPeriod;
}): string | null {
  if (!input.salary_is_disclosed) {
    return null;
  }
  const currency = input.salary_currency || "UGX";
  const period = PERIOD_LABELS[input.salary_period];
  if (input.salary_min != null && input.salary_max != null) {
    if (input.salary_min === input.salary_max) {
      return `${formatAmount(input.salary_min, currency)} / ${period}`;
    }
    return `${formatAmount(input.salary_min, currency)} – ${formatAmount(input.salary_max, currency)} / ${period}`;
  }
  if (input.salary_min != null) {
    return `From ${formatAmount(input.salary_min, currency)} / ${period}`;
  }
  if (input.salary_max != null) {
    return `Up to ${formatAmount(input.salary_max, currency)} / ${period}`;
  }
  return null;
}

export function isDeadlinePassed(deadline: string | null | undefined, now = new Date()): boolean {
  if (!deadline) return false;
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() <= now.getTime();
}

export function initials(name: string | null | undefined): string {
  if (!name) return "V";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "V";
}
