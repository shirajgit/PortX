import { requireProfile, handleAuthError } from "@/lib/auth";
import { getOwnPortfolioData } from "@/lib/data";
import { generateReadme } from "@/lib/readme";

export async function GET() {
  try {
    const profile = await requireProfile();
    const result = await getOwnPortfolioData(profile.id);
    if (!result) return Response.json({ error: "no_profile" }, { status: 404 });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://portx.in";
    const markdown = generateReadme(result.data, appUrl, result.username);
    return Response.json({ markdown });
  } catch (e) {
    return handleAuthError(e);
  }
}
