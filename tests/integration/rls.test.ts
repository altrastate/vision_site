import { createClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const configured = Boolean(url && publishableKey && secretKey);

describe.skipIf(!configured)("RLS integration against a live VISION database", () => {
  it("does not let the anonymous key read the profiles table", async () => {
    const anon = createClient(url!, publishableKey!);
    const { data, error } = await anon.from("profiles").select("id, phone");
    expect(data === null || data.length === 0).toBe(true);
    expect(error === null || error.code === "42501" || error.code === "PGRST301").toBe(
      true,
    );
  });

  it("does not let the anonymous key read draft jobs", async () => {
    const anon = createClient(url!, publishableKey!);
    const { data, error } = await anon.from("jobs").select("id, status");
    expect(data === null || data.length === 0).toBe(true);
    expect(error === null || error.code === "42501" || error.code === "PGRST301").toBe(
      true,
    );
  });

  it("lets anonymous visitors read public job listings only", async () => {
    const anon = createClient(url!, publishableKey!);
    const { error } = await anon.from("job_listings").select("id, title").limit(5);
    expect(error).toBeNull();
  });

  it("does not let the anonymous key read private profile fields", async () => {
    const anon = createClient(url!, publishableKey!);
    const { data, error } = await anon.from("profiles").select("phone, bio");
    expect(data === null || data.length === 0).toBe(true);
    expect(error === null || error.code === "42501" || error.code === "PGRST301").toBe(true);
  });
});

describe.skipIf(configured)("RLS integration skipped", () => {
  it("records that database credentials were not available", () => {
    expect(configured).toBe(false);
  });
});
