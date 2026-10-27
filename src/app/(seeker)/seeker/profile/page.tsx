import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { requirePageUser } from "@/lib/auth/guards";
import { formatDate, initials } from "@/lib/jobs/format";
import { profileCompleteness } from "@/lib/profiles/completeness";
import { getOwnProfile, listLocations } from "@/lib/profiles/query";
import { publicStorageUrl } from "@/lib/storage/public-url";

export const metadata: Metadata = {
  title: "Your profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const user = await requirePageUser("/seeker/profile");
  const profile = await getOwnProfile(user.id);
  const locations = await listLocations();

  if (!profile) {
    return (
      <PageContainer>
        <EmptyState
          title="Profile is not available yet"
          description="Your account exists, but a profile row could not be loaded. Try again after the database trigger has provisioned it."
        />
      </PageContainer>
    );
  }

  const location = locations.find((item) => item.id === profile.location_id);
  const completion = profileCompleteness(profile);
  const photo = publicStorageUrl("avatars", profile.avatar_path);

  return (
    <PageContainer className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[var(--color-gray)] text-lg font-semibold text-[var(--color-navy)]">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(profile.full_name ?? user.email)
            )}
          </div>
          <div>
            <h1 className="font-display text-3xl text-[var(--color-navy)]">
              {profile.full_name ?? "Add your name"}
            </h1>
            <p className="mt-1 text-sm text-[var(--color-charcoal)]/75">
              {profile.headline ?? "Add a professional headline"}
            </p>
          </div>
        </div>
        <dl className="mt-8 grid gap-4 text-sm">
          <Field label="Full name" required value={profile.full_name} />
          <Field label="Headline" value={profile.headline} />
          <Field label="Summary" value={profile.bio} />
          <Field
            label="Location"
            value={
              location
                ? `${location.name}${location.region ? ` · ${location.region}` : ""}`
                : null
            }
          />
          <Field label="Phone" value={profile.phone} note="Private — not shown on public pages." />
          <Field label="Account created" value={formatDate(profile.created_at)} />
        </dl>
        <Link
          href="/seeker/profile/edit"
          className="mt-6 inline-flex h-11 items-center rounded-md bg-[var(--color-navy)] px-4 text-sm font-medium text-white"
        >
          Edit profile
        </Link>
      </Card>
      <Card>
        <CardTitle>Profile completeness</CardTitle>
        <p className="mt-2 text-3xl font-display text-[var(--color-navy)]">{completion.percent}%</p>
        <p className="mt-2 text-sm text-[var(--color-charcoal)]/75">
          You can still browse jobs with an incomplete profile.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {completion.fields.map((field) => (
            <li key={field.key} className="flex items-center justify-between gap-3">
              <span>
                {field.label}
                {field.required ? <span className="text-red-700"> *</span> : null}
              </span>
              <Badge>{field.filled ? "Added" : "Missing"}</Badge>
            </li>
          ))}
        </ul>
      </Card>
    </PageContainer>
  );
}

function Field({
  label,
  value,
  required,
  note,
}: {
  label: string;
  value: string | null | undefined;
  required?: boolean;
  note?: string;
}) {
  return (
    <div>
      <dt className="font-medium text-[var(--color-navy)]">
        {label}
        {required ? <span className="text-red-700"> *</span> : null}
      </dt>
      <dd className="mt-1 whitespace-pre-wrap text-[var(--color-charcoal)]/80">
        {value?.trim() ? value : <span className="text-[var(--color-charcoal)]/50">Not provided</span>}
      </dd>
      {note ? <p className="mt-1 text-xs text-[var(--color-charcoal)]/60">{note}</p> : null}
    </div>
  );
}
