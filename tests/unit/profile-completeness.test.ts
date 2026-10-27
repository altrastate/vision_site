import { describe, expect, it } from "vitest";

import { profileCompleteness } from "@/lib/profiles/completeness";
import { profileUpdateSchema } from "@/lib/validation/profile";

describe("profile completeness", () => {
  it("is calculated from actual fields, not a hardcoded percentage", () => {
    const empty = profileCompleteness({
      full_name: null,
      headline: null,
      bio: null,
      location_id: null,
      avatar_path: null,
      phone: null,
    });
    expect(empty.percent).toBe(0);
    expect(empty.missing).toHaveLength(6);

    const partial = profileCompleteness({
      full_name: "Amina Nsubuga",
      headline: "Operations coordinator",
      bio: null,
      location_id: "11111111-1111-1111-1111-111111111111",
      avatar_path: null,
      phone: null,
    });
    expect(partial.percent).toBe(50);
    expect(partial.missing.map((field) => field.key)).toEqual(["bio", "avatar_path", "phone"]);
  });
});

describe("profile update validation", () => {
  it("requires a name and accepts optional private phone", () => {
    expect(profileUpdateSchema.safeParse({ full_name: "Amina Nsubuga" }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({ full_name: "   " }).success).toBe(false);
    expect(
      profileUpdateSchema.safeParse({ full_name: "Amina", phone: "123" }).success,
    ).toBe(false);
  });
});
