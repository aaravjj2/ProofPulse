"use client";

import { Shield } from "lucide-react";

export default function Header({
  onHistoryToggle,
}: {
  onHistoryToggle: () => void;
}) {
  return (
    <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">ProofPulse</span>
        </div>
        <button
          onClick={onHistoryToggle}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          History
        </button>
      </div>
    </header>
  );
}
