"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion } from "framer-motion";
import type { RiskLevel } from "@/lib/types";
import { RISK_COLORS } from "@/lib/types";

interface RiskScoreDonutProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
}

const STROKE_COLORS: Record<RiskLevel, string> = {
  SAFE: "#22c55e",
  LOW: "#84cc16",
  MEDIUM: "#eab308",
  HIGH: "#f97316",
  CRITICAL: "#ef4444",
};

export default function RiskScoreDonut({
  score,
  riskLevel,
  size = 120,
}: RiskScoreDonutProps) {
  const shouldReduce = useReducedMotion();
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;

  const springValue = useSpring(0, {
    stiffness: shouldReduce ? 200 : 60,
    damping: shouldReduce ? 30 : 20,
  });
  const dashOffset = useTransform(
    springValue,
    (v: number) => circumference - (v / 100) * circumference,
  );

  const [displayScore, setDisplayScore] = useState(shouldReduce ? score : 0);

  useEffect(() => {
    springValue.set(score);

    const unsub = springValue.on("change", (v: number) => {
      setDisplayScore(Math.round(v));
    });

    return unsub;
  }, [score, springValue]);

  const strokeColor = STROKE_COLORS[riskLevel];

  return (
    <div
      data-testid="risk-score-chart"
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Risk score ${score} out of 100, level ${riskLevel}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={10}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${RISK_COLORS[riskLevel]}`}>
          {displayScore}
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          risk
        </span>
      </div>
    </div>
  );
}
