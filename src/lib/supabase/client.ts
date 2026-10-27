import { createBrowserClient } from "@supabase/ssr";

import { getPublicEnv } from "@/lib/env/public";
import type { Database } from "@/types/database";

export function createBrowserSupabaseClient() {
  const env = getPublicEnv();
  return createBrowserClient<Database>(env.supabaseUrl, env.supabasePublishableKey);
}
