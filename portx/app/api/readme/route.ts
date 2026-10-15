import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { generateReadme } from "@/lib/readme";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  try {
    const profile = await requireProfile();
    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });
    const markdown = generateReadme(result.data, SITE_URL, result.username);
    return Response.json({ markdown });
  } catch (e) {
    return handleAuthError(e);
  }
}
