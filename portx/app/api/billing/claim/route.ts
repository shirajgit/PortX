import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { PASSES, type PassId } from "@/lib/billing";

const Input = z.object({
  plan: z.enum(["month", "halfyear", "year"]),
  utr: z.string().min(8).max(30).regex(/^[A-Za-z0-9]+$/, "utr must be alphanumeric"),
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

    const dupUtr = await db.paymentRequest.findFirst({
      where: { utr: body.data.utr, status: { in: ["pending", "approved"] } },
    });
    if (dupUtr)
      return Response.json({ error: "utr_already_used" }, { status: 409 });

    const pass = PASSES[body.data.plan as PassId];
    const request = await db.paymentRequest.create({
      data: {
        profileId: profile.id,
        plan: pass.id,
        amount: pass.price,
        utr: body.data.utr,
      },
    });
    return Response.json(request, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
