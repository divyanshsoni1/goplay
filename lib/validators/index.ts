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
