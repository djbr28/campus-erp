// ============================================================
// Smart Campus ERP — Student Fees & Payments v2
// ============================================================
import { studentFees } from "@/lib/mock-data-step2";

export default function StudentFeesPage() {
  const totalFees = studentFees.reduce((s, f) => s + f.total, 0);
  const totalPaid = studentFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const totalRemaining = totalFees - totalPaid;
  const pct = Math.round((totalPaid / totalFees) * 100);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">Fees & Payments</h1>
        <p className="page-subtitle">View your fee records and payment status</p>
      </div>

      {/* Summary cards */}
      <div className="grid-3">
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Total Fees</div>
          <div className="text-2xl font-bold text-gray-900">${totalFees.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-gray-500 mb-1">Remaining</div>
          <div className={`text-2xl font-bold ${totalRemaining > 0 ? "text-amber-600" : "text-green-600"}`}>
            ${totalRemaining.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="card-flat p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Payment Progress</span>
          <span className="text-sm font-bold text-gray-900">{pct}%</span>
        </div>
        <div className="progress-track h-2.5">
          <div className={`progress-fill ${pct === 100 ? "progress-fill-green" : "progress-fill-brand"}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
          <span>${totalPaid.toLocaleString()} paid</span>
          <span>${totalRemaining.toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Fee table */}
      <div className="table-wrapper">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="section-heading mb-0">Fee Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Fee</th>
                <th className="hidden sm:table-cell">Due Date</th>
                <th>Amount</th>
                <th className="hidden md:table-cell">Paid</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentFees.map((f) => (
                <tr key={f.id}>
                  <td className="font-medium text-gray-900">{f.label}</td>
                  <td className="hidden sm:table-cell text-gray-500">{f.dueDate}</td>
                  <td className="text-gray-900 font-medium">${f.total.toLocaleString()}</td>
                  <td className="hidden md:table-cell text-gray-600">${f.paid.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      f.status === "Paid" ? "badge-green" : f.status === "Pending" ? "badge-amber" : "badge-red"
                    }`}>
                      {f.status}
                    </span>
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
