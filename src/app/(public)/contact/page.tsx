import { PageContainer } from "@/components/layout/page-container";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <PageContainer className="max-w-3xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Contact</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-charcoal)]/80">
        A contact inbox is not connected in Phase One. Use your VISION product
        owner channel for operational questions. Do not send CVs or credentials
        through unsecured email until the platform messaging flow exists.
      </p>
    </PageContainer>
  );
}
