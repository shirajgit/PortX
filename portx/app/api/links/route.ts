import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { isPro, FREE_LIMITS } from "@/lib/billing";

const LinkInput = z.object({
  kind: z.enum(["github", "linkedin", "x", "website", "custom"]),
  label: z.string().max(40).optional().default(""),
  url: z.string().url().max(200),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const rows = await db.link.findMany({
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
    if (!isPro(profile)) {
      const count = await db.link.count({ where: { profileId: profile.id } });
      if (count >= FREE_LIMITS.links)
        return Response.json(
          { error: "free_limit_reached", limit: FREE_LIMITS.links, upgrade: "/dashboard/billing" },
          { status: 403 }
        );
    }
    const body = LinkInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    const row = await db.link.create({
      data: { profileId: profile.id, ...body.data, label: body.data.label || body.data.kind },
    });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
