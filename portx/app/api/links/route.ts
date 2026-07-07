import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

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
