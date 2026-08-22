// ============================================================
// Smart Campus ERP — Student Fees & Payments (Live Supabase + Fallback)
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import { FeesIcon, CheckIcon } from "@/components/ui/Icons";
import type { FeeRecord } from "@/types";

export default function StudentFeesPage() {
  const { studentData } = useCurrentUser();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFees() {
      if (!studentData?.id) return;
      try {
        const supabase = getSupabaseClient();
        const { data, error } = await supabase
          .from("fees")
          .select("*")
          .eq("student_id", studentData!.id)
          .order("due_date", { ascending: true });

        if (error) {
          console.warn("[StudentFees] Supabase query error, using defaults:", error.message);
        } else if (data && data.length > 0) {
          const mapped: FeeRecord[] = data.map((d: any) => ({
            id: d.id,
            label: d.label,
            total: Number(d.total),
            paid: Number(d.paid),
            dueDate: d.due_date,
            status: d.status,
          }));
          setFees(mapped);
        }
      } catch (err) {
        console.warn("[StudentFees] Exception loading fees:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadFees();
  }, [studentData?.id]);

  const totalFees = fees.reduce((s, f) => s + f.total, 0);
  const totalPaid = fees
    .filter((f) => f.status === "Paid")
    .reduce((s, f) => s + f.paid, 0);
  const totalRemaining = totalFees - totalPaid;
  const pct = totalFees > 0 ? Math.round((totalPaid / totalFees) * 100) : 100;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Fees & Tuition Payments</h1>
          <p className="page-subtitle">
            Review academic invoice history, upcoming due dates, and official receipts.
          </p>
        </div>
        <Badge variant={totalRemaining === 0 ? "green" : "amber"} dot>
          {totalRemaining === 0 ? "Account Fully Paid" : "Pending Invoices"}
        </Badge>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid-3">
        <StatCard
          label="Total Term Tuition"
          value={`$${totalFees.toLocaleString()}`}
          icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Total Cleared & Paid"
          value={`$${totalPaid.toLocaleString()}`}
          change={`${pct}% Paid`}
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
        <StatCard
          label="Outstanding Balance"
          value={`$${totalRemaining.toLocaleString()}`}
          change={totalRemaining === 0 ? "Zero Due" : "Due Soon"}
          trend={totalRemaining === 0 ? "up" : "down"}
          icon={<span className="text-base font-bold text-[#bf783e]">💳</span>}
          iconBg="bg-white/5 text-[#f4f6d6] border-white/10"
        />
      </div>

      {/* Payment Progress Card */}
      <div className="card-flat p-6 bg-[#141414] border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="font-serif text-base font-normal text-[#f4f6d6]">Term Payment Progress</span>
            <p className="text-xs text-white/50 mt-0.5 font-light">Cumulative payments toward current semester registration</p>
          </div>
          <span className="font-serif text-base font-normal text-[#bf783e]">{pct}% Complete</span>
        </div>
        <div className="progress-track h-2 bg-white/10">
          <div
            className={`progress-fill ${
              pct === 100 ? "progress-fill-green" : "progress-fill-brand"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs font-medium">
          <span className="text-emerald-400">${totalPaid.toLocaleString()} verified paid</span>
          <span className={totalRemaining > 0 ? "text-amber-400" : "text-emerald-400"}>
            ${totalRemaining.toLocaleString()} remaining balance
          </span>
        </div>
      </div>

      {/* Fee Invoices Table */}
      <div className="table-wrapper">
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex items-center justify-between">
          <h2 className="section-heading mb-0">Invoice & Transaction Breakdown</h2>
          <Badge variant="blue">{fees.length} Invoices</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Fee Description</th>
                <th className="hidden sm:table-cell">Due Date</th>
                <th>Total Billed</th>
                <th className="hidden md:table-cell">Amount Paid</th>
                <th>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => (
                <tr key={f.id}>
                  <td className="font-bold text-[#f4f6d6] text-sm">{f.label}</td>
                  <td className="hidden sm:table-cell text-xs font-semibold text-white/50">
                    {f.dueDate}
                  </td>
                  <td className="font-serif text-base font-normal text-[#f4f6d6]">
                    ${f.total.toLocaleString()}
                  </td>
                  <td className="hidden md:table-cell text-xs font-bold text-white/70">
                    ${f.paid.toLocaleString()}
                  </td>
                  <td>
                    <Badge
                      variant={
                        f.status === "Paid"
                          ? "green"
                          : f.status === "Pending"
                          ? "amber"
                          : "red"
                      }
                      dot
                    >
                      {f.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
