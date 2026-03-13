"use client";

import { Shield, AlertTriangle, XCircle, CheckCircle, Info } from "lucide-react";
import clsx from "clsx";
import type { AnalysisResult } from "@/lib/types";
import { RISK_BG_COLORS, CATEGORY_LABELS } from "@/lib/constants";
import TrustMeter from "./TrustMeter";
import EvidenceList from "./EvidenceList";
import FlagsList from "./FlagsList";
import NextSteps from "./NextSteps";
import SafeReply from "./SafeReply";
import FeedbackButtons from "./FeedbackButtons";

interface ResultCardProps {
  result: AnalysisResult;
}

const RISK_ICONS: Record<string, React.ElementType> = {
  safe: CheckCircle,
  low: Info,
  medium: AlertTriangle,
  high: AlertTriangle,
  critical: XCircle,
};

export default function ResultCard({ result }: ResultCardProps) {
  const Icon = RISK_ICONS[result.risk_label] || Shield;
  const borderClass = RISK_BG_COLORS[result.risk_label] || "bg-gray-50 border-gray-200";

  return (
    <div
      className={clsx(
        "w-full max-w-2xl mx-auto rounded-2xl border p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500",
        borderClass
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={clsx("p-2 rounded-full", {
              "bg-green-100 text-green-600": result.risk_label === "safe",
              "bg-lime-100 text-lime-600": result.risk_label === "low",
              "bg-yellow-100 text-yellow-600": result.risk_label === "medium",
              "bg-orange-100 text-orange-600": result.risk_label === "high",
              "bg-red-100 text-red-600": result.risk_label === "critical",
            })}
          >
            <Icon size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 capitalize">
              {result.risk_label} Risk
            </h3>
            <p className="text-sm text-gray-500">
              {CATEGORY_LABELS[result.category] || result.category} &middot;{" "}
              {Math.round(result.confidence * 100)}% confidence
            </p>
          </div>
        </div>
        <TrustMeter score={result.risk_score} label={result.risk_label} />
      </div>

      {/* Explanation */}
      <div className="bg-white/80 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Analysis</h4>
        <p className="text-gray-700 text-sm leading-relaxed">{result.explanation}</p>
      </div>

      {/* Red Flags */}
      {result.flags.length > 0 && <FlagsList flags={result.flags} />}

      {/* Evidence */}
      {result.evidence.length > 0 && <EvidenceList evidence={result.evidence} />}

      {/* Next Steps */}
      {result.next_steps.length > 0 && <NextSteps steps={result.next_steps} />}

      {/* Safe Reply */}
      {result.safe_reply && <SafeReply reply={result.safe_reply} />}

      {/* OCR Info */}
      {result.ocr_text && (
        <div className="bg-white/80 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Extracted Text (OCR)
            {result.ocr_confidence !== null && (
              <span className="ml-2 text-xs text-gray-400 font-normal">
                {Math.round(result.ocr_confidence * 100)}% accuracy
              </span>
            )}
          </h4>
          <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 font-mono">
            {result.ocr_text}
          </p>
        </div>
      )}

      {/* Feedback */}
      <FeedbackButtons analysisId={result.id} />
    </div>
  );
}
