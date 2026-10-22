"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { PASSES, newExpiry, type PassId } from "@/lib/plans";

/* Admin actions. Each re-checks the admin, since server actions can be called directly.
   Payment review mirrors ../portx/app/api/admin/payments/[id]/route.ts.
   Errors come back as { error } — Next hides thrown messages in production. */

export type ActionResult = { error?: string };

const Id = z.uuid();
const GRANT_DAYS = [7, 30, 180, 365];

class Refusal extends Error {}

async function run(profileOf: () => Promise<string | undefined>): Promise<ActionResult> {
  try {
    await requireAdmin();
    const profileId = await profileOf();
    revalidatePath("/", "layout");
    if (profileId) revalidatePath(`/users/${profileId}`);
    return {};
  } catch (e) {
    if (e instanceof Refusal) return { error: e.message };
    if (e instanceof Error && e.message === "forbidden") return { error: "Not allowed" };
    console.error("board action failed", e);
    return { error: "Something went wrong — check the server logs" };
  }
}

async function pendingPayment(id: string) {
  const request = await db.paymentRequest.findUnique({ where: { id: Id.parse(id) }, include: { profile: true } });
  if (!request) throw new Refusal("Payment not found");
  if (request.status !== "pending") throw new Refusal("This payment was already reviewed");
  return request;
}

/** Approve a pending payment: mark it approved and add the pass to the user's Pro time. */
export async function approvePayment(id: string): Promise<ActionResult> {
  return run(async () => {
    const request = await pendingPayment(id);
    const pass = PASSES[request.plan as PassId];
    if (!pass) throw new Refusal(`Unknown plan "${request.plan}"`);
    await db.$transaction([
      db.paymentRequest.update({ where: { id }, data: { status: "approved", reviewedAt: new Date() } }),
      db.profile.update({
        where: { id: request.profileId },
        data: { plan: "pro", planExpiresAt: newExpiry(request.profile.planExpiresAt, pass.days) },
      }),
    ]);
    return request.profileId;
  });
}

export async function rejectPayment(id: string): Promise<ActionResult> {
  return run(async () => {
    const request = await pendingPayment(id);
    await db.paymentRequest.update({ where: { id }, data: { status: "rejected", reviewedAt: new Date() } });
    return request.profileId;
  });
}

/** Give or extend Pro without a payment (support, giveaways). Stacks on any time left. */
export async function grantPro(profileId: string, days: number): Promise<ActionResult> {
  return run(async () => {
    if (!GRANT_DAYS.includes(days)) throw new Refusal("Unsupported length");
    const profile = await db.profile.findUnique({ where: { id: Id.parse(profileId) }, select: { plan: true, planExpiresAt: true } });
    if (!profile) throw new Refusal("User not found");
    const current = profile.plan === "pro" ? profile.planExpiresAt : null;
    await db.profile.update({ where: { id: profileId }, data: { plan: "pro", planExpiresAt: newExpiry(current, days) } });
    return profileId;
  });
}

/** End Pro now; the account drops back to the free plan. */
export async function endPro(profileId: string): Promise<ActionResult> {
  return run(async () => {
    await db.profile.update({ where: { id: Id.parse(profileId) }, data: { plan: "free", planExpiresAt: new Date() } });
    return profileId;
  });
}

export async function setPublished(profileId: string, published: boolean): Promise<ActionResult> {
  return run(async () => {
    await db.profile.update({ where: { id: Id.parse(profileId) }, data: { isPublished: published } });
    return profileId;
  });
}
