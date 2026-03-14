"use client";

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Info,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import clsx from "clsx";
import type { AnalysisResponse, RiskLevel } from "@/lib/types";
import { RISK_COLORS, RISK_BG } from "@/lib/types";
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

export default function ResultCard({ result }: ResultCardProps) {
  const Icon = RISK_ICONS[result.risk_level] || Shield;

  return (
    <motion.div
      data-testid="analysis-result"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={clsx(
        "w-full max-w-2xl mx-auto rounded-2xl border p-6 space-y-6",
        RISK_BG[result.risk_level],
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
            <p className="text-sm text-gray-500 mt-1">
              {Math.round(result.confidence * 100)}% confidence
            </p>
          </div>
        </div>
        <RiskScoreDonut score={result.risk_score} riskLevel={result.risk_level} />
      </div>

      {/* Verdict */}
      <div className="bg-white/80 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Verdict</h4>
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
        <div className="bg-white/80 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <Lightbulb size={14} className="text-amber-500" />
            Recommendations
          </h4>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-gray-600"
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
        <div className="bg-white/80 rounded-xl p-4 space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <ArrowRight size={14} className="text-blue-500" />
            Next Steps
          </h4>
          <ol className="space-y-1.5 list-decimal list-inside">
            {result.next_steps.map((step, idx) => (
              <li key={idx} className="text-sm text-gray-600">
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-200/50">
        <span>Model: {result.model_used}</span>
        <span>Latency: {result.latency_ms}ms</span>
        <span>Type: {result.input_type}</span>
      </div>

      {/* Feedback */}
      <FeedbackWidget analysisId={result.analysis_id} />
    </motion.div>
  );
}
