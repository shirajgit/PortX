import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { PASSES, newExpiry, type PassId } from "@/lib/billing";

const Input = z.object({ action: z.enum(["approve", "reject"]) });
type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx) {
  const { userId } = await auth();
  if (!userId || userId !== process.env.ADMIN_CLERK_ID)
    return Response.json({ error: "forbidden" }, { status: 403 });

  const { id } = await ctx.params;
  const body = Input.safeParse(await req.json());
  if (!body.success)
    return Response.json({ error: "bad_input" }, { status: 400 });

  const request = await db.paymentRequest.findUnique({
    where: { id },
    include: { profile: true },
  });
  if (!request) return Response.json({ error: "not_found" }, { status: 404 });
  if (request.status !== "pending")
    return Response.json({ error: "already_reviewed" }, { status: 409 });

  if (body.data.action === "reject") {
    await db.paymentRequest.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date() },
    });
    return Response.json({ ok: true });
  }

  // approve: flip plan + extend expiry atomically
  const pass = PASSES[request.plan as PassId];
  if (!pass) return Response.json({ error: "unknown_plan" }, { status: 400 });

  await db.$transaction([
    db.paymentRequest.update({
      where: { id },
      data: { status: "approved", reviewedAt: new Date() },
    }),
    db.profile.update({
      where: { id: request.profileId },
      data: {
        plan: "pro",
        planExpiresAt: newExpiry(request.profile.planExpiresAt, pass.days),
      },
    }),
  ]);
  return Response.json({ ok: true });
}
