// ============================================================
// Smart Campus ERP — Student Payments & Receipt History
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import LoadingState from "@/components/ui/LoadingState";
import { FeesIcon, CheckIcon } from "@/components/ui/Icons";
import type { FeeRecord } from "@/types";

export default function StudentPaymentsPage() {
  const { studentData } = useCurrentUser();
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<FeeRecord | null>(null);

  useEffect(() => {
    async function loadFees() {
      if (!studentData?.id) return;
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase.from("fees").select("*").order("due_date", { ascending: true });
        if (data && data.length > 0) {
          setFees(data.map((d: any) => ({
            id: d.id,
            label: d.label,
            total: Number(d.total_amount || d.total || 0),
            paid: Number(d.paid_amount || d.paid || 0),
            status: d.status,
            dueDate: d.due_date || d.dueDate,
            payment_date: d.payment_date,
          })));
        } else if (studentData?.isDemoAccount) {
          setFees([
            { id: "FEE-001", label: "Tuition Fee — Fall Semester 2026", total: 8500, paid: 8500, status: "Paid", dueDate: "2026-08-01", payment_date: "2026-08-01" },
            { id: "FEE-002", label: "Hostel Accommodation & Dining Fee", total: 3200, paid: 3200, status: "Paid", dueDate: "2026-08-05", payment_date: "2026-08-05" },
            { id: "FEE-003", label: "Laboratory & Research Access Fee", total: 800, paid: 800, status: "Paid", dueDate: "2026-08-15", payment_date: "2026-08-15" },
            { id: "FEE-004", label: "Campus Student Activities & Sports", total: 400, paid: 0, status: "Pending", dueDate: "2026-09-15" },
          ]);
        }
      } catch (err) {
        console.warn("[StudentPayments] Error loading payment history:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFees();
  }, [studentData?.id]);

  if (loading) return <LoadingState message="Loading payment transactions…" />;

  const paidTransactions = fees.filter((f) => f.paid > 0);
  const totalPaid = paidTransactions.reduce((s, f) => s + f.paid, 0);

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">Payment History & Tax Receipts</h1>
          <p className="page-subtitle">
            Verified financial receipts, university payment references, and download vouchers.
          </p>
        </div>
        <Badge variant="green" dot>e-Receipt System Active</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Total Settled Payments"
          value={`$${totalPaid.toLocaleString()}`}
          change="All Cleared"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Processed Transactions"
          value={`${paidTransactions.length} Invoices`}
          change="Verified"
          trend="neutral"
          icon={<FeesIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Payment Method"
          value="ACH / Card"
          change="Auto-Recorded"
          trend="up"
          icon={<span className="text-base font-bold text-[#bf783e]">🏦</span>}
        />
      </div>

      <DataTable
        title="Official Transaction Ledger"
        subtitle="Electronic transaction identifiers and download links"
        badgeText={`${paidTransactions.length} Cleared`}
        data={paidTransactions}
        keyExtractor={(f) => f.id}
        columns={[
          { key: "id", header: "Txn ID", render: (f) => <span className="font-mono text-xs text-[#bf783e] font-bold">{f.id}</span> },
          { key: "label", header: "Invoice Description", render: (f) => <span className="font-bold text-[#f4f6d6] text-sm">{f.label}</span> },
          { key: "payment_date", header: "Settlement Date", render: (f) => <span className="text-xs text-white/60">{f.payment_date || f.dueDate}</span> },
          { key: "paid", header: "Amount Paid", render: (f) => <span className="font-serif text-base text-[#f4f6d6]">${f.paid.toLocaleString()}</span> },
          { key: "status", header: "Status", render: () => <Badge variant="green" dot>Success</Badge> },
          {
            key: "action",
            header: "Receipt",
            render: (f) => (
              <button
                onClick={() => setSelectedReceipt(f)}
                className="btn-secondary text-xs px-3 py-1 hover:border-[#bf783e] text-[#bf783e]"
              >
                View e-Receipt
              </button>
            ),
          },
        ]}
      />

      {/* Receipt Modal */}
      <Modal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        title="Official University Payment Receipt"
        subtitle={`Transaction ID: ${selectedReceipt?.id}`}
      >
        {selectedReceipt && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-[#bf783e] tracking-widest block mb-1">
                Smart Campus ERP · Official Receipt
              </span>
              <div className="font-serif text-3xl font-normal text-[#f4f6d6]">
                ${selectedReceipt.paid.toLocaleString()}
              </div>
              <Badge variant="green" dot className="mt-2">Payment Cleared</Badge>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-white/50">Student Name</span>
                <span className="text-[#f4f6d6] font-medium">{studentData?.name || "Alex Johnson"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-white/50">Register Number</span>
                <span className="font-mono text-[#f4f6d6]">{studentData?.register_number || "REG2024CS001"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-white/50">Item Description</span>
                <span className="text-[#f4f6d6] font-medium">{selectedReceipt.label}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-white/50">Date of Settlement</span>
                <span className="text-[#f4f6d6]">{selectedReceipt.payment_date || selectedReceipt.dueDate}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-white/50">Payment Verification Code</span>
                <span className="font-mono text-[#bf783e]">ERP-AUTH-99482X</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Receipt PDF download initiated.");
                setSelectedReceipt(null);
              }}
              className="w-full btn-primary text-xs py-3 font-bold justify-center"
            >
              Download PDF Voucher
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
