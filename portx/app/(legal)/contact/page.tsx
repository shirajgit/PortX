import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `How to reach the ${SITE_NAME} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <h1>Contact Us</h1>
      <p>
        Questions about your account, a payment or a refund? Get in touch and we will reply within
        2 business days.
      </p>

      <dl className="mt-8 space-y-5 rounded-xl border border-[#1E2C52] bg-[#0F1730]/60 p-6">
        {BUSINESS.legalName && (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider">Operated by</dt>
            <dd className="mt-1 text-base text-foreground">{BUSINESS.legalName}</dd>
          </div>
        )}
        {BUSINESS.email && (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider">Email</dt>
            <dd className="mt-1 text-base"><a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></dd>
            {BUSINESS.altEmail && (
              <dd className="mt-1 text-base"><a href={`mailto:${BUSINESS.altEmail}`}>{BUSINESS.altEmail}</a></dd>
            )}
          </div>
        )}
        {BUSINESS.phone && (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider">Phone</dt>
            <dd className="mt-1 text-base"><a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, "")}`}>{BUSINESS.phone}</a></dd>
          </div>
        )}
        {BUSINESS.address && (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider">Address</dt>
            <dd className="mt-1 whitespace-pre-line text-base text-foreground">{BUSINESS.address}</dd>
          </div>
        )}
      </dl>

      <p className="mt-6">
        For payment issues, please include your {SITE_NAME} username and the payment reference from your
        Billing page so we can find it quickly.
      </p>
      <p>
        Looking for how-to answers? The <Link href="/help">Help Center</Link> covers setup, templates, resumes and billing.
      </p>
    </>
  );
}
