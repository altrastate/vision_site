import type { Database } from "@/types/database";

export type JobListing = Database["public"]["Views"]["job_listings"]["Row"];
export type CompanyListing = Database["public"]["Views"]["company_listings"]["Row"];
