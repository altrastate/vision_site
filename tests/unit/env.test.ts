import { afterEach, describe, expect, it } from "vitest";

import { ConfigurationError } from "@/lib/env/errors";
import { getPublicEnv } from "@/lib/env/public";

const KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SECRET_KEY",
] as const;

const original = new Map<string, string | undefined>();

function snapshotEnv(): void {
  for (const key of KEYS) {
    original.set(key, process.env[key]);
  }
}

function restoreEnv(): void {
  for (const key of KEYS) {
    const value = original.get(key);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

describe("public environment validation", () => {
  snapshotEnv();
  afterEach(() => {
    restoreEnv();
  });

  it("throws a controlled error when required public variables are missing", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    expect(() => getPublicEnv()).toThrow(ConfigurationError);
    try {
      getPublicEnv();
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigurationError);
      expect((error as ConfigurationError).message).toContain(".env.example");
      expect((error as ConfigurationError).missing).toEqual(
        expect.arrayContaining(["NEXT_PUBLIC_SUPABASE_URL"]),
      );
    }
  });

  it("returns parsed values when configuration is present", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";

    expect(getPublicEnv()).toEqual({
      appUrl: "http://localhost:3000",
      supabaseUrl: "http://127.0.0.1:54321",
      supabasePublishableKey: "sb_publishable_test",
    });
  });
});
