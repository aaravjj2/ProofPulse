"use client";

import { useState } from "react";
import { Star, Send, Check } from "lucide-react";
import clsx from "clsx";
import { submitFeedback } from "@/lib/api";

interface FeedbackWidgetProps {
  analysisId: string;
}

export default function FeedbackWidget({ analysisId }: FeedbackWidgetProps) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) return;

    setSubmitting(true);
    setError("");

    try {
      await submitFeedback({
        analysis_id: analysisId,
        rating,
        comment: comment.trim() || undefined,
      });
      setSubmitted(true);
    } catch {
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        data-testid="feedback-widget"
        className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-xl border border-green-200 dark:border-green-800 text-sm text-green-700 dark:text-green-400"
      >
        <Check size={16} />
        Thank you for your feedback!
      </div>
    );
  }

  return (
    <div
      data-testid="feedback-widget"
      className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-700 space-y-3"
    >
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Was this analysis helpful?
      </h4>

      {/* Star rating */}
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={rating === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            className="p-0.5 transition-transform hover:scale-110"
          >
            <Star
              size={20}
              className={clsx(
                "transition-colors",
                (hoveredStar || rating) >= star
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600",
              )}
            />
          </button>
        ))}
      </div>

      {/* Optional comment */}
      {rating > 0 && (
        <>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Optional: any additional feedback?"
            className="w-full h-20 p-3 text-sm border border-gray-200 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            {error && (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={clsx(
                "ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                submitting
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              <Send size={14} />
              {submitting ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
