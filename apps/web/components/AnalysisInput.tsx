"use client";

import { useState, useRef } from "react";
import { Upload, Link2, MessageSquare, Loader2 } from "lucide-react";
import clsx from "clsx";
import type { InputMode, SourceType, AnalysisResult } from "@/lib/types";
import { analyzeText, analyzeImage, analyzeUrl } from "@/lib/api";

interface AnalysisInputProps {
  onResult: (result: AnalysisResult) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  initialText?: string;
  initialMode?: InputMode;
}

const SOURCE_OPTIONS: { value: SourceType; label: string }[] = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
  { value: "chat", label: "Chat" },
  { value: "other", label: "Other" },
];

export default function AnalysisInput({
  onResult,
  onError,
  onLoading,
  initialText = "",
  initialMode = "text",
}: AnalysisInputProps) {
  const [mode, setMode] = useState<InputMode>(initialMode);
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState("");
  const [source, setSource] = useState<SourceType>("other");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setLoading(true);
    onLoading(true);
    onError("");

    try {
      let result: AnalysisResult;

      if (mode === "text") {
        if (!text.trim()) {
          onError("Please enter some text to analyze.");
          return;
        }
        result = await analyzeText(text, source);
      } else if (mode === "image") {
        if (!file) {
          onError("Please upload an image to analyze.");
          return;
        }
        result = await analyzeImage(file, source);
      } else {
        if (!url.trim()) {
          onError("Please enter a URL to analyze.");
          return;
        }
        result = await analyzeUrl(url);
      }

      onResult(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Analysis failed. Please try again.";
      onError(msg);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      setFile(dropped);
    }
  };

  const tabs = [
    { mode: "text" as InputMode, icon: MessageSquare, label: "Text" },
    { mode: "image" as InputMode, icon: Upload, label: "Screenshot" },
    { mode: "url" as InputMode, icon: Link2, label: "URL" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mode tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        {tabs.map(({ mode: m, icon: Icon, label }) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              mode === m
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="space-y-3">
        {mode === "text" && (
          <>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a suspicious message, email, or SMS here..."
              className="w-full h-40 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white"
              maxLength={10000}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Source:</span>
              {SOURCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSource(opt.value)}
                  className={clsx(
                    "px-3 py-1 text-xs rounded-full transition-colors",
                    source === opt.value
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {mode === "image" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={clsx(
              "w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors",
              dragOver
                ? "border-blue-500 bg-blue-50"
                : file
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
            )}
          >
            <Upload size={24} className={file ? "text-green-500" : "text-gray-400"} />
            <p className="mt-2 text-sm text-gray-600">
              {file ? file.name : "Drop a screenshot or click to upload"}
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP (max 10MB)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
        )}

        {mode === "url" && (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://suspicious-link.example.com"
            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400 bg-white"
          />
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={clsx(
            "w-full py-3 px-6 rounded-xl font-semibold text-white transition-all",
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl"
          )}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Analyzing...
            </span>
          ) : (
            "Analyze Now"
          )}
        </button>
      </div>
    </div>
  );
}
