import type { Metadata } from "next";

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
  email: "hello.aishitech@gmail.com", // support email
  altEmail: "shirajmujawar03@gmail.com", // founder's direct email
  phone: "+91 81053 69922",
  address: "",   // registered / operating address
};

export const LEGAL_LINKS = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund-policy", label: "Refund & Cancellation" },
  { href: "/shipping-policy", label: "Shipping & Delivery" },
  { href: "/help", label: "Help Center" },
  { href: "/contact", label: "Contact Us" },
] as const;

/** Serialise structured data for a <script type="application/ld+json"> tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

/** Metadata robots value for pages that must never appear in search results. */
export const NO_INDEX = { index: false, follow: false } as const;

export const OG_IMAGE = { url: "/brand/og.png", width: 1200, height: 630, alt: `${SITE_NAME} — one profile, always in sync` };

/** Metadata for a public page. Next merges metadata shallowly, so a page that sets
    only a title would inherit the home page's openGraph (title, url) — this sets its own. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: SITE_NAME, locale: "en_IN", url: path, title: full, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: full, description, images: [OG_IMAGE.url] },
  };
}

/** Cut text to at most `max` characters on a word boundary, for meta descriptions. */
export function clip(text: string, max = 155) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,.;:–—-]+$/, "")}…`;
}
