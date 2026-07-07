import { z } from "zod";
import { db } from "@/lib/db";

const Input = z.object({
  username: z.string().min(3).max(30),
  kind: z.enum(["view", "pdf_download", "link_click"]),
  ref: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const body = Input.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ ok: false }, { status: 400 });

  const profile = await db.profile.findUnique({
    where: { username: body.data.username },
    select: { id: true, isPublished: true },
  });
  if (!profile?.isPublished) return Response.json({ ok: false }, { status: 404 });

  await db.pageView.create({
    data: { profileId: profile.id, kind: body.data.kind, ref: body.data.ref ?? null },
  });
  return Response.json({ ok: true });
}
