import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().trim().min(1, "Enter your full name.").max(120),
  phone: z.string().trim().min(7).max(20).nullable().optional(),
  headline: z.string().trim().min(1).max(160).nullable().optional(),
  bio: z.string().trim().max(5000).nullable().optional(),
  avatar_path: z.string().trim().max(500).nullable().optional(),
  location_id: z.uuid().nullable().optional(),
});

export const signInSchema = z.object({
  email: z.email().max(320),
  password: z.string().min(8).max(128),
});

export const signUpSchema = signInSchema.extend({
  full_name: z.string().trim().min(1).max(120),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
