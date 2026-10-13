import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* Search engines may crawl the landing page and every published portfolio;
   signed-in areas, previews and API routes stay out of the index. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard", "/setup", "/preview/", "/sign-in", "/sign-up"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
