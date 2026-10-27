export type ProfileCompletenessInput = {
  full_name: string | null;
  headline: string | null;
  bio: string | null;
  location_id: string | null;
  avatar_path: string | null;
  phone: string | null;
};

export type CompletionField = {
  key: keyof ProfileCompletenessInput;
  label: string;
  required: boolean;
  filled: boolean;
};

const FIELDS: { key: keyof ProfileCompletenessInput; label: string; required: boolean }[] = [
  { key: "full_name", label: "Full name", required: true },
  { key: "headline", label: "Professional headline", required: false },
  { key: "bio", label: "Professional summary", required: false },
  { key: "location_id", label: "Location", required: false },
  { key: "avatar_path", label: "Profile photo", required: false },
  { key: "phone", label: "Phone number", required: false },
];

function filled(value: string | null): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function profileCompleteness(profile: ProfileCompletenessInput): {
  percent: number;
  fields: CompletionField[];
  missing: CompletionField[];
} {
  const fields = FIELDS.map((field) => ({
    ...field,
    filled: filled(profile[field.key]),
  }));
  const complete = fields.filter((field) => field.filled).length;
  const percent = Math.round((complete / fields.length) * 100);
  return {
    percent,
    fields,
    missing: fields.filter((field) => !field.filled),
  };
}
