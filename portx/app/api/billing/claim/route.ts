import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { PASSES, LAUNCH_OFFER_LIMIT, type PassId } from "@/lib/billing";

const Input = z.object({
  plan: z.enum(["launch", "month", "halfyear", "year"]),
  payer: z
    .string()
    .trim()
    .regex(/^([6-9]\d{9}|[\w.\-]{2,}@[a-zA-Z]{2,})$/, "enter a 10-digit mobile number or UPI ID"),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const requests = await db.paymentRequest.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return Response.json({
      plan: profile.plan,
      planExpiresAt: profile.planExpiresAt,
      requests,
    });
  } catch (e) {
    return handleAuthError(e);
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    const pending = await db.paymentRequest.findFirst({
      where: { profileId: profile.id, status: "pending" },
    });
    if (pending)
      return Response.json({ error: "already_pending" }, { status: 409 });

    // same payer can pay again later (extensions) — only block a duplicate PENDING claim
    const dupPending = await db.paymentRequest.findFirst({
      where: { utr: body.data.payer, status: "pending" },
    });
    if (dupPending)
      return Response.json({ error: "payer_pending" }, { status: 409 });

    if (body.data.plan === "launch") {
      const claimed = await db.paymentRequest.count({
        where: { plan: "launch", status: { in: ["pending", "approved"] } },
      });
      if (claimed >= LAUNCH_OFFER_LIMIT)
        return Response.json({ error: "launch_offer_over" }, { status: 410 });
      const already = await db.paymentRequest.findFirst({
        where: { profileId: profile.id, plan: "launch", status: { in: ["pending", "approved"] } },
      });
      if (already)
        return Response.json({ error: "launch_once_per_user" }, { status: 409 });
    }

    const pass = PASSES[body.data.plan as PassId];
    const request = await db.paymentRequest.create({
      data: {
        profileId: profile.id,
        plan: pass.id,
        amount: pass.price,
        utr: body.data.payer,
      },
    });
    return Response.json(request, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
