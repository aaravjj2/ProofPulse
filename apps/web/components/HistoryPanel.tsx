"use client";

import { useState, useEffect } from "react";
import { Clock, ChevronRight, X } from "lucide-react";
import clsx from "clsx";
import { getHistory } from "@/lib/api";
import { CATEGORY_LABELS, RISK_COLORS } from "@/lib/constants";
import type { HistoryEntry } from "@/lib/types";

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getHistory()
        .then(setEntries)
        .catch(() => setEntries([]))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full overflow-y-auto animate-in slide-in-from-right">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock size={18} />
            Recent Analyses
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {loading && (
            <div className="text-center text-sm text-gray-400 py-8">Loading...</div>
          )}

          {!loading && entries.length === 0 && (
            <div className="text-center text-sm text-gray-400 py-8">
              No analyses yet. Try analyzing some content!
            </div>
          )}

          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {entry.input_type}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold"
                    style={{ color: RISK_COLORS[entry.risk_label] || "#6b7280" }}
                  >
                    {entry.risk_score}/100
                  </span>
                  <ChevronRight size={12} className="text-gray-300" />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-800">
                {CATEGORY_LABELS[entry.category] || entry.category}
              </p>
              {entry.summary && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{entry.summary}</p>
              )}
              <p className="text-[10px] text-gray-400 mt-1">
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
