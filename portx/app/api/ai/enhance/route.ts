import { z } from "zod";
import { requireProfile, handleAuthError } from "@/lib/auth";

const SYSTEM = `You improve resume/portfolio text for a software developer.
Rules: rewrite ONLY the provided text. Never invent metrics, employers,
technologies, or outcomes not present in the input. Keep it concise and
action-verb-led. Return plain text only, no preamble, no quotes.`;

const MODES = {
  bullet: "Rewrite as one strong resume bullet (max 25 words).",
  summary: "Rewrite as a 2-3 sentence professional summary.",
  tagline: "Rewrite as a one-line project tagline (max 15 words).",
} as const;

const Input = z.object({
  mode: z.enum(["bullet", "summary", "tagline"]),
  text: z.string().min(3).max(1000),
});

export async function POST(req: Request) {
  try {
    await requireProfile();
    if (!process.env.ANTHROPIC_API_KEY)
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: `${SYSTEM}\n${MODES[body.data.mode]}`,
        messages: [{ role: "user", content: body.data.text }],
      }),
    });
    if (!res.ok) return Response.json({ error: "ai_failed" }, { status: 502 });
    const data = await res.json();
    const suggestion: string =
      data.content?.filter((c: any) => c.type === "text").map((c: any) => c.text).join("\n").trim() ?? "";
    return Response.json({ suggestion });
  } catch (e) {
    return handleAuthError(e);
  }
}
