import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { SectionItem, SECTION_KINDS } from "@/lib/sections";
import { isPro } from "@/lib/billing";

const PatchInput = z.object({
  title: z.string().trim().min(1).max(60).optional(),
  kind: z.enum(SECTION_KINDS).optional(),
  items: z.array(SectionItem).max(30).optional(),
  sort: z.number().int().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  try {
    const profile = await requireProfile();
    const { id } = await ctx.params;
    // Editing needs Pro; deleting doesn't, so nobody is stuck with data they can't remove.
    if (!isPro(profile))
      return Response.json({ error: "pro_required", upgrade: "/dashboard/billing" }, { status: 403 });
    const body = PatchInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    const r = await db.customSection.updateMany({
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
    const r = await db.customSection.deleteMany({ where: { id, profileId: profile.id } });
    if (r.count === 0) return Response.json({ error: "not_found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (e) {
    return handleAuthError(e);
  }
}
