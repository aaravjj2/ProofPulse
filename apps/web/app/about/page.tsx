import { Shield, Github, ExternalLink } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          {/* Hero */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-2xl mb-4">
              <Shield size={32} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              About ProofPulse
            </h1>
            <p className="text-gray-500 mt-2">
              Evidence-first scam detection you can actually trust.
            </p>
          </div>

          {/* What */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">What is ProofPulse?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ProofPulse is an AI-powered trust analysis tool that helps you
              evaluate suspicious messages, screenshots, and links. Instead of
              giving you a single yes/no answer, ProofPulse provides an
              evidence-based risk score with labeled signals, weighted
              indicators, and actionable recommendations.
            </p>
          </div>

          {/* How */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">How does it work?</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                Submit text, a screenshot, or a URL to the analysis engine.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                Our AI model scans for urgency patterns, suspicious links,
                impersonation signals, and social engineering tactics.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                You receive a risk score (0-100), labeled evidence, and concrete
                next steps.
              </li>
            </ul>
          </div>

          {/* Who */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Who is it for?</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              ProofPulse is built for anyone who encounters suspicious content
              online -- students, marketplace buyers and sellers, parents, and
              everyday internet users. If you have ever wondered whether a
              message is a scam, ProofPulse can help you decide before you
              click, pay, or reply.
            </p>
          </div>

          {/* Privacy */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
            <h2 className="text-lg font-bold text-gray-900">Privacy</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Submitted content is processed securely and is not shared with
              third parties. Analysis history is stored to provide feedback
              loops and improve detection accuracy over time.
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Github size={16} />
              Source Code
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
