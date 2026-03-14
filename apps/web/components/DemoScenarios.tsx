"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import clsx from "clsx";
import { DEMO_SCENARIOS } from "@/lib/constants";

const CATEGORY_COLORS: Record<string, string> = {
  phishing: "bg-red-50 text-red-700 border-red-200",
  job_scam: "bg-purple-50 text-purple-700 border-purple-200",
  payment_scam: "bg-orange-50 text-orange-700 border-orange-200",
  impersonation: "bg-amber-50 text-amber-700 border-amber-200",
  safe: "bg-green-50 text-green-700 border-green-200",
};

const CATEGORY_DISPLAY: Record<string, string> = {
  phishing: "Phishing",
  job_scam: "Job Scam",
  payment_scam: "Payment Scam",
  impersonation: "Impersonation",
  safe: "Safe",
};

export default function DemoScenarios() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <Sparkles size={20} className="text-amber-500" />
          See ProofPulse catch scams in real time
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Click any demo to analyze it instantly
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SCENARIOS.map((scenario) => (
          <Link
            key={scenario.id}
            href={`/analyze?demo=${scenario.id}`}
            className="text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group block"
          >
            <div className="flex items-start justify-between mb-2">
              <span
                className={clsx(
                  "text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border",
                  CATEGORY_COLORS[scenario.category] ||
                    "bg-gray-50 text-gray-600 border-gray-200",
                )}
              >
                {CATEGORY_DISPLAY[scenario.category] || scenario.category}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase">
                {scenario.inputMode}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
              {scenario.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
              {scenario.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
