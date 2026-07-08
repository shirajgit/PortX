import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_LIMITS } from "@/lib/billing";

const PatchInput = z.object({
  category: z.string().min(1).max(50).optional(),
  items: z.array(z.string().max(30)).max(25).optional(),
  sort: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const profile = await requireProfile();
    const { id } = await ctx.params;
    const body = PatchInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    if (body.data.items && !isPro(profile)) {
      const groups = await db.skill.findMany({
        where: { profileId: profile.id, NOT: { id } },
        select: { items: true },
      });
      const others = groups.reduce(
        (n, g) => n + (Array.isArray(g.items) ? g.items.length : 0),
        0
      );
      if (others + body.data.items.length > FREE_LIMITS.skillItems)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_LIMITS.skillItems, upgrade: "/dashboard/billing" },
          { status: 403 }
        );
    }

    const r = await db.skill.updateMany({
      where: { id, profileId: profile.id },
      data: body.data,
    });
    if (r.count === 0) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  try {
    const profile = await requireProfile();
    const { id } = await ctx.params;
    const r = await db.skill.deleteMany({ where: { id, profileId: profile.id } });
    if (r.count === 0) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}