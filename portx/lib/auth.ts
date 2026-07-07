import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

/** Resolve the signed-in user's profile row, or null if not onboarded yet. */
export async function getOwnProfile() {
  const { userId } = await auth();
  if (!userId) return null;
  return db.profile.findUnique({ where: { clerkId: userId } });
}

/** Same, but throws a Response-friendly error object for API routes. */
export async function requireProfile() {
  const { userId } = await auth();
  if (!userId) throw new AuthError(401, "unauthorized");
  const profile = await db.profile.findUnique({ where: { clerkId: userId } });
  if (!profile) throw new AuthError(404, "no_profile");
  return profile;
}

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function handleAuthError(e: unknown) {
  if (e instanceof AuthError)
    return Response.json({ error: e.message }, { status: e.status });
  console.error(e);
  return Response.json({ error: "server_error" }, { status: 500 });
}
