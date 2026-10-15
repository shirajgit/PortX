import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { db } from "@/lib/db";
import { createHash } from "crypto";
import { isPro } from "@/lib/billing";
import { getPortfolioData } from "@/lib/data";
import { recordEvent } from "@/lib/track";

export const maxDuration = 30;

/* Caching: /api/pdf?username=x answers with a redirect to ?username=x&v=<content hash>.
   The versioned URL is CDN-cacheable, so Chrome only runs once per profile version
   instead of on every download. Any edit changes the hash and busts the cache. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const username = url.searchParams.get("username")?.toLowerCase() ?? "";
  const profile = await db.profile.findUnique({
    where: { username },
    select: { id: true, isPublished: true, plan: true, planExpiresAt: true },
  });
  if (!profile?.isPublished)
    return Response.json({ error: "not_found" }, { status: 404 });
  if (!isPro(profile))
    return Response.json({ error: "pro_required" }, { status: 403 });

  const portfolio = await getPortfolioData(username);
  if (!portfolio) return Response.json({ error: "not_found" }, { status: 404 });
  const version = createHash("sha256")
    .update(JSON.stringify([portfolio.template, portfolio.data]))
    .digest("hex")
    .slice(0, 16);

  if (url.searchParams.get("v") !== version) {
    // Every download passes through here, so this is where it's counted.
    await recordEvent(req, profile.id, "pdf_download");
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/api/pdf?username=${encodeURIComponent(username)}&v=${version}`,
        "Cache-Control": "no-store",
      },
    });
  }

  // Local dev: set CHROME_PATH to your Chrome binary. Prod (Vercel): @sparticuz/chromium.
  const executablePath =
    process.env.CHROME_PATH || (await chromium.executablePath());

  const browser = await puppeteer.launch({
    args: process.env.CHROME_PATH ? [] : chromium.args,
    executablePath,
    headless: true,
  });
  try {
    const page = await browser.newPage();
    await page.goto(
      `${process.env.NEXT_PUBLIC_APP_URL}/${username}/resume?print=1`,
      { waitUntil: "networkidle0", timeout: 15000 }
    );
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", bottom: "14mm", left: "15mm", right: "15mm" },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${username}-resume.pdf"`,
        // Safe to cache: the URL changes whenever the content does. A day caps how long a
        // copy can outlive an expired Pro pass.
        "Cache-Control": "public, max-age=300, s-maxage=86400",
      },
    });
  } finally {
    await browser.close();
  }
}
