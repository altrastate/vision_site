import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getPublicEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export function createPublicSupabaseClient() {
  const env = getPublicEnv();
  return createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(4000) }),
    },
  });
}
