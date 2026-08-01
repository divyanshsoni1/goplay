/**
 * types/next-auth.d.ts
 * Augments the built-in NextAuth types to include custom fields (id, role, isActive).
 */

import type { DefaultSession } from "next-auth";
import type { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      isActive: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
    isActive?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    isActive?: boolean;
  }
}
