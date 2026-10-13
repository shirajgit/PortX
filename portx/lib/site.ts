/* Canonical site address — one place, used by metadata, sitemap, robots and
   structured data. Override with NEXT_PUBLIC_APP_URL (no trailing slash needed). */

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://www.portxz.xyz").replace(/\/+$/, "");

export const SITE_NAME = "Portxz";

export const SITE_DESCRIPTION =
  "Free portfolio builder for developers and professionals. One profile creates your live portfolio website, ATS-friendly resume PDF and GitHub README — always in sync.";

/** Serialise structured data for a <script type="application/ld+json"> tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
