import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, ExternalLink, Eye, MousePointerClick } from "lucide-react";
import { db } from "@/lib/db";
import { PASSES, isPro, type PassId } from "@/lib/plans";
import { SITE_URL, date, dateTime, daysAgo, money, num } from "@/lib/format";
import { Badge, Card, Empty, STATUS_LABEL, STATUS_TONE, Stat, Table } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { approvePayment, endPro, grantPro, rejectPayment, setPublished } from "../../actions";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return { title: "User" };
  const p = await db.profile.findUnique({ where: { id }, select: { username: true } });
  return { title: p ? `@${p.username}` : "User" };
}

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const since30 = daysAgo(30);
  const [user, views, views30, downloads, clicks] = await Promise.all([
    db.profile.findUnique({
      where: { id },
      include: {
        _count: { select: { projects: true, experiences: true, educations: true, skills: true, links: true, customSections: true } },
        paymentRequests: { orderBy: { createdAt: "desc" } },
      },
    }),
    db.pageView.count({ where: { profileId: id, kind: "view" } }),
    db.pageView.count({ where: { profileId: id, kind: "view", createdAt: { gte: since30 } } }),
    db.pageView.count({ where: { profileId: id, kind: "pdf_download" } }),
    db.pageView.count({ where: { profileId: id, kind: "link_click" } }),
  ]);
  if (!user) notFound();

  const pro = isPro(user);
  const c = user._count;
  const details: [string, React.ReactNode][] = [
    ["Email", user.email ?? "—"],
    ["Phone", user.phone ?? "—"],
    ["Location", user.location ?? "—"],
    ["Template", <span key="t" className="capitalize">{user.template}</span>],
    ["Joined", date(user.createdAt)],
    ["Last updated", dateTime(user.updatedAt)],
    ["Setup step", user.onboardingStep >= 8 ? "Finished" : `Step ${user.onboardingStep} of 8`],
    ["Clerk ID", <span key="c" className="font-mono text-xs">{user.clerkId}</span>],
  ];

  return (
    <>
      <Link href="/users" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Users
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold tracking-tight">{user.fullName}</h1>
          <p className="mt-1 truncate text-sm text-muted">@{user.username}{user.headline ? ` · ${user.headline}` : ""}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {pro ? <Badge tone="accent">Pro until {date(user.planExpiresAt!)}</Badge> : <Badge tone="muted">Free plan</Badge>}
            {user.isPublished ? <Badge tone="green">Page live</Badge> : <Badge tone="muted">Not published</Badge>}
          </div>
        </div>
        {user.isPublished && (
          <a href={`${SITE_URL}/${user.username}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-2 text-sm hover:bg-surface-2">
            View page <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Stat label="Page views" value={num(views)} hint={`${num(views30)} in the last 30 days`} icon={Eye} />
        <Stat label="Resume downloads" value={num(downloads)} icon={Download} tone="green" />
        <Stat label="Link clicks" value={num(clicks)} icon={MousePointerClick} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card title="Details">
          <dl className="divide-y divide-border text-sm">
            {details.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-2.5">
                <dt className="text-muted">{k}</dt>
                <dd className="min-w-0 truncate text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="border-t border-border px-5 py-3 text-xs text-muted">
            {c.projects} projects · {c.experiences} jobs · {c.educations} education · {c.skills} skill groups · {c.links} links · {c.customSections} extra sections
          </p>
        </Card>

        <div className="space-y-4">
          <Card title="Pro access">
            <div className="space-y-4 p-5">
              <p className="text-sm text-muted">
                {pro ? <>Pro until <span className="text-text">{date(user.planExpiresAt!)}</span>. Granting more adds to the time left.</>
                  : "On the free plan. Granting Pro starts today."}
              </p>
              <div className="flex flex-wrap gap-2">
                {[[7, "7 days"], [30, "1 month"], [180, "6 months"], [365, "1 year"]].map(([days, label]) => (
                  <ConfirmButton key={days} label={`+ ${label}`} confirm={`Give ${label}?`} action={grantPro.bind(null, user.id, days as number)} />
                ))}
              </div>
              {pro && <ConfirmButton label="End Pro now" confirm="Really end Pro?" tone="danger" action={endPro.bind(null, user.id)} />}
            </div>
          </Card>

          <Card title="Public page">
            <div className="flex flex-wrap items-center justify-between gap-3 p-5">
              <p className="text-sm text-muted">{user.isPublished ? "Visible to everyone." : "Hidden from the public."}</p>
              {user.isPublished
                ? <ConfirmButton label="Unpublish" confirm="Hide this page?" tone="danger" action={setPublished.bind(null, user.id, false)} />
                : <ConfirmButton label="Publish" confirm="Make it public?" action={setPublished.bind(null, user.id, true)} />}
            </div>
          </Card>
        </div>
      </div>

      <Card title="Payments" className="mt-4">
        {user.paymentRequests.length === 0 ? <Empty>No payments from this user.</Empty> : (
          <Table head={["Date", "Pass", "Amount", "Status", "Reference", ""]}>
            {user.paymentRequests.map((p) => (
              <tr key={p.id}>
                <td className="whitespace-nowrap px-5 py-3 text-xs text-muted">{dateTime(p.createdAt)}</td>
                <td className="px-5 py-3">{PASSES[p.plan as PassId]?.label ?? p.plan}</td>
                <td className="whitespace-nowrap px-5 py-3">{money(Number(p.amount), p.currency)}</td>
                <td className="px-5 py-3"><Badge tone={STATUS_TONE[p.status] ?? "muted"}>{STATUS_LABEL[p.status] ?? p.status}</Badge></td>
                <td className="max-w-[180px] truncate px-5 py-3 font-mono text-xs text-muted">{p.utr || p.orderId || "—"}</td>
                <td className="px-5 py-3">
                  {p.status === "pending" && (
                    <span className="flex gap-2">
                      <ConfirmButton label="Approve" tone="primary" action={approvePayment.bind(null, p.id)} />
                      <ConfirmButton label="Reject" tone="danger" action={rejectPayment.bind(null, p.id)} />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Card>
    </>
  );
}
