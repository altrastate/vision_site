"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction } from "@/features/profiles/actions";
import type { ProfileRow } from "@/lib/profiles/query";

type LocationOption = { id: string; name: string; region: string | null; country_code: string };

const initial = { ok: false, message: "" };

export function ProfileForm({
  profile,
  locations,
}: {
  profile: ProfileRow;
  locations: LocationOption[];
}) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="full_name">
          Full name <span className="text-red-700">*</span>
        </Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name ?? ""}
          required
          maxLength={120}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="headline">Professional headline</Label>
        <Input
          id="headline"
          name="headline"
          defaultValue={profile.headline ?? ""}
          maxLength={160}
          placeholder="For example, Logistics coordinator in Kampala"
        />
        <p className="text-xs text-[var(--color-charcoal)]/70">Optional. Shown on your profile.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Professional summary</Label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={5000}
          rows={6}
          className="w-full rounded-md border border-[var(--color-navy)]/15 bg-white px-3 py-2 text-sm text-[var(--color-charcoal)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
        />
        <p className="text-xs text-[var(--color-charcoal)]/70">Optional. Up to 5,000 characters.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location_id">Location</Label>
        <select
          id="location_id"
          name="location_id"
          defaultValue={profile.location_id ?? ""}
          className="h-11 w-full rounded-md border border-[var(--color-navy)]/15 bg-white px-3 text-sm"
        >
          <option value="">Prefer not to say</option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
              {location.region ? ` · ${location.region}` : ""}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} maxLength={20} />
        <p className="text-xs text-[var(--color-charcoal)]/70">
          Optional and private. It is not shown on public pages.
        </p>
      </div>
      {state.message ? (
        <p className={state.ok ? "text-sm text-[var(--color-navy)]" : "text-sm text-red-700"} role="status">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
