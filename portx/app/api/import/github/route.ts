import { z } from "zod";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { fetchGithubProjects } from "@/lib/github";

const Input = z.object({ username: z.string().min(1).max(40) });

/** Returns DRAFT projects — the client shows a review modal, then POSTs chosen ones to /api/projects. */
export async function POST(req: Request) {
  try {
    await requireProfile();
    const body = Input.safeParse(await req.json());
    if (!body.success)
      return Response.json({ error: "invalid_username" }, { status: 400 });
    const drafts = await fetchGithubProjects(body.data.username);
    return Response.json({ drafts });
  } catch (e) {
    if (e instanceof Error && e.message === "github_fetch_failed")
      return Response.json({ error: "github_fetch_failed" }, { status: 502 });
    return handleAuthError(e);
  }
}
