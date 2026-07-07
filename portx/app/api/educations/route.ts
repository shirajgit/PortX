import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

const EduInput = z.object({
  institution: z.string().min(1).max(120),
  degree: z.string().max(120).optional().default(""),
  startYear: z.number().int().min(1950).max(2100).optional().nullable(),
  endYear: z.number().int().min(1950).max(2100).optional().nullable(),
  score: z.string().max(40).optional().default(""),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const rows = await db.education.findMany({
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
    const body = EduInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    const row = await db.education.create({ data: { profileId: profile.id, ...body.data } });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
