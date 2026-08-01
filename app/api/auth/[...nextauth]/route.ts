/**
 * app/api/auth/[...nextauth]/route.ts
 * Mounts the NextAuth v5 handlers at /api/auth/*.
 */

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
