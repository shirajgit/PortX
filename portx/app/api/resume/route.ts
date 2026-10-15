import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { isPro } from "@/lib/billing";
import { ResumeConfigSchema } from "@/lib/resume";

/** The editor's data: own portfolio content (for the live preview) + saved resume config. */
export async function GET() {
  try {
    const profile = await requireProfile();
    const own = await getOwnPortfolioData(profile.id);
    if (!own) return Response.json({ error: "no_profile" }, { status: 404 });
    return Response.json({
      data: own.data,
      config: own.resumeConfig,
      username: own.username,
      published: profile.isPublished,
      pro: isPro(profile),
    });
  } catch (e) {
    return handleAuthError(e);
  }
}

/** Save template + resume-only edits. Pro, like the resume itself. */
export async function PUT(req: Request) {
  try {
    const profile = await requireProfile();
    if (!isPro(profile))
      return Response.json({ error: "pro_required", upgrade: "/dashboard/billing" }, { status: 403 });
    // Lenient schema: unknown or invalid values fall back to defaults rather than failing.
    const config = ResumeConfigSchema.parse(await req.json().catch(() => ({})));
    await db.profile.update({ where: { id: profile.id }, data: { resumeConfig: config } });
    return Response.json({ ok: true, config });
  } catch (e) {
    return handleAuthError(e);
  }
}
