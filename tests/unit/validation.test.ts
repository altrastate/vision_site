import { describe, expect, it } from "vitest";

import { profileUpdateSchema, signInSchema } from "@/lib/validation/profile";

describe("server-side validation schemas", () => {
  it("accepts a well-formed sign-in payload", () => {
    const result = signInSchema.safeParse({
      email: "seeker@example.com",
      password: "long-enough",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty profile name", () => {
    const result = profileUpdateSchema.safeParse({ full_name: "   " });
    expect(result.success).toBe(false);
  });
});
