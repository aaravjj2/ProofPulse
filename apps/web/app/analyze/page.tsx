"use client";

import { Suspense } from "react";
import AnalyzeContent from "./AnalyzeContent";

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
