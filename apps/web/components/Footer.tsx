export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 dark:border-gray-800 py-6 mt-16">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Don&apos;t click, pay, or reply until you check.
        </p>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-1">
          ProofPulse &copy; {new Date().getFullYear()} &middot; Evidence-first scam analysis
        </p>
      </div>
    </footer>
  );
}
