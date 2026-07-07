import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

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
    const row = await db.skill.create({ data: { profileId: profile.id, ...body.data } });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
