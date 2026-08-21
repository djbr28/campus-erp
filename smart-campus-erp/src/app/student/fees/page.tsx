// ============================================================
// Smart Campus ERP — Student Fees & Payments
// ============================================================
import { studentFees } from "@/lib/mock-data-step2";

export default function StudentFeesPage() {
  const totalFees = studentFees.reduce((s, f) => s + f.total, 0);
  const totalPaid = studentFees.filter((f) => f.status === "Paid").reduce((s, f) => s + f.paid, 0);
  const totalRemaining = totalFees - totalPaid;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
        <p className="mt-1 text-sm text-gray-500">View your fee records and payment status</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-5 bg-white rounded-2xl border border-gray-100">
          <div className="text-sm text-gray-500 mb-1">Total Fees</div>
          <div className="text-2xl font-bold text-gray-900">${totalFees.toLocaleString()}</div>
        </div>
        <div className="p-5 bg-green-50 rounded-2xl border border-green-100">
          <div className="text-sm text-green-700 mb-1">Paid</div>
          <div className="text-2xl font-bold text-green-700">${totalPaid.toLocaleString()}</div>
        </div>
        <div className={`p-5 rounded-2xl border ${totalRemaining > 0 ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}>
          <div className={`text-sm mb-1 ${totalRemaining > 0 ? "text-amber-700" : "text-green-700"}`}>
            Remaining
          </div>
          <div className={`text-2xl font-bold ${totalRemaining > 0 ? "text-amber-700" : "text-green-700"}`}>
            ${totalRemaining.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Payment Progress</span>
          <span className="font-medium text-gray-900">{Math.round((totalPaid / totalFees) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${(totalPaid / totalFees) * 100}%` }}
          />
        </div>
      </div>

      {/* Fee records table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Fee Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Fee</th>
                <th className="px-5 py-3 font-medium hidden sm:table-cell">Due Date</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium hidden md:table-cell">Paid</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {studentFees.map((f) => (
                <tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">{f.label}</td>
                  <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{f.dueDate}</td>
                  <td className="px-5 py-3 text-gray-900">${f.total.toLocaleString()}</td>
                  <td className="px-5 py-3 text-gray-600 hidden md:table-cell">${f.paid.toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                        f.status === "Paid"
                          ? "bg-green-100 text-green-700"
                          : f.status === "Pending"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
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
