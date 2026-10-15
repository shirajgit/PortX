import { z } from "zod";
import { db } from "@/lib/db";
import { recordEvent } from "@/lib/track";

const Input = z.object({
  username: z.string().min(3).max(30),
  kind: z.enum(["view", "link_click"]),
  ref: z.string().max(120).optional(),
});

/** Public beacon from portfolio pages. Bots, repeats and bursts are dropped quietly (still 200). */
export async function POST(req: Request) {
  const body = Input.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ ok: false }, { status: 400 });

  const profile = await db.profile.findUnique({
    where: { username: body.data.username },
    select: { id: true, isPublished: true },
  });
  if (!profile?.isPublished) return Response.json({ ok: false }, { status: 404 });

  await recordEvent(req, profile.id, body.data.kind, body.data.ref ?? null);
  return Response.json({ ok: true });
}
