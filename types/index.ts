/**
 * types/index.ts
 * Shared TypeScript types used across the backend.
 */

import type { Role } from "@prisma/client";

// ─── Auth / Session ───────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface SafeUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: Role;
  isActive: boolean;
  emailVerified: Date | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  todayLogins: number;
  totalDownloads: number;
  recentUsers: SafeUser[];
}

// ─── Rate Limit ───────────────────────────────────────────────────────────────

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number; // Unix ms
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "LOGIN_FAILED"
  | "REGISTER"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_COMPLETE"
  | "ROLE_CHANGE"
  | "DELETE_USER"
  | "UPDATE_USER"
  | "CONTACT_SUBMIT"
  | "DOWNLOAD"
  | "ADMIN_ACTION";

export interface AuditMeta {
  [key: string]: string | number | boolean | null | undefined;
}
