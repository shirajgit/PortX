import { createHmac } from "crypto";
import { db } from "./db";

/* ── Analytics event recording with dedupe + abuse limits ─────────────
   Visitors are identified by an HMAC of IP + user agent + the UTC date,
   so the id rotates daily and the raw IP is never stored.              */

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python|axios|node-fetch/i;

/** Same visitor viewing the same page within this window counts once. */
const VIEW_WINDOW_MS = 30 * 60 * 1000;
/** Same visitor clicking the same link within this window counts once. */
const CLICK_WINDOW_MS = 60 * 1000;
/** Hard cap on events per visitor across all pages. */
const BURST_WINDOW_MS = 10 * 60 * 1000;
const BURST_MAX = 60;

const KEY = process.env.TRACK_SALT || process.env.CLERK_SECRET_KEY || "portxz-track";

export function visitorId(req: Request): string | null {
  const ua = req.headers.get("user-agent") ?? "";
  if (!ua || BOT_UA.test(ua)) return null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const day = new Date().toISOString().slice(0, 10);
  return createHmac("sha256", KEY).update(`${day}|${ip}|${ua}`).digest("hex").slice(0, 32);
}

export type TrackKind = "view" | "pdf_download" | "link_click";

/** Records one event unless it's a bot, a repeat, or part of a burst. Returns whether it was stored. */
export async function recordEvent(
  req: Request,
  profileId: string,
  kind: TrackKind,
  ref: string | null = null
): Promise<boolean> {
  const visitor = visitorId(req);
  if (!visitor) return false;
  const now = Date.now();

  const burst = await db.pageView.count({
    where: { visitor, createdAt: { gte: new Date(now - BURST_WINDOW_MS) } },
  });
  if (burst >= BURST_MAX) return false;

  const window = kind === "link_click" ? CLICK_WINDOW_MS : VIEW_WINDOW_MS;
  const repeat = await db.pageView.findFirst({
    where: {
      visitor,
      profileId,
      kind,
      ...(kind === "link_click" ? { ref } : {}),
      createdAt: { gte: new Date(now - window) },
    },
    select: { id: true },
  });
  if (repeat) return false;

  await db.pageView.create({ data: { profileId, kind, ref, visitor } });
  return true;
}

/** Records a visit to one of the site's own pages, with the same bot, repeat and burst rules. */
export async function recordSiteView(req: Request, path: string, ref: string | null = null): Promise<boolean> {
  const visitor = visitorId(req);
  if (!visitor) return false;
  const now = Date.now();

  const [burst, repeat] = await Promise.all([
    db.siteView.count({ where: { visitor, createdAt: { gte: new Date(now - BURST_WINDOW_MS) } } }),
    db.siteView.findFirst({
      where: { visitor, path, createdAt: { gte: new Date(now - VIEW_WINDOW_MS) } },
      select: { id: true },
    }),
  ]);
  if (burst >= BURST_MAX || repeat) return false;

  await db.siteView.create({ data: { path, ref, visitor } });
  return true;
}
