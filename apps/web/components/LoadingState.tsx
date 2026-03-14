"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

const LOADING_MESSAGES = [
  "Scanning for known scam patterns...",
  "Analyzing language and urgency signals...",
  "Checking domain and URL reputation...",
  "Weighing evidence and calculating risk...",
  "Preparing your detailed report...",
] as const;

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLongWait, setShowLongWait] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);

    const longWaitTimer = setTimeout(() => setShowLongWait(true), 12000);

    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      // Asymptotic: fills to ~90% over 8s
      const p = 90 * (1 - Math.exp(-elapsed / 8000));
      setProgress(p);
      if (p < 89) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      clearInterval(interval);
      clearTimeout(longWaitTimer);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      data-testid="loading-state"
      className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center gap-4 py-8"
    >
      <Loader2 size={32} className="text-blue-600 animate-spin" />

      {/* Progress bar */}
      <div className="w-full max-w-sm h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p
        className="text-sm text-gray-600 dark:text-gray-400 text-center"
        aria-live="polite"
      >
        {LOADING_MESSAGES[messageIndex]}
      </p>

      {showLongWait && (
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          This is taking a bit longer than usual. Still working...
        </p>
      )}
    </div>
  );
}
