const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_HINT = "JPEG, PNG, or WebP. Maximum 2 MB.";

export function inspectImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use a JPEG, PNG, or WebP image.";
  }
  if (file.size > MAX_BYTES) {
    return "Images must be 2 MB or smaller.";
  }
  return null;
}

export async function hasExpectedImageSignature(file: File): Promise<boolean> {
  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  const riff = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF";
  const webp = String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return jpeg || png || (riff && webp);
}

export function avatarObjectPath(userId: string, file: File): string {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  return `${userId}/avatar.${extension}`;
}
