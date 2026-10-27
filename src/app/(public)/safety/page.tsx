import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Safety" };

export default function SafetyPage() {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Safety</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-charcoal)]/80">
        Job reporting, employer verification, and moderation tools are planned
        for Phase Four. Until then, treat any off-platform hiring request with
        caution and never share passwords or payment details to “secure” a role.
      </p>
    </PageContainer>
  );
}
