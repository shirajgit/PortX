import { db } from "./db";
import type { Prisma } from "@/lib/generated/prisma/client";
import type { PortfolioData } from "@/components/templates/types";
import { parseItems } from "./sections";
import { PRO_TEMPLATES, isPro } from "./billing";

const fmtMonth = (d: Date | null) =>
  d ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null;

const arr = (j: unknown): string[] => (Array.isArray(j) ? (j as string[]) : []);

const INCLUDE = {
  links: { orderBy: { sort: "asc" } },
  experiences: { orderBy: { sort: "asc" } },
  projects: { orderBy: [{ featured: "desc" }, { sort: "asc" }] },
  skills: { orderBy: { sort: "asc" } },
  educations: { orderBy: { sort: "asc" } },
  customSections: { orderBy: { sort: "asc" } },
} satisfies Prisma.ProfileInclude;

type ProfileWithRelations = Prisma.ProfileGetPayload<{ include: typeof INCLUDE }>;

/** Public data. `forResume` adds the phone number, which only the resume prints —
    never pass it to portfolio templates (they're client components, so it would land in the page source). */
export async function getPortfolioData(
  username: string,
  opts: { forResume?: boolean } = {}
): Promise<{ template: string; data: PortfolioData; profileId: string } | null> {
  const p = await db.profile.findUnique({ where: { username }, include: INCLUDE });
  if (!p || !p.isPublished) return null;
  const result = assemble(p);
  if (opts.forResume && p.phone) result.data.profile.phone = p.phone;
  // Pro designs need an active pass. The choice stays saved, so it comes back on renewal.
  if (PRO_TEMPLATES.has(result.template) && !isPro(p)) result.template = "minimal";
  return result;
}

/** Own data for dashboard tools — no publish check. Includes the phone (it's the owner's own data). */
export async function getOwnPortfolioData(
  profileId: string
): Promise<{ template: string; data: PortfolioData; profileId: string; username: string } | null> {
  const p = await db.profile.findUnique({ where: { id: profileId }, include: INCLUDE });
  if (!p) return null;
  const result = assemble(p);
  if (p.phone) result.data.profile.phone = p.phone;
  return { ...result, username: p.username };
}

function assemble(p: ProfileWithRelations): { template: string; profileId: string; data: PortfolioData } {
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
      sections: p.customSections
        .map((c) => ({ title: c.title, kind: c.kind, items: parseItems(c.items) }))
        .filter((c) => c.items.length > 0),
    },
  };
}
