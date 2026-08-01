/**
 * prisma.config.ts  (project root)
 * Prisma 7 datasource configuration.
 *
 * DATABASE_URL  — used at runtime by PrismaClient and for migrations.
 *                 For NeonDB: use the pooled connection string
 *                 (e.g. postgres://...@...-pooler.neon.tech/...)
 *
 * DIRECT_URL    — direct non-pooled URL for migrations on NeonDB.
 *                 Set this if your DATABASE_URL points to the pooler.
 *                 Falls back to DATABASE_URL when not set.
 *
 * See: https://neon.tech/docs/guides/prisma
 */

import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations when connecting through a pooler;
    // fall back to DATABASE_URL when DIRECT_URL is not set
    url: process.env.DIRECT_URL
      ? env("DIRECT_URL")
      : env("DATABASE_URL"),
  },
});
