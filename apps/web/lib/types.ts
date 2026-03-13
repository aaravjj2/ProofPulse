/** ProofPulse shared types matching the API response schema. */

export interface Evidence {
  type: string;
  value: string;
  reason: string;
}

export interface AnalysisResult {
  id: string;
  risk_score: number;
  risk_label: "safe" | "low" | "medium" | "high" | "critical";
  category: string;
  confidence: number;
  flags: string[];
  evidence: Evidence[];
  explanation: string;
  next_steps: string[];
  safe_reply: string | null;
  normalized_text: string | null;
  ocr_text: string | null;
  ocr_confidence: number | null;
  timestamp: string;
}

export interface HistoryEntry {
  id: string;
  input_type: string;
  category: string;
  risk_score: number;
  risk_label: string;
  timestamp: string;
  summary: string;
}

export type InputMode = "text" | "image" | "url";

export type SourceType = "email" | "sms" | "chat" | "other";

export interface DemoScenario {
  id: string;
  title: string;
  description: string;
  inputMode: InputMode;
  content: string;
  source: SourceType;
  category: string;
}
