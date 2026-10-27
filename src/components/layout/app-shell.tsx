import { Suspense, type ReactNode } from "react";

import { Logo } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { hasPublicEnv } from "@/lib/env/public";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={<HeaderPlaceholder />}>
        <AuthenticatedHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

function HeaderPlaceholder() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-navy)]/10 bg-white">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center px-4 sm:px-6">
        <Logo />
      </div>
    </header>
  );
}

async function AuthenticatedHeader() {
  const user = hasPublicEnv() ? await getAuthenticatedUser().catch(() => null) : null;
  return <SiteHeader user={user} />;
}
