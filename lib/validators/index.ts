/**
 * lib/validators/index.ts
 * Centralised Zod schemas — used in API routes, server actions, and forms.
 * Compatible with Zod v4 (required_error → error, .errors → .issues).
 */

import { z } from "zod";

// ─── Shared primitives ────────────────────────────────────────────────────────

export const emailSchema = z
  .string({ error: "Email is required" })
  .trim()
  .email("Invalid email address")
  .max(255, "Email too long");

export const nameSchema = z
  .string({ error: "Name is required" })
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name too long");

export const cuidSchema = z.string().min(1, "Invalid ID format");

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

// ─── Contact form ─────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string({ error: "Subject is required" })
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject too long"),
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(20, "Message must be at least 20 characters")
    .max(5000, "Message too long"),
});

export type ContactInput = z.infer<typeof contactSchema>;

// ─── Profile update ───────────────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// ─── Admin: update user ───────────────────────────────────────────────────────

export const adminUpdateUserSchema = z.object({
  name: nameSchema.optional(),
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z.boolean().optional(),
});

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;

// ─── Admin: list users query params ───────────────────────────────────────────

export const adminListUsersSchema = paginationSchema.extend({
  role: z.enum(["USER", "ADMIN"]).optional(),
  search: z.string().trim().max(100).optional(),
  isActive: z.coerce.boolean().optional(),
});

export type AdminListUsersQuery = z.infer<typeof adminListUsersSchema>;

// ─── Download ─────────────────────────────────────────────────────────────────

export const downloadQuerySchema = z.object({
  source: z.enum(["web", "mobile", "direct"]).default("web"),
});

export type DownloadQuery = z.infer<typeof downloadQuerySchema>;

// ─── Password ─────────────────────────────────────────────────────────────────

/**
 * Enforces strong password rules:
 *  - 8–128 characters
 *  - At least one uppercase letter
 *  - At least one lowercase letter
 *  - At least one digit
 *  - At least one special character
 */
export const passwordSchema = z
  .string({ error: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be at most 128 characters")
  .refine((v) => /[A-Z]/.test(v), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((v) => /[a-z]/.test(v), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((v) => /[0-9]/.test(v), {
    message: "Password must contain at least one number",
  })
  .refine((v) => /[^A-Za-z0-9]/.test(v), {
    message: "Password must contain at least one special character",
  });

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema.toLowerCase(),
    password: passwordSchema,
    confirmPassword: z.string({ error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailSchema.toLowerCase(),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailSchema.toLowerCase(),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    token: z.string({ error: "Reset token is required" }).min(1, "Reset token is required"),
    password: passwordSchema,
    confirmPassword: z.string({ error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
