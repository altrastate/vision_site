import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Privacy</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-charcoal)]/80">
        VISION stores account data in Supabase Auth and application profiles in
        PostgreSQL. Private fields such as phone numbers are not part of the
        public profile projection. A full privacy policy will be published before
        launch. This page is a placeholder so the footer route exists.
      </p>
    </PageContainer>
  );
}
