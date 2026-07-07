import { db } from "./db";
import type { PortfolioData } from "@/components/templates/types";

const fmtMonth = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null;

const arr = (j: unknown): string[] => (Array.isArray(j) ? (j as string[]) : []);

export async function getPortfolioData(
  username: string
): Promise<{ template: string; data: PortfolioData; profileId: string } | null> {
  const p = await db.profile.findUnique({
    where: { username },
    include: {
      links: { orderBy: { sort: "asc" } },
      experiences: { orderBy: { sort: "asc" } },
      projects: { orderBy: [{ featured: "desc" }, { sort: "asc" }] },
      skills: { orderBy: { sort: "asc" } },
      educations: { orderBy: { sort: "asc" } },
    },
  });
  if (!p || !p.isPublished) return null;

  return {
    template: p.template,
    profileId: p.id,
    data: {
      profile: {
        fullName: p.fullName,
        headline: p.headline ?? "",
        summary: p.summary ?? "",
        location: p.location ?? "",
        email: p.email ?? "",
        avatarUrl: p.avatarUrl,
        openToWork: p.openToWork,
        themeConfig: (p.themeConfig as Record<string, unknown>) ?? {},
      },
      links: p.links.map((l) => ({ kind: l.kind, label: l.label ?? l.kind, url: l.url })),
      experiences: p.experiences.map((e) => ({
        title: e.title,
        organization: e.organization,
        location: e.location ?? "",
        startDate: fmtMonth(e.startDate),
        endDate: fmtMonth(e.endDate),
        bullets: arr(e.bullets),
      })),
      projects: p.projects.map((pr) => ({
        name: pr.name,
        tagline: pr.tagline ?? "",
        description: pr.description ?? "",
        bullets: arr(pr.bullets),
        tech: arr(pr.tech),
        liveUrl: pr.liveUrl,
        repoUrl: pr.repoUrl,
        imageUrl: pr.imageUrl,
        featured: pr.featured,
      })),
      skills: p.skills.map((s) => ({ category: s.category, items: arr(s.items) })),
      educations: p.educations.map((ed) => ({
        institution: ed.institution,
        degree: ed.degree ?? "",
        startYear: ed.startYear,
        endYear: ed.endYear,
        score: ed.score ?? "",
      })),
    },
  };
}
