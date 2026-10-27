import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Terms</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-charcoal)]/80">
        Platform terms of use will be issued before production launch. Phase One
        is an engineering foundation and is not an offer of paid recruitment
        services.
      </p>
    </PageContainer>
  );
}
