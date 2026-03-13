"use client";

import { useState, useCallback } from "react";
import { Shield, ArrowRight, Eye, FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnalysisInput from "@/components/AnalysisInput";
import ResultCard from "@/components/ResultCard";
import DemoScenarios from "@/components/DemoScenarios";
import HistoryPanel from "@/components/HistoryPanel";
import type { AnalysisResult, DemoScenario, InputMode } from "@/lib/types";

export default function HomePage() {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<{ text: string; mode: InputMode } | null>(null);

  const handleDemoSelect = useCallback((scenario: DemoScenario) => {
    setResult(null);
    setError("");
    setSelectedDemo({ text: scenario.content, mode: scenario.inputMode });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToInput = () => {
    document.getElementById("analyze")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onHistoryToggle={() => setHistoryOpen(true)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 text-center relative">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-6">
              <Shield size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-700">AI-Powered Trust Analysis</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
              ProofPulse
            </h1>
            <p className="text-xl sm:text-2xl text-blue-600 font-semibold mt-2">
              Verify before you trust.
            </p>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Analyze suspicious messages, screenshots, and links in seconds.
              Get evidence-based risk scores, clear red flags, and safe next&nbsp;steps.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <button
                onClick={scrollToInput}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                Check a message
                <ArrowRight size={16} />
              </button>
              <a
                href="#demos"
                className="px-6 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-white hover:border-gray-300 transition-all"
              >
                Try a demo sample
              </a>
            </div>

            {/* Value props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
              {[
                { icon: Eye, text: "Evidence-first scam analysis, not black-box guesses" },
                { icon: FileText, text: "Works on text, screenshots, and links" },
                { icon: Shield, text: "Clear guidance you can act on immediately" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 p-4 bg-white/60 rounded-xl border border-gray-100">
                  <Icon size={20} className="text-blue-600" />
                  <p className="text-sm text-gray-600 text-center">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 bg-white border-y border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-center text-xl font-bold text-gray-900 mb-8">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Submit", desc: "Paste text, upload an image, or submit a link" },
                { step: "2", title: "Analyze", desc: "We analyze language, URLs, and signals for scam patterns" },
                { step: "3", title: "Act", desc: "You get a risk score, red flags, and what to do next" },
              ].map(({ step, title, desc }) => (
                <div key={step} className="text-center">
                  <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                    {step}
                  </div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Input Section */}
        <section id="analyze" className="py-12 px-4">
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <h2 className="text-xl font-bold text-gray-900">Analyze Content</h2>
            <p className="text-sm text-gray-500 mt-1">Paste, upload, or enter a URL below</p>
          </div>

          <AnalysisInput
            onResult={(r) => {
              setResult(r);
              setError("");
            }}
            onError={setError}
            onLoading={setLoading}
            initialText={selectedDemo?.text || ""}
            initialMode={selectedDemo?.mode || "text"}
            key={selectedDemo?.text || "default"}
          />

          {error && (
            <div className="max-w-2xl mx-auto mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="max-w-2xl mx-auto mt-8 text-center">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Analyzing content...
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="mt-8">
              <ResultCard result={result} />
            </div>
          )}
        </section>

        {/* Trust section */}
        <section className="py-12 px-4 bg-white border-y border-gray-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-gray-900">Explainable Results You Can Verify</h2>
            <p className="text-gray-500 mt-2">
              Every alert includes the exact evidence and reasoning behind the risk score.
              No black boxes, no guesswork — just transparency.
            </p>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demos" className="py-12 px-4">
          <DemoScenarios onSelect={handleDemoSelect} />
        </section>

        {/* Social proof */}
        <section className="py-8 px-4 text-center">
          <p className="text-sm text-gray-400 italic">
            Built for students, marketplace sellers, and everyday users who deal with risky messages.
          </p>
        </section>
      </main>

      <Footer />
      <HistoryPanel isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />
    </div>
  );
}
