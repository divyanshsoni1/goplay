/**
 * lib/prisma.ts
 * Prisma 7 singleton client with NeonDB serverless adapter.
 *
 * Prisma 7 requires the URL to be passed via a driver adapter at runtime —
 * it is no longer read from schema.prisma.
 *
 * DATABASE_URL  → pooled NeonDB connection string (runtime)
 * DIRECT_URL    → direct connection string (used by Prisma CLI via prisma.config.ts)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// ─── Singleton pattern for Next.js hot-reload ─────────────────────────────────

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "[prisma] DATABASE_URL environment variable is not set. " +
        "Please add it to your .env file."
    );
  }

  const adapter = new PrismaNeon({ connectionString });

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
