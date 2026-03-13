"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, HelpCircle } from "lucide-react";
import clsx from "clsx";
import { submitFeedback } from "@/lib/api";

interface FeedbackButtonsProps {
  analysisId: string;
}

export default function FeedbackButtons({ analysisId }: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleFeedback = async (rating: "accurate" | "inaccurate" | "unsure") => {
    try {
      await submitFeedback(analysisId, rating);
      setSubmitted(rating);
    } catch {
      setError(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center text-sm text-gray-500 py-2">
        Thanks for your feedback!
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-sm text-gray-400 py-2">
        Feedback could not be saved. Thanks for trying!
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 pt-2 border-t border-gray-200/60">
      <span className="text-xs text-gray-400">Was this helpful?</span>
      {[
        { rating: "accurate" as const, icon: ThumbsUp, label: "Accurate" },
        { rating: "unsure" as const, icon: HelpCircle, label: "Unsure" },
        { rating: "inaccurate" as const, icon: ThumbsDown, label: "Inaccurate" },
      ].map(({ rating, icon: Icon, label }) => (
        <button
          key={rating}
          onClick={() => handleFeedback(rating)}
          className={clsx(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          )}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}
