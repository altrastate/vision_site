export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type AccountStatus = "pending" | "active" | "suspended";
export type AppRole = "seeker" | "employer" | "moderator" | "admin";
export type CompanyVerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type CompanyMembershipRole = "owner" | "recruiter" | "hiring_manager" | "viewer";
export type CompanyMembershipStatus = "invited" | "active" | "suspended";
export type JobType = "full_time" | "part_time" | "contract" | "temporary" | "internship";
export type WorkArrangement = "on_site" | "hybrid" | "remote";
export type ExperienceLevel = "intern" | "entry" | "mid" | "senior" | "lead" | "executive";
export type SalaryPeriod = "hour" | "day" | "week" | "month" | "year";
export type JobStatus = "draft" | "published" | "closed" | "suspended" | "archived";
export type IntendedPurpose = "seeker" | "employer";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          headline: string | null;
          bio: string | null;
          avatar_path: string | null;
          location_id: string | null;
          account_status: AccountStatus;
          intended_purpose: IntendedPurpose;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          headline?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          location_id?: string | null;
          account_status?: AccountStatus;
          intended_purpose?: IntendedPurpose;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          headline?: string | null;
          bio?: string | null;
          avatar_path?: string | null;
          location_id?: string | null;
          intended_purpose?: IntendedPurpose;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          user_id: string;
          role: AppRole;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          user_id: string;
          role: AppRole;
          assigned_by?: string | null;
          assigned_at?: string;
        };
        Update: {
          assigned_by?: string | null;
        };
        Relationships: [];
      };
      locations: {
        Row: {
          id: string;
          country_code: string;
          name: string;
          region: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          country_code: string;
          name: string;
          region?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          country_code?: string;
          name?: string;
          region?: string | null;
          parent_id?: string | null;
        };
        Relationships: [];
      };
      industries: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
        };
        Relationships: [];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          industry_id: string | null;
          website_url: string | null;
          logo_path: string | null;
          country_code: string;
          location_id: string | null;
          verification_status: CompanyVerificationStatus;
          verified_at: string | null;
          verified_by: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          industry_id?: string | null;
          website_url?: string | null;
          logo_path?: string | null;
          country_code?: string;
          location_id?: string | null;
          verification_status?: CompanyVerificationStatus;
          verified_at?: string | null;
          verified_by?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          industry_id?: string | null;
          website_url?: string | null;
          logo_path?: string | null;
          country_code?: string;
          location_id?: string | null;
        };
        Relationships: [];
      };
      company_members: {
        Row: {
          company_id: string;
          user_id: string;
          membership_role: CompanyMembershipRole;
          status: CompanyMembershipStatus;
          invited_by: string | null;
          created_at: string;
        };
        Insert: {
          company_id: string;
          user_id: string;
          membership_role: CompanyMembershipRole;
          status?: CompanyMembershipStatus;
          invited_by?: string | null;
          created_at?: string;
        };
        Update: {
          membership_role?: CompanyMembershipRole;
          status?: CompanyMembershipStatus;
        };
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          created_by: string | null;
          title: string;
          slug: string;
          description: string;
          responsibilities: string | null;
          qualifications: string | null;
          job_type: JobType;
          work_arrangement: WorkArrangement;
          experience_level: ExperienceLevel;
          location_id: string | null;
          is_remote: boolean;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          salary_period: SalaryPeriod;
          salary_is_disclosed: boolean;
          status: JobStatus;
          published_at: string | null;
          application_deadline: string | null;
          created_at: string;
          updated_at: string;
          closed_at: string | null;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by?: string | null;
          title: string;
          slug: string;
          description: string;
          responsibilities?: string | null;
          qualifications?: string | null;
          job_type: JobType;
          work_arrangement: WorkArrangement;
          experience_level: ExperienceLevel;
          location_id?: string | null;
          is_remote?: boolean;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          salary_period?: SalaryPeriod;
          salary_is_disclosed?: boolean;
          status?: JobStatus;
          published_at?: string | null;
          application_deadline?: string | null;
          created_at?: string;
          updated_at?: string;
          closed_at?: string | null;
        };
        Update: {
          title?: string;
          slug?: string;
          description?: string;
          responsibilities?: string | null;
          qualifications?: string | null;
          job_type?: JobType;
          work_arrangement?: WorkArrangement;
          experience_level?: ExperienceLevel;
          location_id?: string | null;
          is_remote?: boolean;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string;
          salary_period?: SalaryPeriod;
          salary_is_disclosed?: boolean;
          status?: JobStatus;
          published_at?: string | null;
          application_deadline?: string | null;
          closed_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          full_name: string | null;
          headline: string | null;
          avatar_path: string | null;
          location_id: string | null;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      company_directory: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          industry_id: string | null;
          website_url: string | null;
          logo_path: string | null;
          country_code: string;
          location_id: string | null;
          verification_status: CompanyVerificationStatus;
          created_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      job_listings: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          job_slug: string;
          company_slug: string;
          company_name: string;
          company_logo_path: string | null;
          verification_status: CompanyVerificationStatus;
          industry_id: string | null;
          industry_name: string | null;
          industry_slug: string | null;
          description: string;
          responsibilities: string | null;
          qualifications: string | null;
          job_type: JobType;
          work_arrangement: WorkArrangement;
          experience_level: ExperienceLevel;
          location_id: string | null;
          location_name: string | null;
          location_region: string | null;
          location_country: string | null;
          is_remote: boolean;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          salary_period: SalaryPeriod;
          salary_is_disclosed: boolean;
          published_at: string | null;
          application_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      company_listings: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          industry_id: string | null;
          industry_name: string | null;
          website_url: string | null;
          logo_path: string | null;
          country_code: string;
          location_id: string | null;
          location_name: string | null;
          location_region: string | null;
          verification_status: CompanyVerificationStatus;
          created_at: string;
          active_job_count: number;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
      published_jobs: {
        Row: {
          id: string;
          company_id: string;
          title: string;
          slug: string;
          description: string;
          responsibilities: string | null;
          qualifications: string | null;
          job_type: JobType;
          work_arrangement: WorkArrangement;
          experience_level: ExperienceLevel;
          location_id: string | null;
          is_remote: boolean;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string;
          salary_period: SalaryPeriod;
          salary_is_disclosed: boolean;
          published_at: string | null;
          application_deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: never;
        Update: never;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      account_status: AccountStatus;
      app_role: AppRole;
      company_verification_status: CompanyVerificationStatus;
      company_membership_role: CompanyMembershipRole;
      company_membership_status: CompanyMembershipStatus;
      job_type: JobType;
      work_arrangement: WorkArrangement;
      experience_level: ExperienceLevel;
      salary_period: SalaryPeriod;
      job_status: JobStatus;
      intended_purpose: IntendedPurpose;
    };
    CompositeTypes: Record<string, never>;
  };
};
