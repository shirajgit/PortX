import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { SectionItem, SECTION_KINDS } from "@/lib/sections";

const SectionInput = z.object({
  title: z.string().trim().min(1).max(60),
  kind: z.enum(SECTION_KINDS).default("custom"),
  items: z.array(SectionItem).max(30).default([]),
});

export async function GET() {
  try {
    const profile = await requireProfile();
    const rows = await db.customSection.findMany({
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
    const body = SectionInput.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });
    // new sections go to the end
    const last = await db.customSection.findFirst({
      where: { profileId: profile.id },
      orderBy: { sort: "desc" },
      select: { sort: true },
    });
    const row = await db.customSection.create({
      data: { profileId: profile.id, ...body.data, sort: (last?.sort ?? -1) + 1 },
    });
    return Response.json(row, { status: 201 });
  } catch (e) {
    return handleAuthError(e);
  }
}
