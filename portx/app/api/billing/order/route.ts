import { randomUUID } from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { PASSES } from "@/lib/billing";
import { createOrder, razorpayConfigured } from "@/lib/razorpay";
import { SELLABLE_PASSES, currencyFromHeaders, priceOf } from "@/lib/pricing";
import { launchSlotsLeft, launchUsedBy } from "@/lib/launch";

const Input = z.object({ plan: z.enum(SELLABLE_PASSES) });

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    if (!razorpayConfigured())
      return Response.json({ error: "razorpay_not_configured" }, { status: 503 });

    if (body.data.plan === "launch") {
      if ((await launchSlotsLeft(profile.id)) <= 0)
        return Response.json({ error: "launch_offer_over" }, { status: 410 });
      if (await launchUsedBy(profile.id))
        return Response.json({ error: "launch_once_per_user" }, { status: 409 });
    }

    const pass = PASSES[body.data.plan];
    // Currency comes from the request's IP country, never from the browser.
    const currency = currencyFromHeaders(req.headers);
    // Sale or regular price, decided here at order time — the sale ends on its own.
    const price = priceOf(body.data.plan, currency);
    const id = randomUUID();
    const order = await createOrder(price, currency, id, { profileId: profile.id, plan: pass.id });
    await db.paymentRequest.create({
      data: {
        id,
        profileId: profile.id,
        plan: pass.id,
        amount: price,
        currency,
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
