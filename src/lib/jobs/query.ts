import "server-only";

import { ConfigurationError } from "@/lib/env/errors";
import { hasPublicEnv } from "@/lib/env/public";
import { PAGE_SIZE, type JobFilters } from "@/lib/jobs/filters";
import { isDeadlinePassed } from "@/lib/jobs/format";
import type { CompanyListing, JobListing } from "@/lib/jobs/types";
import { createPublicSupabaseClient } from "@/lib/supabase/public";

export type { CompanyListing, JobListing };

export type QueryResult<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unconfigured" | "unavailable"; message: string };

function unavailable(error: unknown): QueryResult<never> {
  if (error instanceof ConfigurationError || !hasPublicEnv()) {
    return {
      ok: false,
      reason: "unconfigured",
      message: "Job data is unavailable until Supabase is configured for this environment.",
    };
  }
  return {
    ok: false,
    reason: "unavailable",
    message: "The job directory could not be loaded. Try again shortly.",
  };
}

export async function searchJobs(
  filters: JobFilters,
): Promise<QueryResult<{ jobs: JobListing[]; total: number }>> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }

  try {
    const supabase = createPublicSupabaseClient();
    const from = (filters.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase.from("job_listings").select("*", { count: "exact" });

    if (filters.q) {
      const term = `"%${filters.q}%"`;
      query = query.or(`title.ilike.${term},company_name.ilike.${term},description.ilike.${term}`);
    }
    if (filters.locationId) query = query.eq("location_id", filters.locationId);
    if (filters.jobType) query = query.eq("job_type", filters.jobType);
    if (filters.workArrangement) query = query.eq("work_arrangement", filters.workArrangement);
    if (filters.experienceLevel) query = query.eq("experience_level", filters.experienceLevel);
    if (filters.industry) query = query.eq("industry_slug", filters.industry);
    if (filters.disclosedSalary) query = query.eq("salary_is_disclosed", true);
    if (filters.sort === "salary_ugx_month") {
      query = query
        .eq("salary_is_disclosed", true)
        .eq("salary_currency", "UGX")
        .eq("salary_period", "month");
    }

    if (filters.sort === "closing") {
      query = query.order("application_deadline", { ascending: true, nullsFirst: false });
    } else if (filters.sort === "salary_ugx_month") {
      query = query.order("salary_min", { ascending: false, nullsFirst: false });
    } else {
      query = query.order("published_at", { ascending: false, nullsFirst: false });
    }

    query = query.order("id", { ascending: true }).range(from, to);

    const { data, error, count } = await query;
    if (error) {
      return unavailable(error);
    }

    const jobs = (data ?? []).filter((job) => !isDeadlinePassed(job.application_deadline));
    return { ok: true, data: { jobs, total: count ?? jobs.length } };
  } catch (error) {
    return unavailable(error);
  }
}

export async function getRecentJobs(limit = 6): Promise<QueryResult<JobListing[]>> {
  const result = await searchJobs({
    q: "",
    locationId: "",
    jobType: "",
    workArrangement: "",
    experienceLevel: "",
    industry: "",
    disclosedSalary: false,
    sort: "newest",
    page: 1,
  });
  if (!result.ok) return result;
  return { ok: true, data: result.data.jobs.slice(0, limit) };
}

export async function getJobBySlugs(
  companySlug: string,
  jobSlug: string,
): Promise<QueryResult<JobListing | null>> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("job_listings")
      .select("*")
      .eq("company_slug", companySlug)
      .eq("job_slug", jobSlug)
      .maybeSingle();
    if (error) return unavailable(error);
    if (data && isDeadlinePassed(data.application_deadline)) {
      return { ok: true, data: null };
    }
    return { ok: true, data: data ?? null };
  } catch (error) {
    return unavailable(error);
  }
}

export async function listCompanies(): Promise<QueryResult<CompanyListing[]>> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("company_listings")
      .select("*")
      .order("name", { ascending: true });
    if (error) return unavailable(error);
    return { ok: true, data: data ?? [] };
  } catch (error) {
    return unavailable(error);
  }
}

export async function getCompanyBySlug(
  slug: string,
): Promise<QueryResult<CompanyListing | null>> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("company_listings")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) return unavailable(error);
    return { ok: true, data: data ?? null };
  } catch (error) {
    return unavailable(error);
  }
}

export async function getCompanyJobs(companyId: string): Promise<QueryResult<JobListing[]>> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from("job_listings")
      .select("*")
      .eq("company_id", companyId)
      .order("published_at", { ascending: false });
    if (error) return unavailable(error);
    return {
      ok: true,
      data: (data ?? []).filter((job) => !isDeadlinePassed(job.application_deadline)),
    };
  } catch (error) {
    return unavailable(error);
  }
}

export async function getFilterOptions(): Promise<
  QueryResult<{
    locations: { id: string; name: string; region: string | null; country_code: string }[];
    industries: { name: string; slug: string }[];
  }>
> {
  if (!hasPublicEnv()) {
    return unavailable(new ConfigurationError(["NEXT_PUBLIC_SUPABASE_URL"]));
  }
  try {
    const supabase = createPublicSupabaseClient();
    const [locations, industries] = await Promise.all([
      supabase.from("locations").select("id, name, region, country_code").order("name"),
      supabase.from("industries").select("name, slug").order("name"),
    ]);
    if (locations.error || industries.error) {
      return unavailable(locations.error ?? industries.error);
    }
    return {
      ok: true,
      data: {
        locations: locations.data ?? [],
        industries: industries.data ?? [],
      },
    };
  } catch (error) {
    return unavailable(error);
  }
}
