/** ProofPulse types matching the backend API schema. */

export type RiskLevel = "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type InputType = "text" | "image" | "url" | "scenario";
export type EvidenceFlag = "red" | "yellow" | "green";
export type InputMode = "text" | "image" | "url";
export type SourceType = "email" | "sms" | "chat" | "other";

export interface EvidenceItem {
  label: string;
  value: string;
  weight: number;
  flag: EvidenceFlag;
}

export interface AnalysisResponse {
  analysis_id: string;
  risk_score: number;
  risk_level: RiskLevel;
  verdict: string;
  evidence: EvidenceItem[];
  recommendations: string[];
  next_steps: string[];
  confidence: number;
  model_used: string;
  latency_ms: number;
  input_type: InputType;
}

export interface HistoryItem {
  analysis_id: string;
  created_at: string;
  input_type: InputType;
  risk_score: number;
  risk_level: RiskLevel;
  verdict: string;
}

export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  per_page: number;
}

export interface FeedbackRequest {
  analysis_id: string;
  rating: number;
  comment?: string;
  was_actually_scam?: boolean;
}

export interface FeedbackResponse {
  feedback_id: string;
  status: string;
}

export interface HealthResponse {
  status: string;
  db_ok: boolean;
  openai_ok: boolean;
  version: string;
  uptime_seconds: number;
}

export interface StatsResponse {
  total_analyses: number;
  avg_risk_score: number;
  scam_rate_pct: number;
  analyses_by_day: Record<string, number>;
}

export interface ScenarioAnalysisRequest {
  text?: string;
  url?: string;
  image_base64?: string;
  context?: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  inputMode: InputMode;
  content: string;
  source: SourceType;
  category: string;
}

export interface ApiError {
  code: number;
  message: string;
  request_id?: string;
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  SAFE: "text-risk-safe",
  LOW: "text-risk-low",
  MEDIUM: "text-risk-medium",
  HIGH: "text-risk-high",
  CRITICAL: "text-risk-critical",
};

export const RISK_BG: Record<RiskLevel, string> = {
  SAFE: "bg-risk-safe/10 border-risk-safe/30",
  LOW: "bg-risk-low/10 border-risk-low/30",
  MEDIUM: "bg-risk-medium/10 border-risk-medium/30",
  HIGH: "bg-risk-high/10 border-risk-high/30",
  CRITICAL: "bg-risk-critical/10 border-risk-critical/30",
};
