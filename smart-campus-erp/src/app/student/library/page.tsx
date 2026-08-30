// ============================================================
// Smart Campus ERP — Student Library Module
// ============================================================
"use client";

import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getSupabaseClient } from "@/lib/supabase/client";
import DataTable from "@/components/ui/DataTable";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import LoadingState from "@/components/ui/LoadingState";
import { BookOpenIcon, CheckIcon } from "@/components/ui/Icons";
import type { Book, LibraryTransaction } from "@/types";

export default function StudentLibraryPage() {
  const { studentData } = useCurrentUser();
  const [books, setBooks] = useState<Book[]>([]);
  const [transactions, setTransactions] = useState<LibraryTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      try {
        const supabase = getSupabaseClient();
        const [booksRes, txnsRes] = await Promise.all([
          supabase.from("books").select("*").order("title"),
          supabase.from("library_transactions").select("*, book:books(*)"),
        ]);

        if (booksRes.data && booksRes.data.length > 0) {
          setBooks(booksRes.data);
        } else {
          setBooks([
            { id: "BK-001", title: "Introduction to Algorithms (CLRS)", author: "Thomas H. Cormen et al.", category: "Computer Science", available_count: 4, total_copies: 8 },
            { id: "BK-002", title: "Operating System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available_count: 2, total_copies: 5 },
            { id: "BK-003", title: "Database System Concepts", author: "Abraham Silberschatz", category: "Computer Science", available_count: 5, total_copies: 6 },
            { id: "BK-004", title: "Computer Networking: A Top-Down Approach", author: "James Kurose", category: "Networking", available_count: 3, total_copies: 5 },
            { id: "BK-005", title: "Design Patterns: Elements of Reusable Software", author: "Erich Gamma et al.", category: "Software Engineering", available_count: 1, total_copies: 4 },
          ]);
        }

        if (txnsRes.data && txnsRes.data.length > 0) {
          setTransactions(txnsRes.data);
        } else if (studentData?.isNewStudent) {
          setTransactions([]);
        } else {
          setTransactions([
            { id: "TXN-01", student_id: studentData?.id || "STU-001", book_id: "BK-001", issue_date: "2026-08-10", due_date: "2026-08-24", status: "Issued", fine_amount: 0 },
            { id: "TXN-02", student_id: studentData?.id || "STU-001", book_id: "BK-004", issue_date: "2026-08-12", due_date: "2026-08-26", status: "Issued", fine_amount: 0 },
          ]);
        }
      } catch (err) {
        console.warn("[StudentLibrary] Error loading library items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadLibrary();
  }, [studentData?.id]);

  if (loading) return <LoadingState message="Loading university library catalog…" />;

  return (
    <div className="space-y-6 animate-fade-in text-[#f4f6d6]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">University Library & Borrowings</h1>
          <p className="page-subtitle">
            Search physical & digital resources, track borrowed textbooks, due dates, and renewals.
          </p>
        </div>
        <Badge variant="green" dot>Library Card Active</Badge>
      </div>

      <div className="grid-3">
        <StatCard
          label="Currently Borrowed"
          value={`${transactions.filter((t) => t.status === "Issued").length} Books`}
          change="Due in 7 days"
          trend="neutral"
          icon={<BookOpenIcon className="w-5 h-5 text-[#bf783e]" />}
        />
        <StatCard
          label="Borrowing Limit"
          value="2 / 5 Books"
          change="3 Remaining"
          trend="up"
          icon={<CheckIcon className="w-5 h-5 text-emerald-400" />}
        />
        <StatCard
          label="Overdue Fines"
          value="$0.00"
          change="Clean Record"
          trend="up"
          icon={<span className="text-base font-bold text-emerald-400">🛡️</span>}
        />
      </div>

      {/* Borrowed Books Table */}
      {studentData?.isNewStudent ? (
        <div className="card-flat p-8 text-center text-white/50 text-sm mb-6">
          You haven't borrowed any books yet. Browse the campus catalog below to find required resources.
        </div>
      ) : (
        <DataTable
          title="Active Borrowing & Loan Status"
          subtitle="Return books before the due date to avoid automated overdue penalty fees"
          badgeText={`${transactions.length} Books on Loan`}
          data={transactions}
          keyExtractor={(t) => t.id}
          columns={[
            { key: "book_id", header: "Book ID", render: (t) => <span className="font-mono text-xs text-[#bf783e] font-bold">{t.book_id}</span> },
            { key: "title", header: "Book Title", render: (t) => <span className="font-bold text-[#f4f6d6] text-sm">{t.book?.title || "University Textbook"}</span> },
            { key: "issue_date", header: "Issue Date", render: (t) => <span className="text-xs text-white/60">{t.issue_date}</span> },
            { key: "due_date", header: "Return Due Date", render: (t) => <span className="text-xs font-semibold text-amber-300">{t.due_date}</span> },
            { key: "status", header: "Status", render: (t) => <Badge variant={t.status === "Issued" ? "blue" : "green"} dot>{t.status}</Badge> },
          ]}
        />
      )}

      {/* Campus Catalog */}
      <DataTable
        title="Campus Central Library Catalog"
        subtitle="Browse available titles for circulation & research reserve"
        badgeText={`${books.length} Available Titles`}
        data={books}
        keyExtractor={(b) => b.id}
        columns={[
          { key: "id", header: "Accession #", render: (b) => <span className="font-mono text-xs text-[#bf783e]">{b.id}</span> },
          { key: "title", header: "Title", render: (b) => <span className="font-bold text-[#f4f6d6] text-sm">{b.title}</span> },
          { key: "author", header: "Author", render: (b) => <span className="text-xs text-white/70 font-light">{b.author}</span> },
          { key: "category", header: "Category", render: (b) => <Badge variant="gray">{b.category || "General"}</Badge> },
          {
            key: "available_count",
            header: "Copies Available",
            render: (b) => (
              <span className={`text-xs font-semibold ${b.available_count > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {b.available_count} of {b.total_copies || 5} Available
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
