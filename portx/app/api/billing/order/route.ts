import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { PASSES, LAUNCH_OFFER_LIMIT, type PassId } from "@/lib/billing";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";

const Input = z.object({ plan: z.enum(["launch", "month", "halfyear", "year"]) });

/** An unpaid checkout holds its launch slot this long. */
const LAUNCH_HOLD_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    if (!razorpayConfigured())
      return Response.json({ error: "razorpay_not_configured" }, { status: 503 });

    if (body.data.plan === "launch") {
      const claimed = await db.paymentRequest.count({
        where: {
          plan: "launch",
          OR: [
            { status: { in: ["pending", "approved"] } },
            {
              status: "created",
              profileId: { not: profile.id },
              createdAt: { gt: new Date(Date.now() - LAUNCH_HOLD_MS) },
            },
          ],
        },
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
    const id = randomUUID();
    const order = await createOrder(pass.price, id, { profileId: profile.id, plan: pass.id });
    await db.paymentRequest.create({
      data: {
        id,
        profileId: profile.id,
        plan: pass.id,
        amount: pass.price,
        utr: "",
        orderId: order.id,
        status: "created",
      },
    });

    return Response.json(
      { keyId: process.env.RAZORPAY_KEY_ID, orderId: order.id, amount: order.amount, currency: order.currency },
      { status: 201 },
    );
  } catch (e) {
    return handleAuthError(e);
  }
}
