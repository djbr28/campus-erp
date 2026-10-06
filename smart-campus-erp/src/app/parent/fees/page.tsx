// ============================================================
// Smart Campus ERP — Parent → Student Fees (Live Supabase)
//
// Backed by public.fees for the connected student only. Totals are
// summed from real invoice rows; when the student has none, the page
// says so rather than showing a fabricated balance.
// ============================================================
"use client";

import RoleGuard from "@/components/layout/RoleGuard";
import ChildGate from "@/components/parent/ChildGate";
import { useParentChild } from "@/hooks/useParentChild";
import StatCard from "@/components/ui/StatCard";
import Badge, { type BadgeVariant } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { FeesIcon, CheckIcon } from "@/components/ui/Icons";

const statusVariants: Record<string, BadgeVariant> = {
  Paid: "green",
  Pending: "amber",
  Overdue: "red",
};

function money(amount: number) {
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function ParentFeesPage() {
  const { linked, student, fees, summary, loading, error, reload } = useParentChild();

  const f = summary?.fees;
  const hasRecords = Boolean(f?.hasRecords);

  return (
    <RoleGuard allow={["PARENT"]} fallbackHref="/parent">
      <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="page-title">Fees & Payments</h1>
            <p className="page-subtitle">
              {student
                ? `Invoice history and outstanding balance for ${student.name}.`
                : "Invoice history and outstanding balance for your child."}
            </p>
          </div>
          {hasRecords && (
            <Badge variant={f!.outstanding === 0 ? "green" : "amber"} dot>
              {f!.outstanding === 0 ? "Account Fully Paid" : "Payment Outstanding"}
            </Badge>
          )}
        </div>

        <ChildGate
          loading={loading}
          error={error}
          linked={linked}
          loadingMessage="Loading fee records…"
          onRetry={reload}
        >
          {!hasRecords ? (
            <div className="card-flat bg-[#141414] border border-white/10">
              <EmptyState
                icon={<FeesIcon className="w-6 h-6 text-white/40" />}
                title="No fee records for this student"
                description="The finance office has not raised any invoices against your child yet. Tuition, hostel and examination charges will appear here once they are issued."
              />
            </div>
          ) : (
            <>
              {/* KPI cards */}
              <div className="grid-3">
                <StatCard
                  label="Total Invoiced"
                  value={money(f!.total)}
                  icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
                />
                <StatCard
                  label="Total Paid"
                  value={money(f!.paid)}
                  change={f!.paidPct != null ? `${f!.paidPct}% cleared` : undefined}
                  trend="up"
                  icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
                />
                <StatCard
                  label="Outstanding Balance"
                  value={money(f!.outstanding)}
                  change={f!.outstanding === 0 ? "Nothing due" : `${f!.pendingCount + f!.overdueCount} unpaid`}
                  trend={f!.outstanding === 0 ? "up" : "down"}
                  icon={<span className="text-base font-bold text-[#bf783e]">💳</span>}
                />
              </div>

              {/* Payment progress */}
              <div className="card-flat p-6 bg-[#141414] border border-white/10">
                <div className="flex items-center justify-between mb-3 gap-4">
                  <div>
                    <span className="font-serif text-base font-normal text-[#f4f6d6]">
                      Payment Progress
                    </span>
                    <p className="text-xs text-white/50 mt-0.5 font-light">
                      {f!.nextDue
                        ? `Next due: ${f!.nextDue.label}${
                            f!.nextDue.dueDate ? ` — ${f!.nextDue.dueDate}` : ""
                          } (${money(f!.nextDue.amount)})`
                        : "All issued invoices have been settled."}
                    </p>
                  </div>
                  <span className="font-serif text-base font-normal text-[#bf783e] shrink-0">
                    {f!.paidPct ?? 0}%
                  </span>
                </div>
                <div className="progress-track h-2 bg-white/10">
                  <div
                    className={`progress-fill ${
                      (f!.paidPct ?? 0) === 100 ? "progress-fill-green" : "progress-fill-brand"
                    }`}
                    style={{ width: `${Math.min(f!.paidPct ?? 0, 100)}%` }}
                  />
                </div>
                {f!.overdueCount > 0 && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-rose-950/60 text-rose-200 rounded-full text-xs font-bold border border-rose-600/40">
                    <span>
                      ⚠️ {f!.overdueCount} overdue invoice{f!.overdueCount === 1 ? "" : "s"} — please
                      contact the finance office.
                    </span>
                  </div>
                )}
              </div>

              {/* Invoice table */}
              <div className="table-wrapper">
                <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
                  <div>
                    <h2 className="section-heading mb-0">Invoice History</h2>
                    <p className="text-xs text-white/50 mt-0.5 font-light">
                      Every fee raised against your child, as recorded by the finance office
                    </p>
                  </div>
                  <Badge variant="blue">{fees.length} Invoices</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Description</th>
                        <th className="hidden md:table-cell text-right">Amount</th>
                        <th className="hidden md:table-cell text-right">Paid</th>
                        <th className="hidden sm:table-cell">Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fees.map((row) => (
                        <tr key={row.id}>
                          <td className="font-mono text-xs font-semibold text-white/50">{row.id}</td>
                          <td className="font-bold text-[#f4f6d6] text-sm">{row.label}</td>
                          <td className="hidden md:table-cell text-right font-mono text-sm text-white/80">
                            {money(row.total_amount)}
                          </td>
                          <td className="hidden md:table-cell text-right font-mono text-sm text-emerald-400">
                            {money(row.paid_amount)}
                          </td>
                          <td className="hidden sm:table-cell text-xs text-white/60 font-medium">
                            {row.due_date || "—"}
                          </td>
                          <td>
                            <Badge variant={statusVariants[row.status] || "gray"} dot>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </ChildGate>
      </div>
    </RoleGuard>
  );
}
