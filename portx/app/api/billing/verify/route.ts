import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { fulfillOrder, verifyCheckoutSignature } from "@/lib/razorpay";

const Input = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: "bad_input" }, { status: 400 });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body.data;

    const request = await db.paymentRequest.findUnique({ where: { orderId: razorpay_order_id } });
    if (!request || request.profileId !== profile.id)
      return Response.json({ error: "not_found" }, { status: 404 });
    if (!verifyCheckoutSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature))
      return Response.json({ error: "bad_signature" }, { status: 400 });

    await fulfillOrder(razorpay_order_id, razorpay_payment_id);
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}
