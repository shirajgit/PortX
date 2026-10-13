import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description: `How refunds and cancellations work for ${SITE_NAME} Pro passes.`,
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <>
      <h1>Refund &amp; Cancellation Policy</h1>
      <p>Last updated: 13 October 2026</p>

      <h2>1. Cancellation</h2>
      <p>
        {SITE_NAME} Pro is a one-time prepaid pass, not a subscription. It never renews automatically, so
        there is nothing to cancel — when the paid period ends your account simply returns to the free
        plan and you are not charged again.
      </p>

      <h2>2. Refunds</h2>
      <p>
        Pro is a digital service that activates immediately after payment, so a pass is generally
        non-refundable once it is active. We will refund you in these cases:
      </p>
      <ul>
        <li><strong>Charged but not activated</strong> — your payment succeeded but Pro was not activated on your account and we cannot fix it.</li>
        <li><strong>Duplicate payment</strong> — you were charged more than once for the same pass.</li>
        <li><strong>Wrong amount</strong> — you were charged a different amount from the price shown.</li>
      </ul>

      <h2>3. How to request a refund</h2>
      <p>
        Write to us through the <Link href="/contact">Contact</Link> page within <strong>7 days</strong> of the payment.
        Include your {SITE_NAME} username and the payment reference shown under History on your Billing page.
        We reply within 2 business days.
      </p>

      <h2>4. Refund timeline</h2>
      <p>
        Approved refunds are sent back to the original payment method through Razorpay and normally
        reach your account within <strong>5–7 business days</strong>, depending on your bank.
      </p>

      <h2>5. Failed payments</h2>
      <p>
        If money left your account but the payment failed, your bank or UPI app usually reverses it
        automatically within 5–7 business days. If it does not, contact us with the transaction details.
      </p>
    </>
  );
}
