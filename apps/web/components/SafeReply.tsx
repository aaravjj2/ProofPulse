"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle } from "lucide-react";

interface SafeReplyProps {
  reply: string;
}

export default function SafeReply({ reply }: SafeReplyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white/80 rounded-xl p-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
        <MessageCircle size={14} className="text-indigo-500" />
        Safe Reply Template
      </h4>
      <div className="flex items-start gap-3 bg-indigo-50 rounded-lg p-3 border border-indigo-100">
        <p className="text-sm text-indigo-800 flex-1 italic">&ldquo;{reply}&rdquo;</p>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
          title={copied ? "Copied!" : "Copy to clipboard"}
        >
          {copied ? (
            <Check size={14} className="text-green-600" />
          ) : (
            <Copy size={14} className="text-indigo-400" />
          )}
        </button>
      </div>
    </div>
  );
}
