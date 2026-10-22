import { z } from "zod";
import { db } from "@/lib/db";
import { recordSiteView } from "@/lib/track";

const Input = z.object({
  path: z.string().startsWith("/").max(200),
  ref: z.string().max(120).optional(),
});

/** Public beacon from the site's own pages. Portfolio pages report to /api/track instead. */
export async function POST(req: Request) {
  const body = Input.safeParse(await req.json().catch(() => null));
  if (!body.success) return Response.json({ ok: false }, { status: 400 });

  const path = body.data.path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const [first, second] = path.slice(1).split("/");
  if (first === "preview") return Response.json({ ok: true });
  // "/<username>" and "/<username>/resume" are portfolios, already counted in page_views.
  if (first && (!second || second === "resume")) {
    const profile = await db.profile.findUnique({ where: { username: first }, select: { id: true } });
    if (profile) return Response.json({ ok: true });
  }

  await recordSiteView(req, path, body.data.ref ?? null);
  return Response.json({ ok: true });
}
