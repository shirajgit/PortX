import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { faqFor } from "@/lib/faq";

// Structured data is static, so it uses the home-market (INR) prices.
const FAQ = faqFor("INR");
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, jsonLd } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* Structured data for the home page: the product, the site, and the FAQ. */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/portxz-mark.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      image: `${SITE_URL}/brand/og.png`,
      description: SITE_DESCRIPTION,
      featureList: [
        "Portfolio website builder with 8 templates",
        "ATS-friendly resume PDF with 6 templates",
        "Tailor your resume to any job description: match score, missing keywords, rewritten bullets",
        "AI portfolio review and writing help",
        "GitHub import and profile README generator",
      ],
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(STRUCTURED_DATA) }} />
      <Landing />
    </>
  );
}
