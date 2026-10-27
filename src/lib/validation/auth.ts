import { z } from "zod";

export const PASSWORD_HINT =
  "Use at least 8 characters. Avoid using your email address as the password.";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.");

export const registerSchema = z
  .object({
    full_name: z.string().trim().min(1, "Enter your full name.").max(120),
    email: z.email("Enter a valid email address.").max(320),
    password: passwordSchema,
    confirm_password: z.string(),
    intended_purpose: z.enum(["seeker", "employer"]),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  })
  .refine((value) => !value.password.toLowerCase().includes(value.email.split("@")[0] ?? ""), {
    message: "Password should not contain your email name.",
    path: ["password"],
  });

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").max(320),
  password: z.string().min(1, "Enter your password.").max(128),
  next: z.string().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address.").max(320),
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirm_password: z.string(),
  })
  .refine((value) => value.password === value.confirm_password, {
    message: "Passwords do not match.",
    path: ["confirm_password"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
