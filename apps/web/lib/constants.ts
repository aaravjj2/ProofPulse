/** Demo scenario fixtures for ProofPulse MVP. */

import type { DemoScenario } from "./types";

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "phishing-bank",
    title: '"Bank Account Locked" Phishing Text',
    description: "A classic phishing SMS claiming your bank account is locked and urging immediate action.",
    inputMode: "text",
    source: "sms",
    category: "phishing",
    content:
      "URGENT: Your Chase bank account has been locked due to suspicious activity. Verify your identity immediately to restore access. Click here: https://secure-chase-verify.tk/login. Failure to verify within 24 hours will result in permanent account closure. Reply STOP to opt out.",
  },
  {
    id: "job-scam",
    title: '"Instant Internship Offer" Recruiter Message',
    description: "A too-good-to-be-true job offer with no experience required and guaranteed high pay.",
    inputMode: "text",
    source: "email",
    category: "job_scam",
    content:
      "Hi! I'm Sarah from Global Talent Solutions. We found your resume online and would like to offer you an immediate hire as a Remote Marketing Assistant. No experience needed! Earn $45/hour working from home. To get started, please pay the $99 training fee and send your SSN for background check processing. This position fills fast - respond within 2 hours to secure your spot!",
  },
  {
    id: "payment-scam",
    title: '"Payment Pending" Notification',
    description: "A fake payment notification claiming a transaction needs verification.",
    inputMode: "text",
    source: "sms",
    category: "payment_scam",
    content:
      "PayPal: Your payment of $349.99 to Electronics-World is pending. If you did not authorize this transaction, click here immediately to cancel: http://paypal-verify-payment.xyz/cancel. Your refund will be processed within 24 hours. Act now to prevent charges.",
  },
  {
    id: "impersonation-ceo",
    title: '"CEO Urgent Request" Email',
    description: "An impersonation attack pretending to be a company executive.",
    inputMode: "text",
    source: "email",
    category: "impersonation",
    content:
      "Hi, this is urgent. I'm in a meeting and need you to purchase 5 Google Play gift cards at $200 each for a client presentation. Please scratch off the back and send me photos of the codes immediately. I'll reimburse you later today. Don't tell anyone about this - it's a surprise. - CEO (sent from mobile)",
  },
  {
    id: "suspicious-url",
    title: "Typosquatting Bank URL",
    description: "A URL designed to look like a legitimate bank website but with subtle differences.",
    inputMode: "url",
    source: "other",
    category: "phishing",
    content: "https://secure-bankofamerica-login.tk/verify-account",
  },
  {
    id: "safe-message",
    title: "Legitimate Shipping Notification",
    description: "A genuine-looking shipping update from a real retailer.",
    inputMode: "text",
    source: "email",
    category: "safe",
    content:
      "Your Amazon order #112-3456789-0012345 has shipped! Track your package at amazon.com/orders. Estimated delivery: March 15-17. If you have questions, visit our Help page. To manage your delivery preferences or unsubscribe from shipping notifications, visit your account settings.",
  },
  {
    id: "crypto-scam",
    title: '"Double Your Bitcoin" Scam',
    description: "A cryptocurrency scam promising unrealistic returns.",
    inputMode: "text",
    source: "chat",
    category: "payment_scam",
    content:
      "🚀 EXCLUSIVE OFFER: Send 0.5 BTC to our wallet and receive 2.0 BTC back within 1 hour! Elon Musk approved! Limited time only - first 100 participants guaranteed. Wallet: 1A2b3C4d5E6F. Act fast, this opportunity expires tonight! Already 847 people earned big! Don't miss out!!!",
  },
  {
    id: "tech-support",
    title: '"Microsoft Support" Call Scam',
    description: "A fake tech support message claiming your computer is infected.",
    inputMode: "text",
    source: "other",
    category: "impersonation",
    content:
      "MICROSOFT SECURITY ALERT: Your computer has been compromised! We detected 47 viruses on your system. Call our tech support team immediately at 1-800-555-HACK to prevent data loss. Do NOT turn off your computer. Our certified Microsoft technicians are standing by 24/7. Reference case #MS-2024-URGENT.",
  },
];

export const RISK_COLORS: Record<string, string> = {
  safe: "#22c55e",
  low: "#84cc16",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export const RISK_BG_COLORS: Record<string, string> = {
  safe: "bg-green-50 border-green-200",
  low: "bg-lime-50 border-lime-200",
  medium: "bg-yellow-50 border-yellow-200",
  high: "bg-orange-50 border-orange-200",
  critical: "bg-red-50 border-red-200",
};

export const CATEGORY_LABELS: Record<string, string> = {
  phishing: "Phishing",
  job_scam: "Job Scam",
  payment_scam: "Payment Scam",
  impersonation: "Impersonation",
  misinformation: "Misinformation",
  malware: "Malware",
  social_engineering: "Social Engineering",
  safe: "Safe",
  unknown: "Unknown",
};
