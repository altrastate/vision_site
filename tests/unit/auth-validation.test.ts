import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/validation/auth";

describe("registration validation", () => {
  const valid = {
    full_name: "Amina Nsubuga",
    email: "amina@example.com",
    password: "secure-pass-word",
    confirm_password: "secure-pass-word",
    intended_purpose: "seeker" as const,
  };

  it("accepts a complete seeker registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({ ...valid, confirm_password: "other-password" });
    expect(result.success).toBe(false);
  });

  it("rejects a password that contains the email name", () => {
    const result = registerSchema.safeParse({
      ...valid,
      password: "amina1234",
      confirm_password: "amina1234",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an employer/admin self-promotion value", () => {
    const result = registerSchema.safeParse({ ...valid, intended_purpose: "admin" });
    expect(result.success).toBe(false);
  });
});

describe("login and recovery validation", () => {
  it("requires an email and password", () => {
    expect(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
    expect(loginSchema.safeParse({ email: "user@example.com", password: "secret" }).success).toBe(
      true,
    );
  });

  it("validates password reset payloads", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: "new-password",
        confirm_password: "new-password",
      }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: "new-password",
        confirm_password: "different",
      }).success,
    ).toBe(false);
  });
});
