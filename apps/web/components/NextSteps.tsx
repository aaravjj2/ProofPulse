"use client";

import { CheckSquare } from "lucide-react";

interface NextStepsProps {
  steps: string[];
}

export default function NextSteps({ steps }: NextStepsProps) {
  return (
    <div className="bg-white/80 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <CheckSquare size={14} className="text-green-500" />
        Recommended Next Steps
      </h4>
      <ul className="space-y-2">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs flex items-center justify-center font-medium mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ul>
    </div>
  );
}
