/** API client for communicating with the ProofPulse backend. */

import type { AnalysisResult, HistoryEntry } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, body || res.statusText);
  }

  return res.json();
}

export async function analyzeText(
  text: string,
  source: string = "other",
): Promise<AnalysisResult> {
  return request<AnalysisResult>("/analyze/text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, source, locale: "en-US" }),
  });
}

export async function analyzeImage(
  file: File,
  source: string = "other",
): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("source", source);
  formData.append("locale", "en-US");

  return request<AnalysisResult>("/analyze/image", {
    method: "POST",
    body: formData,
  });
}

export async function analyzeUrl(
  url: string,
  context: string = "other",
): Promise<AnalysisResult> {
  return request<AnalysisResult>("/analyze/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, context }),
  });
}

export async function getHistory(): Promise<HistoryEntry[]> {
  return request<HistoryEntry[]>("/history");
}

export async function submitFeedback(
  analysisId: string,
  rating: "accurate" | "inaccurate" | "unsure",
  note?: string,
): Promise<void> {
  await request("/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysis_id: analysisId, rating, note }),
  });
}

export async function checkHealth(): Promise<{ status: string }> {
  return request<{ status: string }>("/health");
}
