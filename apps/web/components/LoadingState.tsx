"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { LOADING_MESSAGES } from "@/lib/constants";

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      data-testid="loading-state"
      className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-4 py-8"
    >
      <Loader2 size={32} className="text-blue-600 animate-spin" />
      <p
        className="text-sm text-gray-600 animate-pulse transition-all"
        aria-live="polite"
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>
    </div>
  );
}
