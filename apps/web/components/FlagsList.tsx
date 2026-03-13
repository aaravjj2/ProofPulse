"use client";

import { AlertTriangle } from "lucide-react";

interface FlagsListProps {
  flags: string[];
}

export default function FlagsList({ flags }: FlagsListProps) {
  return (
    <div className="bg-white/80 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <AlertTriangle size={14} className="text-amber-500" />
        Red Flags ({flags.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {flags.map((flag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200"
          >
            {flag}
          </span>
        ))}
      </div>
    </div>
  );
}
