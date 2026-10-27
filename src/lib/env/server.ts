import "server-only";

import { ConfigurationError } from "@/lib/env/errors";
import { getPublicEnv, type PublicEnv } from "@/lib/env/public";

export type ServerEnv = PublicEnv & {
  supabaseSecretKey: string;
};

function read(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getServerEnv(): ServerEnv {
  const publicEnv = getPublicEnv();
  const supabaseSecretKey = read("SUPABASE_SECRET_KEY");

  if (!supabaseSecretKey) {
    throw new ConfigurationError(["SUPABASE_SECRET_KEY"]);
  }

  if (supabaseSecretKey.startsWith("sb_publishable_")) {
    throw new ConfigurationError([
      "SUPABASE_SECRET_KEY (must be a secret key, not a publishable key)",
    ]);
  }

  return {
    ...publicEnv,
    supabaseSecretKey,
  };
}
