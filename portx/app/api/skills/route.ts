import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_LIMITS } from "@/lib/billing";

const SkillInput = z.object({
  category: z.string().min(1).max(50),
  items: z.array(z.string().max(30)).max(25).default([]),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const rows = await db.skill.findMany({
      where: { profileId: profile.id },
      orderBy: { sort: "asc" },
    });
    return Response.json(rows);
  } catch (e) {
    return handleAuthError(e);
  }
}

export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = SkillInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    if (!isPro(profile)) {
      const groups = await db.skill.findMany({
        where: { profileId: profile.id },
        select: { items: true },
      });
      const existing = groups.reduce(
        (n, g) => n + (Array.isArray(g.items) ? g.items.length : 0),
        0
      );
      if (existing + body.data.items.length > FREE_LIMITS.skillItems)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_LIMITS.skillItems, upgrade: "/dashboard/billing" },
          { status: 403 }
        );
    }
    const row = await db.skill.create({ data: { profileId: profile.id, ...body.data } });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}