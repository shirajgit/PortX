import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { db } from "@/lib/db";
import { createHash } from "crypto";
import { isPro } from "@/lib/billing";
import { getPortfolioData } from "@/lib/data";
import { recordEvent } from "@/lib/track";

export const maxDuration = 30;

// Bump when the PDF layout changes (not the data), so cached copies are re-rendered.
const PDF_LAYOUT = 2;

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

  // forResume: the phone is printed, so it must change the version hash too.
  const portfolio = await getPortfolioData(username, { forResume: true });
  if (!portfolio) return Response.json({ error: "not_found" }, { status: 404 });
  const version = createHash("sha256")
    .update(JSON.stringify([PDF_LAYOUT, portfolio.template, portfolio.data]))
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
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | undefined;
  try {
    const executablePath =
      process.env.CHROME_PATH || (await chromium.executablePath());
    browser = await puppeteer.launch({
      args: process.env.CHROME_PATH ? [] : chromium.args,
      executablePath,
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(
      `${process.env.NEXT_PUBLIC_APP_URL || url.origin}/${username}/resume?print=1`,
      { waitUntil: "networkidle0", timeout: 15000 }
    );
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      tagged: true, // accessible + structured text: helps ATS parsers keep reading order
      // Branding sits in the bottom page margin (every page), apart from the resume content.
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `<div style="width:100%;text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:8px;color:#888;">Built with <a href="https://portxz.xyz" style="color:#888;text-decoration:none;">Portxz</a></div>`,
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
  } catch (err) {
    // Shows up in the Vercel function logs with the real cause (missing Chrome, bad URL…).
    console.error("[pdf] render failed", { username, err });
    return Response.json({ error: "pdf_failed" }, { status: 500 });
  } finally {
    await browser?.close();
  }
}
