import Link from "next/link";
import { ArrowRight, ClipboardCheck, CreditCard, Crown, Globe, Rocket, Users } from "lucide-react";
import { db } from "@/lib/db";
import { LAUNCH_HOLD_MS, LAUNCH_OFFER_LIMIT, PASSES, type PassId } from "@/lib/plans";
import { ago, dayKey, lastDays, money, num } from "@/lib/format";
import { Badge, Card, Empty, PageHeader, STATUS_LABEL, STATUS_TONE, Stat } from "@/components/ui";
import { DailyChart, Legend, type Series } from "@/components/Charts";

export const metadata = { title: "Overview" };

const DAY = 86400000;
const SIGNUP_SERIES: Series[] = [{ key: "signups", label: "Signups", color: "#4F8BFF" }];

export default async function Overview() {
  const now = new Date();
  const since30 = new Date(now.getTime() - 30 * DAY);
  const since7 = new Date(now.getTime() - 7 * DAY);

  const [users, new7, new30, published, pro, pending, revenue, revenue30, launchTaken, signups, recentUsers, recentPayments] = await Promise.all([
    db.profile.count(),
    db.profile.count({ where: { createdAt: { gte: since7 } } }),
    db.profile.count({ where: { createdAt: { gte: since30 } } }),
    db.profile.count({ where: { isPublished: true } }),
    db.profile.count({ where: { plan: "pro", planExpiresAt: { gt: now } } }),
    db.paymentRequest.count({ where: { status: "pending" } }),
    db.paymentRequest.groupBy({ by: ["currency"], where: { status: "approved" }, _sum: { amount: true }, _count: { _all: true } }),
    db.paymentRequest.groupBy({ by: ["currency"], where: { status: "approved", createdAt: { gte: since30 } }, _sum: { amount: true } }),
    // Same count as the main app's launchSlotsLeft: paid passes plus checkouts still holding a slot.
    db.paymentRequest.count({
      where: { plan: "launch", OR: [{ status: "approved" }, { status: "created", createdAt: { gt: new Date(now.getTime() - LAUNCH_HOLD_MS) } }] },
    }),
    db.profile.findMany({ where: { createdAt: { gte: since30 } }, select: { createdAt: true } }),
    db.profile.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, username: true, fullName: true, createdAt: true, isPublished: true } }),
    db.paymentRequest.findMany({
      where: { status: { not: "created" } }, orderBy: { createdAt: "desc" }, take: 6,
      select: { id: true, plan: true, amount: true, currency: true, status: true, createdAt: true, profile: { select: { id: true, username: true } } },
    }),
  ]);

  const perDay = new Map<string, number>();
  for (const s of signups) perDay.set(dayKey(s.createdAt), (perDay.get(dayKey(s.createdAt)) ?? 0) + 1);
  const chart = lastDays(30).map((day) => ({ day, signups: perDay.get(day) ?? 0 }));

  const sum = (rows: { currency: string; _sum: { amount: unknown } }[]) =>
    rows.length ? rows.map((r) => money(Number(r._sum.amount ?? 0), r.currency)).join(" · ") : money(0, "INR");
  const paidCount = revenue.reduce((n, r) => n + r._count._all, 0);
  const slotsLeft = Math.max(0, LAUNCH_OFFER_LIMIT - launchTaken);

  return (
    <>
      <PageHeader title="Overview" sub="How Portxz is doing right now." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total users" value={num(users)} hint={`+${num(new7)} this week · +${num(new30)} in 30 days`} icon={Users} />
        <Stat label="Published pages" value={num(published)} hint={users ? `${Math.round((published / users) * 100)}% of users` : undefined} icon={Globe} tone="green" />
        <Stat label="Active Pro" value={num(pro)} hint={users ? `${((pro / users) * 100).toFixed(1)}% of users` : undefined} icon={Crown} />
        <Stat label="Launch offer slots left" value={`${slotsLeft} / ${LAUNCH_OFFER_LIMIT}`} hint={`${launchTaken} taken or held`} icon={Rocket} tone={slotsLeft < 10 ? "warning" : "accent"} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat label="Revenue, all time" value={<span className="text-xl">{sum(revenue)}</span>} hint={`${num(paidCount)} paid passes`} icon={CreditCard} tone="green" />
        <Stat label="Revenue, last 30 days" value={<span className="text-xl">{sum(revenue30)}</span>} icon={CreditCard} tone="green" />
        <Stat label="Payments to review" value={num(pending)} hint={pending ? <Link href="/payments?status=pending" className="text-warning hover:underline">Review now →</Link> : "All caught up"} icon={ClipboardCheck} tone={pending ? "warning" : "green"} />
      </div>

      <Card title="Signups, last 30 days" action={<Legend series={SIGNUP_SERIES} />} className="mt-4">
        <div className="p-4"><DailyChart data={chart} series={SIGNUP_SERIES} /></div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="Newest users" action={<Link href="/users" className="inline-flex items-center gap-1 text-xs text-muted hover:text-text">All users <ArrowRight className="h-3 w-3" /></Link>}>
          {recentUsers.length === 0 ? <Empty>No users yet.</Empty> : (
            <ul className="divide-y divide-border">
              {recentUsers.map((u) => (
                <li key={u.id}>
                  <Link href={`/users/${u.id}`} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-surface-2/50">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{u.fullName}</span>
                      <span className="block truncate text-xs text-muted">@{u.username}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      {u.isPublished && <Badge tone="green">Live</Badge>}
                      <span className="text-xs text-subtle">{ago(u.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest payments" action={<Link href="/payments" className="inline-flex items-center gap-1 text-xs text-muted hover:text-text">All payments <ArrowRight className="h-3 w-3" /></Link>}>
          {recentPayments.length === 0 ? <Empty>No payments yet.</Empty> : (
            <ul className="divide-y divide-border">
              {recentPayments.map((p) => (
                <li key={p.id}>
                  <Link href={`/users/${p.profile.id}`} className="flex items-center justify-between gap-3 px-5 py-3 text-sm hover:bg-surface-2/50">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{money(Number(p.amount), p.currency)} · {PASSES[p.plan as PassId]?.label ?? p.plan}</span>
                      <span className="block truncate text-xs text-muted">@{p.profile.username}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <Badge tone={STATUS_TONE[p.status] ?? "muted"}>{STATUS_LABEL[p.status] ?? p.status}</Badge>
                      <span className="text-xs text-subtle">{ago(p.createdAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
