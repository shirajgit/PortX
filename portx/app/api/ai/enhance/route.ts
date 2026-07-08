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
    if (!process.env.OPENROUTER_API_KEY)
      return Response.json({ error: "ai_not_configured" }, { status: 501 });

    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: body.error.flatten() }, { status: 400 });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
       model: "nvidia/nemotron-3-nano-30b-a3b:free",
        max_tokens: 300,
        messages: [
          { role: "system", content: `${SYSTEM}\n${MODES[body.data.mode]}` },
          { role: "user", content: body.data.text },
        ],
      }),
    });
    if (!res.ok) {
      const errBody = await res.text().catch(() => "");
      console.error("OpenRouter error:", res.status, errBody);
      return Response.json(
        { error: `openrouter_${res.status}`, detail: errBody.slice(0, 300) },
        { status: 502 }
      );
    }
    const data = await res.json();
    const suggestion: string =
      data.choices?.[0]?.message?.content?.trim() ?? "";
    if (!suggestion) return Response.json({ error: "ai_empty_response" }, { status: 502 });
    return Response.json({ suggestion });
  } catch (e) {
    return handleAuthError(e);
  }
}