import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">About VISION</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-charcoal)]/80">
        VISION is a recruitment platform designed for Uganda first, with a data
        model that can expand to other countries. Employers publish vacancies
        through companies. Job seekers maintain profiles and apply. Administrators
        moderate trust and platform operations.
      </p>
    </PageContainer>
  );
}
