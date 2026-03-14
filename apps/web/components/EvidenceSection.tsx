"use client";

import { useMemo } from "react";
import type { EvidenceItem, EvidenceFlag } from "@/lib/types";

interface EvidenceSectionProps {
  evidence: EvidenceItem[];
}

const FLAG_COLORS: Record<EvidenceFlag, string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
};

const BAR_COLORS: Record<EvidenceFlag, string> = {
  red: "bg-red-400",
  yellow: "bg-yellow-300",
  green: "bg-green-400",
};

export default function EvidenceSection({ evidence }: EvidenceSectionProps) {
  const sorted = useMemo(
    () => [...evidence].sort((a, b) => b.weight - a.weight),
    [evidence],
  );

  if (sorted.length === 0) return null;

  return (
    <div data-testid="evidence-section" className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Evidence</h4>
      <ul className="space-y-2" role="list">
        {sorted.map((item, idx) => (
          <li
            key={`${item.label}-${idx}`}
            className="flex items-start gap-3 p-3 bg-white/80 rounded-lg border border-gray-100"
          >
            {/* Flag indicator */}
            <span
              className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${FLAG_COLORS[item.flag]}`}
              aria-label={`${item.flag} flag`}
            />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {item.label}
                </span>
                <span className="text-xs text-gray-400 tabular-nums shrink-0">
                  {Math.round(item.weight * 100)}%
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 break-words">
                {item.value}
              </p>
              {/* Weight bar */}
              <div className="mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${BAR_COLORS[item.flag]}`}
                  style={{ width: `${Math.round(item.weight * 100)}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
