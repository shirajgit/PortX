import Link from "next/link";
import type { Prisma } from "@/lib/generated/prisma/client";
import { db } from "@/lib/db";
import { PASSES, type PassId } from "@/lib/plans";
import { dateTime, money, num } from "@/lib/format";
import { Badge, Card, Empty, Filters, PageHeader, Pager, STATUS_LABEL, STATUS_TONE, Table } from "@/components/ui";
import { ConfirmButton } from "@/components/ConfirmButton";
import { approvePayment, rejectPayment } from "../actions";

export const metadata = { title: "Payments" };

const PER_PAGE = 50;
type Params = { status?: string; plan?: string; currency?: string; page?: string };

export default async function PaymentsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams;
  // "created" rows are Razorpay checkouts that were opened but never paid — hidden unless asked for.
  const status = params.status ?? "all";
  const plan = params.plan ?? "all";
  const currency = params.currency ?? "all";
  const page = Math.max(1, Number(params.page) || 1);

  const where: Prisma.PaymentRequestWhereInput = {
    status: status === "all" ? { not: "created" } : status,
    ...(plan !== "all" && { plan }),
    ...(currency !== "all" && { currency }),
  };

  const [total, rows, totals] = await Promise.all([
    db.paymentRequest.count({ where }),
    db.paymentRequest.findMany({
      where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PER_PAGE, take: PER_PAGE,
      include: { profile: { select: { id: true, username: true, fullName: true } } },
    }),
    db.paymentRequest.groupBy({ by: ["currency"], where: { ...where, status: "approved" }, _sum: { amount: true }, _count: { _all: true } }),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const keep = { status, plan, currency };

  return (
    <>
      <PageHeader title="Payments" sub={`${num(total)} ${total === 1 ? "payment" : "payments"}`}>
        {totals.length > 0 && (
          <p className="text-sm text-muted">
            Paid in this view: <span className="font-medium text-green">{totals.map((t) => money(Number(t._sum.amount ?? 0), t.currency)).join(" · ")}</span>
          </p>
        )}
      </PageHeader>

      <div className="mb-4 flex flex-wrap gap-3">
        <Filters name="status" current={status} params={keep} base="/payments"
          options={[["all", "All"], ["pending", "Needs review"], ["approved", "Paid"], ["rejected", "Rejected"], ["created", "Unpaid checkouts"]]} />
        <Filters name="plan" current={plan} params={keep} base="/payments"
          options={[["all", "All passes"], ...Object.values(PASSES).map((p) => [p.id, p.label.replace("Pro — ", "")] as [string, string])]} />
        <Filters name="currency" current={currency} params={keep} base="/payments"
          options={[["all", "All currencies"], ["INR", "INR"], ["USD", "USD"], ["EUR", "EUR"], ["GBP", "GBP"]]} />
      </div>

      <Card>
        {rows.length === 0 ? <Empty>No payments match these filters.</Empty> : (
          <Table head={["Date", "User", "Pass", "Amount", "Status", "Reference", ""]}>
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-surface-2/40">
                <td className="whitespace-nowrap px-5 py-3 text-xs text-muted">{dateTime(p.createdAt)}</td>
                <td className="px-5 py-3">
                  <Link href={`/users/${p.profile.id}`} className="block hover:text-accent">
                    <span className="block max-w-[200px] truncate font-medium">{p.profile.fullName}</span>
                    <span className="block max-w-[200px] truncate text-xs text-muted">@{p.profile.username}</span>
                  </Link>
                </td>
                <td className="whitespace-nowrap px-5 py-3">{PASSES[p.plan as PassId]?.label ?? p.plan}</td>
                <td className="whitespace-nowrap px-5 py-3">{money(Number(p.amount), p.currency)}</td>
                <td className="px-5 py-3"><Badge tone={STATUS_TONE[p.status] ?? "muted"}>{STATUS_LABEL[p.status] ?? p.status}</Badge></td>
                <td className="max-w-[180px] truncate px-5 py-3 font-mono text-xs text-muted" title={p.orderId ?? undefined}>{p.utr || p.orderId || "—"}</td>
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
        <Pager page={page} pages={pages} params={keep} base="/payments" />
      </Card>
    </>
  );
}
