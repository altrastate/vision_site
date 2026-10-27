import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { AvatarUpload } from "@/features/profiles/avatar-upload";
import { ProfileForm } from "@/features/profiles/profile-form";
import { requirePageUser } from "@/lib/auth/guards";
import { getOwnProfile, listLocations } from "@/lib/profiles/query";
import { publicStorageUrl } from "@/lib/storage/public-url";

export const metadata: Metadata = {
  title: "Edit profile",
  robots: { index: false, follow: false },
};

export default async function EditProfilePage() {
  const user = await requirePageUser("/seeker/profile/edit");
  const profile = await getOwnProfile(user.id);
  const locations = await listLocations();

  if (!profile) {
    return (
      <PageContainer>
        <EmptyState
          title="Profile is not available yet"
          description="The profile form cannot load until your account row exists."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-2xl">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Edit profile</h1>
      <p className="mt-2 text-sm text-[var(--color-charcoal)]/75">
        Required fields are marked. Optional details help employers understand your background
        later; they are not required to browse jobs.
      </p>
      <Card className="mt-8">
        <CardTitle>Profile photo</CardTitle>
        <CardDescription>Photos are stored in the avatars bucket under your user id.</CardDescription>
        <div className="mt-4">
          <AvatarUpload userId={user.id} currentUrl={publicStorageUrl("avatars", profile.avatar_path)} />
        </div>
      </Card>
      <Card className="mt-6">
        <ProfileForm profile={profile} locations={locations} />
      </Card>
    </PageContainer>
  );
}
