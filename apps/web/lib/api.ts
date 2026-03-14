/** API client for ProofPulse backend. */

import axios, { AxiosError } from "axios";
import type {
  AnalysisResponse,
  HistoryResponse,
  FeedbackRequest,
  FeedbackResponse,
  StatsResponse,
  ScenarioAnalysisRequest,
  HealthResponse,
} from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  timeout: 30000,
  headers: { "X-Client-Version": "1.0.0" },
});

export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public requestId?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; request_id?: string }>) => {
    if (error.response) {
      const { status, data } = error.response;
      const msg = data?.message || error.message;
      throw new ApiError(status, msg, data?.request_id);
    }
    throw new ApiError(0, error.message || "Network error");
  },
);

export const analyzeText = (text: string, context?: string) =>
  api
    .post<AnalysisResponse>("/api/v1/analyze/text", { text, context })
    .then((r) => r.data);

export const analyzeImage = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return api
    .post<AnalysisResponse>("/api/v1/analyze/image", form)
    .then((r) => r.data);
};

export const analyzeURL = (url: string, follow_redirects = true) =>
  api
    .post<AnalysisResponse>("/api/v1/analyze/url", { url, follow_redirects })
    .then((r) => r.data);

export const analyzeScenario = (payload: ScenarioAnalysisRequest) =>
  api
    .post<AnalysisResponse>("/api/v1/analyze/scenario", payload)
    .then((r) => r.data);

export const getHistory = (
  page = 1,
  per_page = 20,
  risk_level?: string,
) =>
  api
    .get<HistoryResponse>("/api/v1/history", {
      params: { page, per_page, risk_level },
    })
    .then((r) => r.data);

export const getAnalysis = (id: string) =>
  api.get<AnalysisResponse>(`/api/v1/history/${id}`).then((r) => r.data);

export const submitFeedback = (payload: FeedbackRequest) =>
  api.post<FeedbackResponse>("/api/v1/feedback", payload).then((r) => r.data);

export const getStats = () =>
  api.get<StatsResponse>("/api/v1/history/stats").then((r) => r.data);

export const checkHealth = () =>
  api.get<HealthResponse>("/api/v1/health").then((r) => r.data);
