import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Search engines may crawl the landing page and every published portfolio.
   Signed-in areas and API routes are blocked outright. Sign-in, sign-up and
   previews stay crawlable on purpose: they carry a noindex tag, and a crawler
   blocked here would never see it — the URL could still get listed. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/setup"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
