/* Canonical site address — one place, used by metadata, sitemap, robots and
   structured data. Override with NEXT_PUBLIC_APP_URL (no trailing slash needed). */

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://portxz.xyz").replace(/\/+$/, "");

export const SITE_NAME = "Portxz";

export const SITE_DESCRIPTION =
  "Free portfolio builder and ATS resume maker. One profile creates your portfolio website, a resume you can tailor to any job description, and your GitHub README.";

/* Who operates the site — shown on /contact and the policy pages. Payment
   gateways check these during website review; an empty field is left off the page. */
export const BUSINESS = {
  legalName: "", // registered business name, or your full name if a sole proprietor
  email: "",     // support email
  phone: "",     // e.g. "+91 98765 43210"
  address: "",   // registered / operating address
};

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/shipping-policy", label: "Shipping & Delivery" },
  { href: "/contact", label: "Contact Us" },
] as const;

/** Serialise structured data for a <script type="application/ld+json"> tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** Metadata robots value for pages that must never appear in search results. */
export const NO_INDEX = { index: false, follow: false } as const;
