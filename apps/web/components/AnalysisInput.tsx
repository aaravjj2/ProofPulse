"use client";

import { useState, useRef, useCallback } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Upload, Link2, MessageSquare, X } from "lucide-react";
import clsx from "clsx";
import type { InputMode, AnalysisResponse } from "@/lib/types";
import { ApiError, analyzeText, analyzeImage, analyzeURL } from "@/lib/api";
import { TEXT_MAX_LENGTH } from "@/lib/constants";

interface AnalysisInputProps {
  onResult: (result: AnalysisResponse) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  initialText?: string;
  initialMode?: InputMode;
}

const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

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
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((candidate: File | undefined) => {
    if (!candidate) return;
    if (!ACCEPTED_TYPES.has(candidate.type)) return;
    if (candidate.size > 10 * 1024 * 1024) return;
    setFile(candidate);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      handleFile(dropped);
    },
    [handleFile],
  );

  const isSubmitDisabled = (): boolean => {
    if (loading) return true;
    if (mode === "text") return text.trim().length === 0;
    if (mode === "image") return file === null;
    if (mode === "url") return url.trim().length === 0;
    return true;
  };

  const handleClear = () => {
    setText("");
    setUrl("");
    setFile(null);
    setError("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    onLoading(true);
    onError("");

    try {
      let result: AnalysisResponse;

      if (mode === "text") {
        if (!text.trim()) {
          setError("Please enter some text to analyze.");
          return;
        }
        result = await analyzeText(text);
      } else if (mode === "image") {
        if (!file) {
          setError("Please upload an image to analyze.");
          return;
        }
        result = await analyzeImage(file);
      } else {
        if (!url.trim()) {
          setError("Please enter a URL to analyze.");
          return;
        }
        result = await analyzeURL(url);
      }

      onResult(result);
    } catch (err) {
      let msg = "Analysis failed. Please try again.";
      if (err instanceof ApiError) {
        msg = err.code === 429 ? "Too many requests" : err.message;
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
      onError(msg);
    } finally {
      setLoading(false);
      onLoading(false);
    }
  };

  const hasContent =
    text.trim().length > 0 || url.trim().length > 0 || file !== null;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Tabs.Root value={mode} onValueChange={(v: string) => setMode(v as InputMode)}>
        <Tabs.List
          className="flex gap-1 mb-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1"
          aria-label="Input mode"
        >
          <Tabs.Trigger
            value="text"
            role="tab"
            aria-label="Text"
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              mode === "text"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            <MessageSquare size={16} />
            Text
          </Tabs.Trigger>
          <Tabs.Trigger
            value="image"
            role="tab"
            aria-label="Screenshot"
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              mode === "image"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            <Upload size={16} />
            Screenshot
          </Tabs.Trigger>
          <Tabs.Trigger
            value="url"
            role="tab"
            aria-label="URL"
            className={clsx(
              "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
              mode === "url"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
            )}
          >
            <Link2 size={16} />
            URL
          </Tabs.Trigger>
        </Tabs.List>

        <div className="space-y-3">
          <Tabs.Content value="text" className="outline-none">
            <div className="relative">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste a suspicious message, email, or SMS here..."
                className="w-full h-40 p-4 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800"
                maxLength={TEXT_MAX_LENGTH}
                aria-label="Text to analyze"
              />
              <span
                data-testid="char-counter"
                className={clsx(
                  "absolute bottom-3 right-3 text-xs tabular-nums",
                  text.length > TEXT_MAX_LENGTH * 0.9
                    ? "text-red-500"
                    : "text-gray-400 dark:text-gray-500",
                )}
              >
                {text.length.toLocaleString()} /{" "}
                {TEXT_MAX_LENGTH.toLocaleString()}
              </span>
            </div>
          </Tabs.Content>

          <Tabs.Content value="image" className="outline-none">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                "w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors",
                dragOver
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                  : file
                    ? "border-green-300 bg-green-50 dark:bg-green-950"
                    : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500",
              )}
            >
              <Upload
                size={24}
                className={file ? "text-green-500" : "text-gray-400 dark:text-gray-500"}
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {file ? file.name : "Drop a screenshot or click to upload"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                PNG, JPG, WebP (max 10MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </Tabs.Content>

          <Tabs.Content value="url" className="outline-none">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://suspicious-link.example.com"
              className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800"
              aria-label="URL to analyze"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isSubmitDisabled()) {
                  handleSubmit();
                }
              }}
            />
          </Tabs.Content>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg px-4 py-2"
            >
              {error}
            </p>
          )}

          <div className="flex gap-2">
            {hasContent && (
              <button
                role="button"
                aria-label="Clear"
                onClick={handleClear}
                className="px-4 py-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Clear
              </button>
            )}
            <button
              role="button"
              aria-label="Analyze"
              onClick={handleSubmit}
              disabled={isSubmitDisabled()}
              className={clsx(
                "flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all",
                isSubmitDisabled()
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl",
              )}
            >
              Analyze
            </button>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
}
