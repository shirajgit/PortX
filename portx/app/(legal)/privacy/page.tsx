import type { Metadata } from "next";
import Link from "next/link";
import { BUSINESS, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `What ${SITE_NAME} collects, why, and who it is shared with.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const operator = BUSINESS.legalName || SITE_NAME;
  return (
    <>
      <h1>Privacy Policy</h1>
      <p>Last updated: 13 October 2026</p>

      <p>
        This policy explains what information {operator} (&quot;we&quot;, &quot;us&quot;) collects when you use {SITE_NAME},
        how we use it and the choices you have.
      </p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Account details</strong> — your name, email address and sign-in information, handled through our authentication provider.</li>
        <li><strong>Profile content</strong> — what you choose to add: headline, summary, location, phone, photo, links, experience, projects, skills and education.</li>
        <li><strong>Imported data</strong> — public repository information from GitHub, if you choose to import it.</li>
        <li><strong>Payment records</strong> — the pass you bought, the amount, and the order and payment reference from Razorpay. We never see or store your card, UPI PIN or bank details.</li>
        <li><strong>Usage data</strong> — counts of visits to published portfolios and resumes, and where the visit came from.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>to build and display your portfolio, resume and README;</li>
        <li>to activate and manage your plan;</li>
        <li>to show you view statistics for your own pages;</li>
        <li>to provide AI suggestions when you ask for them;</li>
        <li>to keep the service secure, fix problems and respond to your requests.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>3. What is public</h2>
      <p>
        When you publish your portfolio, the profile content on it — including any email, phone number or
        location you chose to add — is visible to anyone with the link and may be indexed by search
        engines. Unpublish it or remove a field at any time from your dashboard.
      </p>

      <h2>4. Who we share it with</h2>
      <p>We share information only with the services needed to run {SITE_NAME}:</p>
      <ul>
        <li><strong>Clerk</strong> — sign-in and account management;</li>
        <li><strong>Razorpay</strong> — payment processing;</li>
        <li><strong>OpenRouter</strong> — the profile text you submit to an AI feature is sent to an AI model to generate the result;</li>
        <li><strong>GitHub</strong> — to read public repositories when you import projects;</li>
        <li>our hosting and database providers.</li>
      </ul>
      <p>We may also disclose information when the law requires it.</p>

      <h2>5. Cookies</h2>
      <p>
        We use cookies and local storage that are necessary to keep you signed in and remember preferences
        such as your theme. The payment window is served by Razorpay, which may set its own cookies.
      </p>

      <h2>6. Retention and deletion</h2>
      <p>
        We keep your information while your account exists. You can edit or remove profile content from
        your dashboard, and you can ask us to delete your account and its data through
        the <Link href="/contact">Contact</Link> page. Payment records may be kept for as long as tax and accounting law requires.
      </p>

      <h2>7. Security</h2>
      <p>
        We use encrypted connections and access controls to protect your data. No online service can
        guarantee absolute security, so please use a strong, unique sign-in.
      </p>

      <h2>8. Your rights</h2>
      <p>
        You can ask to see, correct or delete the personal information we hold about you, or withdraw
        consent, by contacting us. We will respond within a reasonable time.
      </p>

      <h2>9. Changes</h2>
      <p>If we change this policy we will update the date above and post the new version on this page.</p>

      <h2>10. Contact</h2>
      <p>
        Privacy questions or requests? Reach us through the <Link href="/contact">Contact</Link> page.
      </p>
    </>
  );
}
