import "server-only";
import { auth } from "@clerk/nextjs/server";

/** Clerk user ids allowed in — ADMIN_CLERK_ID is a comma-separated list, same as the main app. */
function adminIds(): string[] {
  return (process.env.ADMIN_CLERK_ID ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}

export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId && adminIds().includes(userId);
}

/** Guard for server actions: they can be called directly, so each one checks again. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("forbidden");
}
