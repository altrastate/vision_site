"use server";

import { revalidatePath } from "next/cache";

import { requireAuthenticatedUser } from "@/lib/auth/session";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validation/profile";

export async function updateProfileAction(
  _prev: { ok: boolean; message: string } | null,
  formData: FormData,
): Promise<{ ok: boolean; message: string }> {
  const user = await requireAuthenticatedUser();
  const parsed = profileUpdateSchema.safeParse({
    full_name: formData.get("full_name"),
    headline: emptyToNull(formData.get("headline")),
    bio: emptyToNull(formData.get("bio")),
    phone: emptyToNull(formData.get("phone")),
    location_id: emptyToNull(formData.get("location_id")),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the profile fields." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id);
  if (error) {
    return { ok: false, message: "The profile could not be saved." };
  }
  revalidatePath("/seeker/profile");
  revalidatePath("/seeker/profile/edit");
  return { ok: true, message: "Profile saved." };
}

export async function saveAvatarPathAction(path: string): Promise<{ ok: boolean; message: string }> {
  const user = await requireAuthenticatedUser();
  if (!path.startsWith(`${user.id}/`)) {
    return { ok: false, message: "That image path is not allowed." };
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("profiles").update({ avatar_path: path }).eq("id", user.id);
  if (error) {
    return { ok: false, message: "The photo could not be attached to your profile." };
  }
  revalidatePath("/seeker/profile");
  revalidatePath("/seeker/profile/edit");
  return { ok: true, message: "Profile photo updated." };
}

function emptyToNull(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}
