"use client";

import { Search } from "lucide-react";
import type { Evidence } from "@/lib/types";

interface EvidenceListProps {
  evidence: Evidence[];
}

export default function EvidenceList({ evidence }: EvidenceListProps) {
  return (
    <div className="bg-white/80 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <Search size={14} className="text-blue-500" />
        Evidence ({evidence.length})
      </h4>
      <div className="space-y-2">
        {evidence.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
          >
            <span className="text-xs font-mono text-gray-400 uppercase mt-0.5 flex-shrink-0">
              {item.type}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 break-words">
                &ldquo;{item.value}&rdquo;
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
