"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Info,
  Lightbulb,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import clsx from "clsx";
import type { AnalysisResponse, RiskLevel } from "@/lib/types";
import { RISK_COLORS } from "@/lib/types";
import RiskScoreDonut from "./RiskScoreDonut";
import EvidenceSection from "./EvidenceSection";
import FeedbackWidget from "./FeedbackWidget";

interface ResultCardProps {
  result: AnalysisResponse;
}

const RISK_ICONS: Record<RiskLevel, React.ElementType> = {
  SAFE: CheckCircle,
  LOW: Info,
  MEDIUM: AlertTriangle,
  HIGH: AlertTriangle,
  CRITICAL: XCircle,
};

const RISK_LABELS: Record<RiskLevel, string> = {
  SAFE: "Safe",
  LOW: "Low Risk",
  MEDIUM: "Medium Risk",
  HIGH: "High Risk",
  CRITICAL: "Critical Risk",
};

const BADGE_STYLES: Record<RiskLevel, string> = {
  SAFE: "bg-green-100 text-green-700 border-green-200",
  LOW: "bg-lime-100 text-lime-700 border-lime-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  CRITICAL: "bg-red-100 text-red-700 border-red-200",
};

const RISK_CARD_STYLES: Record<RiskLevel, string> = {
  SAFE: "border-green-500/50 bg-green-500/5",
  LOW: "border-blue-500/40 bg-blue-500/5",
  MEDIUM: "border-amber-500/50 bg-amber-500/5",
  HIGH: "border-orange-500/60 bg-orange-500/8",
  CRITICAL: "border-red-500/70 bg-red-500/8 animate-pulse-border",
};

export default function ResultCard({ result }: ResultCardProps) {
  const Icon = RISK_ICONS[result.risk_level] || Shield;
  const [copied, setCopied] = useState(false);

  const reportText = [
    `Risk Level: ${RISK_LABELS[result.risk_level]} (${result.risk_score}/100)`,
    `Verdict: ${result.verdict}`,
    "",
    "Evidence:",
    ...result.evidence.map((e) => `- ${e.label}: ${e.value}`),
    "",
    "Recommendations:",
    ...result.recommendations.map((r) => `- ${r}`),
    "",
    "Next Steps:",
    ...result.next_steps.map((s, i) => `${i + 1}. ${s}`),
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea");
      el.value = reportText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      data-testid="analysis-result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      className={clsx(
        "w-full max-w-2xl mx-auto rounded-2xl border p-6 space-y-6",
        RISK_CARD_STYLES[result.risk_level],
      )}
    >
      {/* Header: badge + donut */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={clsx(
              "p-2 rounded-full",
              BADGE_STYLES[result.risk_level],
            )}
          >
            <Icon size={24} />
          </div>
          <div>
            <span
              data-testid="risk-badge"
              className={clsx(
                "inline-block text-xs font-bold uppercase px-2.5 py-1 rounded-full border",
                BADGE_STYLES[result.risk_level],
              )}
            >
              {RISK_LABELS[result.risk_level]}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {Math.round(result.confidence * 100)}% confidence
            </p>
          </div>
        </div>
        <RiskScoreDonut score={result.risk_score} riskLevel={result.risk_level} />
      </div>

      {/* Verdict */}
      <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Verdict</h4>
        <p
          data-testid="verdict-text"
          className={clsx("text-sm leading-relaxed", RISK_COLORS[result.risk_level])}
        >
          {result.verdict}
        </p>
      </div>

      {/* Evidence */}
      {result.evidence.length > 0 && (
        <EvidenceSection evidence={result.evidence} />
      )}

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <Lightbulb size={14} className="text-amber-500" />
            Recommendations
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {result.next_steps.length > 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
            <ArrowRight size={14} className="text-blue-500" />
            Next Steps
          </h4>
          <ol className="space-y-1.5 list-decimal list-inside">
            {result.next_steps.map((step, idx) => (
              <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
        <span>Model: {result.model_used}</span>
        <span>Latency: {result.latency_ms}ms</span>
        <span>Type: {result.input_type}</span>
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy Report"}
        </button>
      </div>

      {/* Feedback */}
      <FeedbackWidget analysisId={result.analysis_id} />
    </motion.div>
  );
}
