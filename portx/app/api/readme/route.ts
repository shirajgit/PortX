import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { generateReadme } from "@/lib/readme";
import { SITE_URL } from "@/lib/site";

/** ?github=<login> sets the account for the stats cards; ?github= (empty) hides them;
    no param falls back to the GitHub link on the profile. */
export async function GET(req: Request) {
  try {
    const profile = await requireProfile();
    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });
    const param = new URL(req.url).searchParams.get("github");
    const github = param === null ? undefined : /^[A-Za-z0-9-]{1,39}$/.test(param) ? param : null;
    const markdown = generateReadme(result.data, SITE_URL, result.username, { github });
    return Response.json({ markdown });
  } catch (e) {
    return handleAuthError(e);
  }
}
