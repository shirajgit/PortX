import Link from "next/link";
import { Globe, Layers, Mail, Users } from "lucide-react";
import { db } from "@/lib/db";
import { SITE_URL, ago, daysAgo, lastDays, num } from "@/lib/format";
import { Card, Empty, PageHeader, Stat } from "@/components/ui";
import { DailyChart, Legend, type Series } from "@/components/Charts";
import { CopyButton } from "@/components/CopyButton";

export const metadata = { title: "Traffic & waitlist" };

const SERIES: Series[] = [
  { key: "site", label: "portxz.xyz views", color: "#4F8BFF" },
  { key: "view", label: "Portfolio views", color: "#A16BFF" },
  { key: "pdf_download", label: "Resume downloads", color: "#34D399" },
  { key: "link_click", label: "Link clicks", color: "#F5A524" },
];
const SITE_HOST = SITE_URL.replace(/^https?:\/\//, "");

/** Ranked list with a proportional bar under each row. */
function Ranked({ rows, empty }: { rows: { key: string; label: React.ReactNode; n: number }[]; empty: string }) {
  if (rows.length === 0) return <Empty>{empty}</Empty>;
  const max = rows[0].n || 1;
  return (
    <ul className="space-y-3 p-5">
      {rows.map((r) => (
        <li key={r.key}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate">{r.label}</span>
            <span className="shrink-0 tabular-nums text-muted">{num(r.n)}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full rounded-full bg-accent" style={{ width: `${(r.n / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function TrafficPage() {
  const since = daysAgo(30);

  const [siteDaily, daily, visitors, signups, accounts, pages, top, refs, waitCount, waitlist] = await Promise.all([
    // Bucketed by India date in SQL so a month of events never has to leave the database.
    db.$queryRaw<{ day: string; n: number }[]>`
      SELECT to_char((created_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, count(*)::int AS n
      FROM site_views WHERE created_at >= ${since}
      GROUP BY 1`,
    db.$queryRaw<{ day: string; kind: string; n: number }[]>`
      SELECT to_char((created_at AT TIME ZONE 'UTC') AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS day, kind, count(*)::int AS n
      FROM page_views WHERE created_at >= ${since}
      GROUP BY 1, 2`,
    // The visitor hash rotates daily, so this counts each person once per day they visited.
    db.$queryRaw<{ n: number }[]>`
      SELECT count(DISTINCT visitor)::int AS n FROM (
        SELECT visitor FROM site_views WHERE created_at >= ${since}
        UNION ALL
        SELECT visitor FROM page_views WHERE created_at >= ${since} AND visitor IS NOT NULL
      ) v`,
    db.profile.count({ where: { createdAt: { gte: since } } }),
    db.profile.count(),
    db.siteView.groupBy({
      by: ["path"], where: { createdAt: { gte: since } },
      _count: { path: true }, orderBy: { _count: { path: "desc" } }, take: 10,
    }),
    db.pageView.groupBy({
      by: ["profileId"], where: { kind: "view", createdAt: { gte: since } },
      _count: { profileId: true }, orderBy: { _count: { profileId: "desc" } }, take: 10,
    }),
    db.$queryRaw<{ ref: string; n: number }[]>`
      SELECT ref, count(*)::int AS n FROM (
        SELECT ref FROM site_views WHERE created_at >= ${since} AND ref IS NOT NULL
        UNION ALL
        SELECT ref FROM page_views WHERE created_at >= ${since} AND kind = 'view' AND ref IS NOT NULL
      ) r
      GROUP BY ref ORDER BY n DESC LIMIT 10`,
    db.waitlist.count(),
    db.waitlist.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
  ]);

  const byDay = new Map<string, Record<string, number>>();
  for (const r of daily) byDay.set(r.day, { ...byDay.get(r.day), [r.kind]: r.n });
  for (const r of siteDaily) byDay.set(r.day, { ...byDay.get(r.day), site: r.n });
  const chart = lastDays(30).map((day) => ({ day, site: 0, view: 0, pdf_download: 0, link_click: 0, ...byDay.get(day) }));
  const total = (k: string) => chart.reduce((n, d) => n + ((d as Record<string, number | string>)[k] as number), 0);
  const siteViews = total("site");
  const portfolioViews = total("view");

  const profiles = await db.profile.findMany({
    where: { id: { in: top.map((t) => t.profileId) } },
    select: { id: true, username: true, fullName: true },
  });
  const nameOf = new Map(profiles.map((p) => [p.id, p]));

  return (
    <>
      <PageHeader title="Traffic & waitlist" sub={`Visits to ${SITE_HOST} and the portfolios on it, last 30 days.`} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label={`${SITE_HOST} views`} value={num(siteViews)} icon={Globe}
          hint="Landing, help, pricing, dashboard and other site pages" />
        <Stat label="Total impressions" value={num(siteViews + portfolioViews)} icon={Layers}
          hint={`${num(siteViews)} site + ${num(portfolioViews)} portfolio views`} />
        <Stat label="Users" value={num(visitors[0]?.n ?? 0)} icon={Users} tone="green"
          hint={`Unique daily visitors · ${num(signups)} new sign-ups · ${num(accounts)} accounts`} />
      </div>

      <Card title="Daily activity" action={<Legend series={SERIES} />} className="mt-4">
        <div className="p-4"><DailyChart data={chart} series={SERIES} height={260} /></div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card title={`Top pages on ${SITE_HOST}`}>
          <Ranked empty="No site views in the last 30 days."
            rows={pages.map((p) => ({ key: p.path, label: <span className="font-mono text-xs">{p.path}</span>, n: p._count.path }))} />
        </Card>

        <Card title="Most viewed portfolios">
          <Ranked empty="No portfolio views in the last 30 days."
            rows={top.map((t) => {
              const p = nameOf.get(t.profileId);
              return {
                key: t.profileId, n: t._count.profileId,
                label: (
                  <Link href={`/users/${t.profileId}`} className="hover:text-accent">
                    {p ? <>{p.fullName} <span className="text-muted">@{p.username}</span></> : "Deleted user"}
                  </Link>
                ),
              };
            })} />
        </Card>

        <Card title="Top referrers">
          {refs.length === 0 ? <Empty>No referrer data in the last 30 days.</Empty> : (
            <ul className="divide-y divide-border">
              {refs.map((r) => (
                <li key={r.ref} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                  <span className="min-w-0 truncate">{r.ref}</span>
                  <span className="shrink-0 tabular-nums text-muted">{num(r.n)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title={`Waitlist · ${num(waitCount)}`} className="mt-4"
        action={waitlist.length > 0 && <CopyButton text={waitlist.map((w) => w.email).join("\n")} label={waitCount > waitlist.length ? `Copy latest ${waitlist.length}` : "Copy all emails"} />}>
        {waitlist.length === 0 ? <Empty>Nobody on the waitlist yet.</Empty> : (
          <ul className="grid divide-y divide-border sm:grid-cols-2 sm:divide-y-0">
            {waitlist.map((w) => (
              <li key={w.id} className="flex items-center justify-between gap-3 border-border px-5 py-2.5 text-sm sm:border-b">
                <a href={`mailto:${w.email}`} className="inline-flex min-w-0 items-center gap-2 hover:text-accent">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-subtle" /><span className="truncate">{w.email}</span>
                </a>
                <span className="shrink-0 text-xs text-subtle">{ago(w.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <p className="mt-6 text-xs text-subtle">Bots and quick repeats are filtered out. {SITE_HOST} page views are counted from 22 Oct 2026 onward; portfolio views go back further.</p>
    </>
  );
}
