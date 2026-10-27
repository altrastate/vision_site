import "server-only";

import { ConfigurationError } from "@/lib/env/errors";
import { hasPublicEnv } from "@/lib/env/public";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export async function getOwnProfile(userId: string): Promise<ProfileRow | null> {
  if (!hasPublicEnv()) {
    return null;
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (data) {
    return data;
  }

  try {
    const admin = createAdminSupabaseClient();
    const { data: recovered, error } = await admin
      .from("profiles")
      .upsert(
        {
          id: userId,
          account_status: "active",
          intended_purpose: "seeker",
        },
        { onConflict: "id" },
      )
      .select("*")
      .single();
    if (error) {
      return null;
    }
    return recovered;
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return null;
    }
    return null;
  }
}

export async function listLocations() {
  if (!hasPublicEnv()) {
    return [];
  }
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("locations")
    .select("id, name, region, country_code")
    .order("name");
  return data ?? [];
}
