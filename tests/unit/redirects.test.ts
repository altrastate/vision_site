import { describe, expect, it } from "vitest";

import { loginPath, safeInternalPath } from "@/lib/auth/redirects";

describe("safe return URLs", () => {
  it("allows internal paths and blocks open redirects", () => {
    expect(safeInternalPath("/jobs")).toBe("/jobs");
    expect(safeInternalPath("/seeker/profile?tab=edit")).toBe("/seeker/profile?tab=edit");
    expect(safeInternalPath("https://evil.example")).toBe("/");
    expect(safeInternalPath("//evil.example")).toBe("/");
    expect(safeInternalPath("/\\evil")).toBe("/");
  });

  it("builds a login path with an encoded next parameter", () => {
    expect(loginPath("/jobs")).toBe("/auth/login?next=%2Fjobs");
  });
});
