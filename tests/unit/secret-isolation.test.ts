import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relativePath: string): string {
  return readFileSync(join(root, relativePath), "utf8");
}

describe("privileged credential isolation", () => {
  it("keeps the secret key behind server-only modules", () => {
    const admin = read("src/lib/supabase/admin.ts");
    const serverEnv = read("src/lib/env/server.ts");
    const browser = read("src/lib/supabase/client.ts");
    const publicClient = read("src/lib/supabase/public.ts");
    const proxy = read("src/lib/supabase/proxy.ts");

    expect(admin).toContain('import "server-only"');
    expect(serverEnv).toContain('import "server-only"');
    expect(admin).toContain("getServerEnv");
    expect(serverEnv).toContain("SUPABASE_SECRET_KEY");
    expect(browser).not.toContain("SUPABASE_SECRET_KEY");
    expect(browser).not.toContain("getServerEnv");
    expect(publicClient).not.toContain("SUPABASE_SECRET_KEY");
    expect(publicClient).not.toContain("getServerEnv");
    expect(proxy).not.toContain("SUPABASE_SECRET_KEY");
  });

  it("does not prefix the secret key for the browser", () => {
    const example = read(".env.example");
    expect(example).toMatch(/^SUPABASE_SECRET_KEY=/m);
    expect(example).not.toMatch(/NEXT_PUBLIC_SUPABASE_SECRET/);
  });
});
