import Link from "next/link";
import { Search } from "lucide-react";
import type { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import { isPro } from "@/lib/plans";
import { date, num } from "@/lib/format";
import { Badge, Card, Empty, Filters, PageHeader, Pager, Table } from "@/components/ui";

export const metadata = { title: "Users" };

const PER_PAGE = 50;
type Params = { q?: string; plan?: string; status?: string; page?: string };

export default async function UsersPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const plan = params.plan ?? "all";
  const status = params.status ?? "all";
  const page = Math.max(1, Number(params.page) || 1);
  const now = new Date();

  const and: Prisma.ProfileWhereInput[] = [];
  if (q) and.push({ OR: [
    { username: { contains: q, mode: "insensitive" } },
    { fullName: { contains: q, mode: "insensitive" } },
    { email: { contains: q, mode: "insensitive" } },
  ] });
  if (plan === "pro") and.push({ plan: "pro", planExpiresAt: { gt: now } });
  if (plan === "free") and.push({ OR: [{ plan: { not: "pro" } }, { planExpiresAt: null }, { planExpiresAt: { lte: now } }] });
  if (status === "live") and.push({ isPublished: true });
  if (status === "draft") and.push({ isPublished: false });
  const where: Prisma.ProfileWhereInput = and.length ? { AND: and } : {};

  const [total, users] = await Promise.all([
    db.profile.count({ where }),
    db.profile.findMany({
      where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE,
      select: {
        id: true, username: true, fullName: true, email: true, template: true, isPublished: true,
        plan: true, planExpiresAt: true, createdAt: true,
        _count: { select: { projects: true, experiences: true } },
      },
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const keep = { q: q || undefined, plan, status };

  return (
    <>
      <PageHeader title="Users" sub={`${num(total)} ${total === 1 ? "user" : "users"}${q ? ` matching “${q}”` : ""}`} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <form className="relative min-w-[240px] flex-1" action="/users">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input name="q" defaultValue={q} placeholder="Search name, username or email"
            className="w-full rounded-xl border border-border bg-surface py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-subtle focus:border-accent" />
          {plan !== "all" && <input type="hidden" name="plan" value={plan} />}
          {status !== "all" && <input type="hidden" name="status" value={status} />}
        </form>
        <Filters name="plan" current={plan} params={keep} base="/users" options={[["all", "All plans"], ["pro", "Pro"], ["free", "Free"]]} />
        <Filters name="status" current={status} params={keep} base="/users" options={[["all", "Any status"], ["live", "Live"], ["draft", "Not published"]]} />
      </div>

      <Card>
        {users.length === 0 ? <Empty>No users match these filters.</Empty> : (
          <Table head={["User", "Plan", "Page", "Template", "Content", "Joined"]}>
            {users.map((u) => {
              const pro = isPro(u);
              return (
                <tr key={u.id} className="hover:bg-surface-2/40">
                  <td className="px-5 py-3">
                    <Link href={`/users/${u.id}`} className="block min-w-0 hover:text-accent">
                      <span className="block max-w-[260px] truncate font-medium">{u.fullName}</span>
                      <span className="block max-w-[260px] truncate text-xs text-muted">@{u.username}{u.email ? ` · ${u.email}` : ""}</span>
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    {pro ? <Badge tone="accent">Pro · to {date(u.planExpiresAt!)}</Badge> : <Badge tone="muted">Free</Badge>}
                  </td>
                  <td className="px-5 py-3">{u.isPublished ? <Badge tone="green">Live</Badge> : <Badge tone="muted">Draft</Badge>}</td>
                  <td className="px-5 py-3 capitalize text-muted">{u.template}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-muted">{u._count.projects} projects · {u._count.experiences} jobs</td>
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-muted">{date(u.createdAt)}</td>
                </tr>
              );
            })}
          </Table>
        )}
        <Pager page={page} pages={pages} params={keep} base="/users" />
      </Card>
    </>
  );
}
