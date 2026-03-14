import Link from "next/link";
import {
  Shield,
  ArrowRight,
  Eye,
  FileText,
  Zap,
} from "lucide-react";
import Footer from "@/components/Footer";
import DemoScenarios from "@/components/DemoScenarios";

const FEATURES = [
  {
    icon: Eye,
    title: "Evidence-First Analysis",
    description:
      "Every risk score comes with labeled evidence, weighted signals, and clear flags -- no black-box guesses.",
  },
  {
    icon: FileText,
    title: "Multi-Format Input",
    description:
      "Paste text, upload screenshots, or submit a URL. ProofPulse works with whatever you have.",
  },
  {
    icon: Shield,
    title: "Actionable Next Steps",
    description:
      "Get specific recommendations you can act on immediately to protect yourself.",
  },
  {
    icon: Zap,
    title: "Fast Results",
    description:
      "Powered by AI to analyze content in seconds, not minutes. Check before you click.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Submit",
    description: "Paste text, upload an image, or submit a link",
  },
  {
    step: "2",
    title: "Analyze",
    description:
      "We analyze language, URLs, and signals for scam patterns",
  },
  {
    step: "3",
    title: "Act",
    description:
      "You get a risk score, red flags, and what to do next",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-indigo-950 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-1.5 mb-6">
            <Shield size={14} className="text-blue-600" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
              AI-Powered Trust Analysis
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            ProofPulse
          </h1>
          <p className="text-xl sm:text-2xl text-blue-600 font-semibold mt-2">
            Verify before you trust.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Analyze suspicious messages, screenshots, and links in seconds. Get
            evidence-based risk scores, clear red flags, and safe next&nbsp;steps.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/analyze"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              Check a message
              <ArrowRight size={16} />
            </Link>
            <a
              href="#demos"
              className="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
            >
              Try a demo sample
            </a>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-center text-xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            Why ProofPulse?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-shadow"
              >
                <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg shrink-0">
                  <Icon size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Scenarios */}
      <section id="demos" className="py-12 px-4 bg-gray-50 dark:bg-gray-800">
        <DemoScenarios />
      </section>

      {/* Social Proof */}
      <section className="py-8 px-4 text-center">
        <p className="text-sm text-gray-400 italic">
          Built for students, marketplace sellers, and everyday users who deal
          with risky messages.
        </p>
      </section>

      <Footer />
    </div>
  );
}
