import { ConfigurationError } from "@/lib/env/errors";

export type PublicEnv = {
  appUrl: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
};

function read(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getPublicEnv(): PublicEnv {
  const appUrl = read("NEXT_PUBLIC_APP_URL");
  const supabaseUrl = read("NEXT_PUBLIC_SUPABASE_URL");
  const supabasePublishableKey = read("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  const missing: string[] = [];
  if (!appUrl) missing.push("NEXT_PUBLIC_APP_URL");
  if (!supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabasePublishableKey) missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  if (!appUrl || !supabaseUrl || !supabasePublishableKey) {
    throw new ConfigurationError(missing);
  }

  return {
    appUrl,
    supabaseUrl,
    supabasePublishableKey,
  };
}

export function hasPublicEnv(): boolean {
  try {
    getPublicEnv();
    return true;
  } catch (error) {
    if (error instanceof ConfigurationError) {
      return false;
    }
    throw error;
  }
}
