import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description: `${SITE_NAME} is a digital service — access is delivered online, instantly.`,
  alternates: { canonical: "/shipping-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Shipping &amp; Delivery Policy</h1>
      <p>Last updated: 13 October 2026</p>

      <h2>1. No physical shipping</h2>
      <p>
        {SITE_NAME} is an online service. We do not sell or ship any physical goods, so there are no
        shipping charges and no delivery address is needed.
      </p>

      <h2>2. Digital delivery</h2>
      <p>
        When you buy a Pro pass, Pro features are activated on your {SITE_NAME} account as soon as the
        payment is confirmed — usually within a few seconds. You can see your plan and its expiry date
        on the Billing page of your dashboard.
      </p>

      <h2>3. If access is delayed</h2>
      <p>
        Occasionally a payment confirmation can take a few minutes to reach us. If Pro is not active
        within 30 minutes of a successful payment, contact us through the <Link href="/contact">Contact</Link> page
        with your username and payment reference and we will activate it or refund you as described in
        our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
      </p>
    </>
  );
}
