import { createHmac, timingSafeEqual } from "crypto";
import { db } from "./db";
import { PASSES, newExpiry, type PassId } from "./billing";
import { toMinorUnits, type Currency } from "./pricing";

/* ── Razorpay: orders, signature checks, fulfilment ─────────────────── */

export function razorpayConfigured(): boolean {
  return !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;
}

function hmacMatches(payload: string, secret: string, signature: string): boolean {
  const expected = Buffer.from(createHmac("sha256", secret).update(payload).digest("hex"));
  const given = Buffer.from(signature);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Create a Razorpay order. `amount` is in the currency's major unit (rupees, dollars…). */
export async function createOrder(
  amount: number,
  currency: Currency,
  receipt: string,
  notes: Record<string, string>,
) {
  const basic = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
    body: JSON.stringify({ amount: toMinorUnits(amount), currency, receipt, notes }),
  });
  if (!res.ok) throw new Error(`razorpay order failed (${res.status}): ${await res.text()}`);
  return (await res.json()) as { id: string; amount: number; currency: string };
}

/** Signature Checkout hands back to the browser after a successful payment. */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  return hmacMatches(`${orderId}|${paymentId}`, process.env.RAZORPAY_KEY_SECRET ?? "", signature);
}

/** X-Razorpay-Signature over the raw webhook body. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  return !!secret && hmacMatches(rawBody, secret, signature);
}

/**
 * Mark the order paid and extend Pro. Idempotent — the browser callback and the
 * webhook both call this, and only the first one to flip `created` applies the pass.
 */
export async function fulfillOrder(orderId: string, paymentId: string) {
  await db.$transaction(async (tx) => {
    const claimed = await tx.paymentRequest.updateMany({
      where: { orderId, status: "created" },
      data: { status: "approved", utr: paymentId, reviewedAt: new Date() },
    });
    if (claimed.count === 0) return;

    const request = await tx.paymentRequest.findUniqueOrThrow({
      where: { orderId },
      include: { profile: true },
    });
    const pass = PASSES[request.plan as PassId];
    await tx.profile.update({
      where: { id: request.profileId },
      data: {
        plan: "pro",
        planExpiresAt: newExpiry(request.profile.planExpiresAt, pass.days),
      },
    });
  });
}
