import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_LIMITS } from "@/lib/billing";

export const ProjectInput = z.object({
  name: z.string().min(1).max(80),
  tagline: z.string().max(140).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  bullets: z.array(z.string().max(300)).max(8).default([]),
  tech: z.array(z.string().max(30)).max(15).default([]),
  liveUrl: z.string().url().optional().nullable(),
  repoUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  source: z.enum(["manual", "github"]).default("manual"),
  githubRepo: z.string().max(120).optional().nullable(),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const projects = await db.project.findMany({
      where: { profileId: profile.id },
      orderBy: [{ featured: "desc" }, { sort: "asc" }],
    });
    return Response.json(projects);
  } catch (e) {
    return handleAuthError(e);
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    if (!isPro(profile)) {
      const count = await db.project.count({ where: { profileId: profile.id } });
      if (count >= FREE_LIMITS.projects)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_LIMITS.projects, upgrade: "/dashboard/billing" },
          { status: 403 }
        );
    }
    const body = ProjectInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten(), message: "Invalid user input" }, { status: 400 });
    const project = await db.project.create({
      data: { profileId: profile.id, ...body.data },
    });
    return Response.json(project, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
