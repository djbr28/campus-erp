// ============================================================
// Smart Campus ERP — DataTable Component (Editorial Aesthetic)
// ============================================================
import React from "react";
import Badge from "./Badge";

export interface Column<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  title?: string;
  subtitle?: string;
  badgeText?: string;
  emptyMessage?: string;
  actionSlot?: React.ReactNode;
  className?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  title,
  subtitle,
  badgeText,
  emptyMessage = "No records found.",
  actionSlot,
  className = "",
}: DataTableProps<T>) {
  return (
    <div className={`table-wrapper ${className}`}>
      {(title || badgeText || actionSlot) && (
        <div className="px-6 py-4 border-b border-white/10 bg-[#181818] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            {title && <h2 className="section-heading mb-0">{title}</h2>}
            {subtitle && <p className="text-xs text-white/50 font-light mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            {badgeText && <Badge variant="blue">{badgeText}</Badge>}
            {actionSlot}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/50 font-light">
            {emptyMessage}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className={col.className}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={keyExtractor(item)}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className}>
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
