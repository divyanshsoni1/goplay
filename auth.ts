/**
 * auth.ts  (project root)
 * NextAuth v5 (Auth.js) configuration.
 *
 * Strategy: JWT session — role and user ID live inside the token,
 * so every protected route can read them without a DB round-trip.
 *
 * Supported providers:
 *  1. Google OAuth
 *  2. Credentials (email + password)
 *
 * Callbacks order on sign-in:
 *   signIn  →  jwt  →  session
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { writeAuditLog } from "@/lib/audit";
import { loginSchema } from "@/lib/validators";
import type { Role } from "@prisma/client";

// ─── NextAuth config ──────────────────────────────────────────────────────────

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter keeps Account / Session / VerificationToken rows in sync
  adapter: PrismaAdapter(prisma),

  // JWT strategy: session data never stored in DB,
  // encoded in a signed HTTP-only cookie instead.
  session: { strategy: "jwt" },

  // Pages
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  // Providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ── Validate input shape ─────────────────────────────────────────
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        try {
          // ── Fetch user ─────────────────────────────────────────────────
          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              password: true,
              provider: true,
              role: true,
              isActive: true,
            },
          });

          // No user found — generic null (no enumeration)
          if (!user) {
            logger.warn("Credentials login: user not found", { email });
            return null;
          }

          // Account exists but was created via Google — no password set
          if (!user.password) {
            logger.warn("Credentials login: Google-only account", {
              userId: user.id,
            });
            // Throw a descriptive error that the UI can surface
            throw new Error("GoogleAccountOnly");
          }

          // Account inactive
          if (!user.isActive) {
            logger.warn("Credentials login: inactive account", {
              userId: user.id,
            });
            throw new Error("AccountInactive");
          }

          // ── Verify password (constant-time) ────────────────────────────
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            logger.warn("Credentials login: wrong password", {
              userId: user.id,
            });
            await writeAuditLog({
              action: "LOGIN_FAILED",
              userId: user.id,
              metadata: { reason: "wrong_password" },
            });
            return null;
          }

          // ── Success ────────────────────────────────────────────────────
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
          });

          await writeAuditLog({ action: "LOGIN", userId: user.id });

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } catch (error) {
          // Re-throw named errors so NextAuth forwards them as ?error= param
          if (
            error instanceof Error &&
            (error.message === "GoogleAccountOnly" ||
              error.message === "AccountInactive")
          ) {
            throw error;
          }
          logger.error("Credentials authorize error", { error: String(error) });
          return null;
        }
      },
    }),
  ],

  // ─── Callbacks ──────────────────────────────────────────────────────────────

  callbacks: {
    /**
     * signIn – runs before a session is created.
     * Block inactive accounts; upsert user record on first & subsequent logins.
     * Credentials sign-ins skip the adapter upsert (no Account row) so we
     * handle the audit/lastLogin in the authorize() function above.
     */
    async signIn({ user, account }) {
      // Credentials provider: authorize() already validated everything
      if (account?.provider === "credentials") return true;

      if (!user.email) {
        logger.warn("Sign-in rejected: no email from provider", {
          provider: account?.provider,
        });
        return false;
      }

      try {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, isActive: true, role: true },
        });

        if (existing) {
          // Block deactivated accounts
          if (!existing.isActive) {
            logger.warn("Sign-in rejected: account inactive", {
              email: user.email,
            });
            return "/auth/error?error=AccountInactive";
          }

          // Update mutable fields on every login
          await prisma.user.update({
            where: { id: existing.id },
            data: {
              lastLogin: new Date(),
              provider: account?.provider ?? "google",
              ...(user.name ? { name: user.name } : {}),
              ...(user.image ? { image: user.image } : {}),
            },
          });

          await writeAuditLog({ action: "LOGIN", userId: existing.id });
        } else {
          // First-time Google sign-in — adapter creates the User row
          logger.info("New user signing in via Google", { email: user.email });
        }

        return true;
      } catch (error) {
        logger.error("signIn callback error", { error: String(error) });
        return false;
      }
    },

    /**
     * jwt – called after sign-in and on every token refresh.
     * Enriches the token with id, role, and isActive from DB.
     */
    async jwt({ token, user, trigger, session }) {
      // `user` is only populated on initial sign-in
      if (user) {
        // Fetch the DB record to get role (adapter may have just created it)
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { id: true, role: true, isActive: true },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isActive = dbUser.isActive;

          // Handle brand-new users: set lastLogin and log
          if (!token.id) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { lastLogin: new Date() },
            });
            await writeAuditLog({ action: "LOGIN", userId: dbUser.id });
          }
        }
      }

      // Handle session update trigger (e.g. after role change)
      if (trigger === "update" && session?.role) {
        token.role = session.role as Role;
      }

      return token;
    },

    /**
     * session – shapes the client-facing session object.
     * Only expose safe fields — never leak internal DB details.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.isActive = token.isActive as boolean;
      }
      return session;
    },
  },

  // ─── Events ─────────────────────────────────────────────────────────────────

  events: {
    async signOut(message) {
      // `message` is a union: { session } for DB sessions or { token } for JWT
      const token = "token" in message ? message.token : null;
      if (token?.id) {
        await writeAuditLog({
          action: "LOGOUT",
          userId: token.id as string,
        });
      }
    },
  },

  // Trust X-Forwarded-* headers when behind a reverse proxy
  trustHost: true,

  debug: process.env.NODE_ENV === "development",
});
