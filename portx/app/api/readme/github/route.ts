import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { generateReadme } from "@/lib/readme";
import { SITE_URL } from "@/lib/site";
import { GithubError, getGithubAccounts, getGithubToken, publishReadme } from "@/lib/github-readme";

const Input = z.object({ owner: z.string().min(1).max(39).regex(/^[A-Za-z0-9-]+$/) });

function handle(e: unknown) {
  if (e instanceof GithubError) return Response.json({ error: e.message }, { status: e.status });
  return handleAuthError(e);
}

/** Connection status: is GitHub linked, with write access, and which accounts can we publish to. */
export async function GET() {
  try {
    await requireProfile();
    const { userId } = await auth();
    const gh = await getGithubToken(userId!);
    if (!gh) return Response.json({ connected: false });
    const { login, orgs } = await getGithubAccounts(gh.token);
    return Response.json({ connected: true, canWrite: gh.canWrite, login, orgs });
  } catch (e) {
    return handle(e);
  }
}

/** Generate the README from the profile and commit it to the chosen GitHub account. */
export async function POST(req: Request) {
  try {
    const profile = await requireProfile();
    const body = Input.safeParse(await req.json().catch(() => null));
    if (!body.success) return Response.json({ error: "invalid_owner" }, { status: 400 });

    const { userId } = await auth();
    const gh = await getGithubToken(userId!);
    if (!gh) return Response.json({ error: "github_not_connected" }, { status: 400 });
    if (!gh.canWrite) return Response.json({ error: "github_missing_scope" }, { status: 403 });

    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });
    // Stats cards only work for user accounts, so organization READMEs skip them.
    const { login } = await getGithubAccounts(gh.token);
    const isPersonal = body.data.owner.toLowerCase() === login.toLowerCase();
    const markdown = generateReadme(result.data, SITE_URL, result.username, { github: isPersonal ? login : null });

    return Response.json(await publishReadme(gh.token, body.data.owner, markdown));
  } catch (e) {
    return handle(e);
  }
}
