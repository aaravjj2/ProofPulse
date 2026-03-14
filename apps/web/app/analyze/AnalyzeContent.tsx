"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { AnalysisResponse, InputMode } from "@/lib/types";
import { DEMO_SCENARIOS } from "@/lib/constants";
import AnalysisInput from "@/components/AnalysisInput";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";

export default function AnalyzeContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoId = searchParams.get("demo");

  // Track which demo the current result belongs to; reset derived state on change.
  const [resultDemoId, setResultDemoId] = useState<string | null>(demoId);
  if (resultDemoId !== demoId) {
    setResultDemoId(demoId);
    setResult(null);
    setError("");
  }

  const demo = demoId
    ? DEMO_SCENARIOS.find((s) => s.id === demoId)
    : undefined;

  const initialText = demo?.content ?? "";
  const initialMode: InputMode = demo?.inputMode ?? "text";

  return (
    <div className="min-h-screen pb-16">
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analyze Content</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Paste, upload, or enter a URL below
          </p>
        </div>

        <AnalysisInput
          key={demoId ?? "default"}
          onResult={(r) => {
            setResult(r);
            setError("");
          }}
          onError={setError}
          onLoading={setLoading}
          initialText={initialText}
          initialMode={initialMode}
        />

        {error && !loading && (
          <div
            role="alert"
            className="max-w-2xl mx-auto mt-4 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400 text-center"
          >
            {error}
          </div>
        )}

        {loading && <LoadingState />}

        {result && !loading && (
          <div className="mt-8">
            <ResultCard result={result} />
          </div>
        )}
      </section>
    </div>
  );
}
