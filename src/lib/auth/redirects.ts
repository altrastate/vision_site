const FALLBACK = "/";

export function safeInternalPath(value: string | null | undefined, fallback = FALLBACK): string {
  if (!value) {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return fallback;
  }
  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return fallback;
  }
  return trimmed;
}

export function loginPath(next?: string | null): string {
  const destination = safeInternalPath(next, "/seeker/profile");
  return `/auth/login?next=${encodeURIComponent(destination)}`;
}
