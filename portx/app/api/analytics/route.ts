import { db } from "@/lib/db";
import { requireProfile, handleAuthError } from "@/lib/auth";

/* Analytics for the dashboard + mobile app.
   Reads page_views for the signed-in profile. kind: "view" | "pdf_download". */

export async function GET() {
  try {
    const profile = await requireProfile();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Start of the oldest day in the 7-day chart (UTC midnight, 6 days back).
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    start.setUTCDate(start.getUTCDate() - 6);

    const [views, downloads, viewsThisWeek, downloadsThisWeek, daily] =
      await Promise.all([
        db.pageView.count({ where: { profileId: profile.id, kind: "view" } }),
        db.pageView.count({ where: { profileId: profile.id, kind: "pdf_download" } }),
        db.pageView.count({
          where: { profileId: profile.id, kind: "view", createdAt: { gte: weekAgo } },
        }),
        db.pageView.count({
          where: { profileId: profile.id, kind: "pdf_download", createdAt: { gte: weekAgo } },
        }),
        // counted in the database, so busy pages aren't capped by a row limit
        db.$queryRaw<{ day: string; n: bigint }[]>`
          SELECT to_char(created_at, 'YYYY-MM-DD') AS day, count(*) AS n
          FROM page_views
          WHERE profile_id = ${profile.id}::uuid AND kind = 'view' AND created_at >= ${start}
          GROUP BY 1`,
      ]);

    // last 7 days as a tiny daily series for the sparkline
    const byDay = new Map(daily.map((r) => [r.day, Number(r.n)])); // created_at is stored in UTC
    const days: { day: string; views: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setUTCDate(start.getUTCDate() + i);
      days.push({
        day: d.toLocaleDateString("en", { weekday: "short", timeZone: "UTC" }),
        views: byDay.get(d.toISOString().slice(0, 10)) ?? 0,
      });
    }

    return Response.json({ views, downloads, viewsThisWeek, downloadsThisWeek, days });
  } catch (e) {
    return handleAuthError(e);
  }
}
