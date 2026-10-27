import { describe, expect, it } from "vitest";

import {
  canManageCompany,
  canManageJobs,
  canManageMembership,
  isAppRole,
  isPrivilegedRole,
} from "@/lib/permissions/roles";

describe("authorization helpers", () => {
  it("recognises application roles", () => {
    expect(isAppRole("admin")).toBe(true);
    expect(isAppRole("owner")).toBe(false);
  });

  it("treats admin and moderator as privileged", () => {
    expect(isPrivilegedRole("admin")).toBe(true);
    expect(isPrivilegedRole("moderator")).toBe(true);
    expect(isPrivilegedRole("seeker")).toBe(false);
  });

  it("scopes company permissions by membership role", () => {
    expect(canManageCompany("owner")).toBe(true);
    expect(canManageCompany("viewer")).toBe(false);
    expect(canManageJobs("hiring_manager")).toBe(true);
    expect(canManageJobs("viewer")).toBe(false);
    expect(canManageMembership("owner")).toBe(true);
    expect(canManageMembership("recruiter")).toBe(false);
  });
});
