import type { Metadata } from "next";
import { HelpCenter } from "@/components/HelpCenter";
import { HELP_TOPICS } from "@/lib/help";
import { SITE_NAME, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Help Center",
  description: `How-to answers for ${SITE_NAME}: setting up your portfolio, templates, resume PDFs, job tailoring, billing and your account.`,
  alternates: { canonical: "/help" },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HELP_TOPICS.flatMap((t) => t.articles).map((a) => ({
    "@type": "Question",
    name: a.q,
    acceptedAnswer: { "@type": "Answer", text: a.a },
  })),
};

export default function HelpPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }} />
      <HelpCenter />
    </>
  );
}
