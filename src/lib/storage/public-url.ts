import { hasPublicEnv, getPublicEnv } from "@/lib/env/public";

export function publicStorageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path || !hasPublicEnv()) {
    return null;
  }
  const env = getPublicEnv();
  const cleaned = path.replace(/^\/+/, "");
  return `${env.supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${cleaned}`;
}
