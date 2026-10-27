export const APP_ROLES = ["seeker", "employer", "moderator", "admin"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export const PRIVILEGED_ROLES = ["moderator", "admin"] as const;
export type PrivilegedRole = (typeof PRIVILEGED_ROLES)[number];

export const COMPANY_MEMBERSHIP_ROLES = [
  "owner",
  "recruiter",
  "hiring_manager",
  "viewer",
] as const;
export type CompanyMembershipRole = (typeof COMPANY_MEMBERSHIP_ROLES)[number];

export const COMPANY_MANAGEMENT_ROLES: readonly CompanyMembershipRole[] = [
  "owner",
  "recruiter",
];

export const JOB_MANAGEMENT_ROLES: readonly CompanyMembershipRole[] = [
  "owner",
  "recruiter",
  "hiring_manager",
];

export function isAppRole(value: string): value is AppRole {
  return (APP_ROLES as readonly string[]).includes(value);
}

export function isPrivilegedRole(role: AppRole): role is PrivilegedRole {
  return (PRIVILEGED_ROLES as readonly string[]).includes(role);
}

export function canManageCompany(role: CompanyMembershipRole): boolean {
  return COMPANY_MANAGEMENT_ROLES.includes(role);
}

export function canManageJobs(role: CompanyMembershipRole): boolean {
  return JOB_MANAGEMENT_ROLES.includes(role);
}

export function canManageMembership(role: CompanyMembershipRole): boolean {
  return role === "owner";
}
