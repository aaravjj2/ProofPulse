"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronLeft, ChevronRight, Filter, Download } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { getHistory } from "@/lib/api";
import type { RiskLevel } from "@/lib/types";
import { RISK_COLORS, RISK_BG } from "@/lib/types";

const RISK_FILTERS: { label: string; value: RiskLevel | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "Safe", value: "SAFE" },
  { label: "Low", value: "LOW" },
  { label: "Medium", value: "MEDIUM" },
  { label: "High", value: "HIGH" },
  { label: "Critical", value: "CRITICAL" },
];

const PER_PAGE = 20;

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["history", page, riskFilter],
    queryFn: () =>
      getHistory(
        page,
        PER_PAGE,
        riskFilter === "ALL" ? undefined : riskFilter,
      ),
  });

  const totalPages = data ? Math.ceil(data.total / data.per_page) : 0;

  const exportCSV = () => {
    if (!data || data.items.length === 0) return;
    const headers = ["ID", "Date", "Type", "Risk Level", "Risk Score", "Verdict"];
    const rows = data.items.map((item) => [
      item.analysis_id,
      new Date(item.created_at).toLocaleString(),
      item.input_type,
      item.risk_level,
      item.risk_score,
      `"${item.verdict.replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `proofpulse-history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-16">
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-8">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Analysis History
              </h1>
            </div>
            {data && data.items.length > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Download size={14} />
                Export CSV
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Filter size={14} className="text-gray-400" />
            {RISK_FILTERS.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => {
                  setRiskFilter(value);
                  setPage(1);
                }}
                className={clsx(
                  "px-3 py-1 text-xs font-medium rounded-full transition-colors border",
                  riskFilter === value
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Loading history...
              </p>
            </div>
          )}

          {/* Error */}
          {isError && (
            <div
              role="alert"
              className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 text-center"
            >
              {error instanceof Error
                ? error.message
                : "Failed to load history."}
            </div>
          )}

          {/* Empty state */}
          {data && data.items.length === 0 && (
            <div className="text-center py-16">
              <Clock size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">No analyses yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Run your first analysis to see it here.
              </p>
              <Link
                href="/analyze"
                className="inline-block mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Analyze something
              </Link>
            </div>
          )}

          {/* History cards */}
          {data && data.items.length > 0 && (
            <div className="space-y-3">
              {data.items.map((item) => (
                <div
                  key={item.analysis_id}
                  data-testid="history-card"
                  className={clsx(
                    "p-4 rounded-xl border transition-shadow hover:shadow-sm",
                    RISK_BG[item.risk_level],
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={clsx(
                            "text-xs font-bold uppercase",
                            RISK_COLORS[item.risk_level],
                          )}
                        >
                          {item.risk_level}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Score: {item.risk_score}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 uppercase">
                          {item.input_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {item.verdict}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 tabular-nums">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={clsx(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors",
                  page === 1
                    ? "text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
              >
                <ChevronLeft size={14} />
                Previous
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={clsx(
                  "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors",
                  page === totalPages
                    ? "text-gray-300 dark:text-gray-600 border-gray-100 dark:border-gray-700 cursor-not-allowed"
                    : "text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
                )}
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
