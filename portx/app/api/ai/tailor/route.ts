import { z } from "zod";
import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { isPro, PRO_AI_LIMITS } from "@/lib/billing";
import { aiConfigured, chat } from "@/lib/ai";
import { buildTailorPrompt, parseTailorResponse, rewritableLines } from "@/lib/tailor";

export const maxDuration = 45;

const Input = z.object({ job: z.string().trim().min(80).max(8000) });

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

/** Tailor the user's resume to a pasted job description. Returns suggestions plus the resume data they apply to. */
export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    if (!aiConfigured())
      return Response.json({ error: "ai_not_configured" }, { status: 501 });
    if (!isPro(profile))
      return Response.json({ error: "pro_required", upgrade: "/dashboard/billing" }, { status: 403 });

    const body = Input.safeParse(await req.json().catch(() => null));
    if (!body.success) return Response.json({ error: "job_too_short" }, { status: 400 });

    const used = await db.pageView.count({
      where: { profileId: profile.id, kind: "ai_tailor", createdAt: { gte: new Date(Date.now() - THIRTY_DAYS) } },
    });
    if (used >= PRO_AI_LIMITS.tailor)
      return Response.json({ error: "pro_limit_reached", limit: PRO_AI_LIMITS.tailor }, { status: 429 });

    const own = await getOwnPortfolioData(profile.id);
    if (!own) return Response.json({ error: "no_profile" }, { status: 404 });
    const { data } = own;
    if (!data.experiences.length && !data.projects.length && !data.skills.length)
      return Response.json({ error: "profile_too_empty" }, { status: 422 });

    const { system, user } = buildTailorPrompt(data, body.data.job);
    // Light reasoning sharpens the job-to-profile matching without a big token bill.
    // Same job + same profile → cached result, free.
    const ai = await chat({
      thinking: "low",
      json: true,
      cache: true,
      validate: (s) => parseTailorResponse(s, data) !== null,
      maxTokens: 2200,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });
    if (!ai.ok) return Response.json({ error: ai.error }, { status: ai.status });

    const result = parseTailorResponse(ai.content, data);
    if (!result) return Response.json({ error: "ai_bad_response" }, { status: 502 });

    // Cached answers don't use up the monthly allowance.
    if (!ai.cached)
      await db.pageView.create({ data: { profileId: profile.id, kind: "ai_tailor", ref: String(result.score) } });
    return Response.json({
      result,
      data,
      lines: rewritableLines(data).size,
      remaining: PRO_AI_LIMITS.tailor - used - (ai.cached ? 0 : 1),
      cached: ai.cached,
    });
  } catch (e) {
    return handleAuthError(e);
  }
}
