"use client";

import { useRouter } from "next/navigation";
import { useState, type ChangeEvent } from "react";

import { saveAvatarPathAction } from "@/features/profiles/actions";
import { ConfigurationError } from "@/lib/env/errors";
import {
  AVATAR_HINT,
  avatarObjectPath,
  hasExpectedImageSignature,
  inspectImageFile,
} from "@/lib/storage/image";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export function AvatarUpload({ userId, currentUrl }: { userId: string; currentUrl: string | null }) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setMessage(null);
    const inspection = inspectImageFile(file);
    if (inspection) {
      setError(inspection);
      return;
    }
    if (!(await hasExpectedImageSignature(file))) {
      setError("That file does not look like a supported image.");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setPending(true);
    try {
      const supabase = createBrowserSupabaseClient();
      const path = avatarObjectPath(userId, file);
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
        upsert: true,
        contentType: file.type,
      });
      if (uploadError) {
        setError(uploadError.message);
        return;
      }
      const result = await saveAvatarPathAction(path);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setMessage(result.message);
      router.refresh();
    } catch (caught) {
      setError(
        caught instanceof ConfigurationError
          ? caught.message
          : "Photo upload is unavailable until storage is configured.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--color-gray)]">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Selected profile photo" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-[var(--color-navy)]">Photo</span>
        )}
      </div>
      <div>
        <label className="inline-flex h-9 cursor-pointer items-center rounded-md border border-[var(--color-navy)]/15 bg-white px-3 text-sm font-medium text-[var(--color-navy)]">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={onChange}
            disabled={pending}
          />
          {pending ? "Uploading…" : "Choose photo"}
        </label>
        <p className="mt-2 text-xs text-[var(--color-charcoal)]/70">{AVATAR_HINT}</p>
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? <p className="text-sm text-[var(--color-navy)]">{message}</p> : null}
    </div>
  );
}
