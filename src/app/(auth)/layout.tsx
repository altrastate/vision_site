import { Suspense, type ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-container";
import { Spinner } from "@/components/ui/spinner";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <PageContainer>
            <Spinner />
          </PageContainer>
        }
      >
        {children}
      </Suspense>
    </AppShell>
  );
}
