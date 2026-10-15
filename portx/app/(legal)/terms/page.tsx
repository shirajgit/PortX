import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `The terms that apply when you use ${SITE_NAME}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const operator = BUSINESS.legalName || SITE_NAME;
  return (
    <>
      <h1>Terms &amp; Conditions</h1>
      <p>Last updated: 13 October 2026</p>

      <p>
        These terms govern your use of {SITE_NAME} ({SITE_URL}), a service operated by {operator} (&quot;we&quot;,
        &quot;us&quot;). By creating an account or using the service you agree to them. If you do not agree,
        please do not use the service.
      </p>

      <h2>1. The service</h2>
      <p>
        {SITE_NAME} lets you enter your professional profile once and publish it as a portfolio website,
        an ATS-friendly resume and a GitHub README. The service is provided online only; nothing is
        shipped physically.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must give accurate information and keep your sign-in details secure.</li>
        <li>You are responsible for everything done through your account.</li>
        <li>You must be old enough to enter a binding contract where you live, or use the service with a parent or guardian&apos;s consent.</li>
      </ul>

      <h2>3. Your content</h2>
      <p>
        You keep ownership of everything you add to your profile. You give us permission to store, display
        and process it so we can run the service — including showing your published portfolio publicly at
        your {SITE_NAME} address. You confirm that you have the right to share the content you add and that
        it is truthful and lawful.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>post content that is illegal, misleading, hateful, harassing or that infringes someone else&apos;s rights;</li>
        <li>impersonate another person or claim a username to mislead others;</li>
        <li>attempt to disrupt, overload, scrape or gain unauthorised access to the service;</li>
        <li>resell or share paid access.</li>
      </ul>
      <p>We may remove content or suspend accounts that break these rules.</p>

      <h2>5. Plans and payments</h2>
      <ul>
        <li>The free plan is available at no charge, with limits on content and features.</li>
        <li>Pro is sold as a prepaid pass for a fixed period (for example 1 month, 6 months or 1 year). The price is shown in your local currency before you pay: Indian Rupees (INR) in India, British Pounds (GBP) in the UK, Euros (EUR) in the eurozone and US Dollars (USD) elsewhere.</li>
        <li>Passes are one-time payments. They do not renew automatically and you are not charged again unless you buy another pass.</li>
        <li>Payments are processed by Razorpay. We do not receive or store your card, UPI or bank details. International card payments may carry currency conversion charges from your bank.</li>
        <li>Buying a pass while one is active adds the new period on top of the remaining time.</li>
        <li>When a pass expires your account returns to the free plan. Your content is kept, but Pro-only features and templates stop being available.</li>
      </ul>
      <p>
        Refunds and cancellations are covered by our <Link href="/refund-policy">Refund &amp; Cancellation Policy</Link>.
      </p>

      <h2>6. AI features</h2>
      <p>
        AI suggestions and reviews are generated automatically and may be inaccurate. Review them before
        using them; you remain responsible for what you publish.
      </p>

      <h2>7. Availability and changes</h2>
      <p>
        We work to keep the service running but do not guarantee it will be uninterrupted or error-free.
        We may change, add or remove features, and may change prices for future purchases. A pass you
        have already bought keeps its paid period.
      </p>

      <h2>8. Ending your account</h2>
      <p>
        You can stop using the service at any time and can ask us to delete your account through
        the <Link href="/contact">Contact</Link> page. We may suspend or close an account that breaks these terms.
      </p>

      <h2>9. Liability</h2>
      <p>
        The service is provided &quot;as is&quot;. To the extent the law allows, we are not liable for indirect
        or consequential loss — such as a lost job opportunity — and our total liability to you is limited
        to the amount you paid us in the 12 months before the claim.
      </p>

      <h2>10. Governing law</h2>
      <p>These terms are governed by the laws of India, and disputes are subject to the courts of India.</p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms? Reach us through the <Link href="/contact">Contact</Link> page.
      </p>
    </>
  );
}
