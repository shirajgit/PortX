import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import { db } from "@/lib/db";
import { isPro } from "@/lib/billing";

export const maxDuration = 30;

export async function GET(req: Request) {
  const username = new URL(req.url).searchParams.get("username")?.toLowerCase() ?? "";
  const profile = await db.profile.findUnique({
    where: { username },
    select: { id: true, isPublished: true, plan: true, planExpiresAt: true },
  });
  if (!profile?.isPublished)
    return Response.json({ error: "not_found" }, { status: 404 });
  if (!isPro(profile))
    return Response.json({ error: "pro_required" }, { status: 403 });

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

    await db.pageView.create({
      data: { profileId: profile.id, kind: "pdf_download", ref: null },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${username}-resume.pdf"`,
        "Cache-Control": "public, max-age=300",
      },
    });
  } finally {
    await browser.close();
  }
}
