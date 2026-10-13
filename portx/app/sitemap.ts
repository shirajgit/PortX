import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { SITE_URL, LEGAL_LINKS } from "@/lib/site";

// Rebuilt at most once an hour, so newly published portfolios show up without a deploy.
export const revalidate = 3600;

/* The landing page plus every published portfolio. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...LEGAL_LINKS.map((l) => ({
      url: `${SITE_URL}${l.href}`,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  try {
    const profiles = await db.profile.findMany({
      where: { isPublished: true },
      select: { username: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 45000, // a single sitemap file may hold 50,000 URLs
    });
    return [
      ...home,
      ...profiles.map((p) => ({
        url: `${SITE_URL}/${p.username}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch (e) {
    console.error("sitemap: could not load profiles", e);
    return home;
  }
}
