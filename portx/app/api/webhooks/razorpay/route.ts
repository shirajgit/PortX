import { fulfillOrder, verifyWebhookSignature } from "@/lib/razorpay";

/** Backstop for the browser callback — covers users who close the tab mid-payment. */
export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature))
    return Response.json({ error: "bad_signature" }, { status: 400 });

  const event = JSON.parse(raw);
  if (event.event === "payment.captured" || event.event === "order.paid") {
    const payment = event.payload?.payment?.entity;
    if (payment?.order_id && payment?.id) {
      try {
        await fulfillOrder(payment.order_id, payment.id);
      } catch (e) {
        // non-2xx makes Razorpay retry
        console.error(e);
        return Response.json({ error: "server_error" }, { status: 500 });
      }
    }
  }
  return Response.json({ ok: true });
}
