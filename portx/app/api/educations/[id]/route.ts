import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

const PatchInput = z.object({
  institution: z.string().min(1).max(120).optional(),
  degree: z.string().max(120).optional(),
  startYear: z.number().int().min(1950).max(2100).nullable().optional(),
  endYear: z.number().int().min(1950).max(2100).nullable().optional(),
  score: z.string().max(40).optional(),
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
    const r = await db.education.updateMany({ where: { id, profileId: profile.id }, data: body.data });
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
    const r = await db.education.deleteMany({ where: { id, profileId: profile.id } });
    if (r.count === 0) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}
