import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

const PatchInput = z.object({
  title: z.string().min(1).max(80).optional(),
  organization: z.string().min(1).max(100).optional(),
  location: z.string().max(80).optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  bullets: z.array(z.string().max(300)).max(8).optional(),
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
    const { startDate, endDate, ...rest } = body.data;
    const data: Record<string, unknown> = { ...rest };
    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    const r = await db.experience.updateMany({ where: { id, profileId: profile.id }, data });
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
    const r = await db.experience.deleteMany({ where: { id, profileId: profile.id } });
    if (r.count === 0) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}
