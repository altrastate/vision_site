import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { signOutAction } from "@/features/auth/actions";
import { requirePageUser } from "@/lib/auth/guards";
import { getOwnProfile } from "@/lib/profiles/query";

export const metadata: Metadata = {
  title: "Account settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await requirePageUser("/seeker/settings");
  const profile = await getOwnProfile(user.id);

  return (
    <PageContainer className="max-w-2xl space-y-6">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Account settings</h1>
      <Card>
        <CardTitle>Account</CardTitle>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="font-medium text-[var(--color-navy)]">Email</dt>
            <dd>{user.email ?? "Not available"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-navy)]">Status</dt>
            <dd>{profile?.account_status ?? "Unknown"}</dd>
          </div>
          <div>
            <dt className="font-medium text-[var(--color-navy)]">Onboarding preference</dt>
            <dd>{profile?.intended_purpose ?? "seeker"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-[var(--color-charcoal)]/70">
          Email changes and account deletion are not offered in this phase. They require
          reauthentication and confirmation flows.
        </p>
      </Card>
      <Card>
        <CardTitle>Password</CardTitle>
        <CardDescription>Use password recovery if you need to change your password from a new device.</CardDescription>
        <Link href="/auth/forgot-password" className="mt-4 inline-flex text-sm font-medium text-[var(--color-navy)] underline">
          Request a password reset
        </Link>
      </Card>
      <Card>
        <CardTitle>Help and privacy</CardTitle>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>
          </li>
          <li>
            <Link href="/contact" className="underline">
              Contact
            </Link>
          </li>
        </ul>
      </Card>
      <form action={signOutAction}>
        <button
          type="submit"
          className="inline-flex h-11 items-center rounded-md border border-[var(--color-navy)]/15 bg-white px-4 text-sm font-medium text-[var(--color-navy)]"
        >
          Sign out
        </button>
      </form>
    </PageContainer>
  );
}
