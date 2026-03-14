"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, Search, Clock, Info } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/analyze", label: "Analyze", icon: Search },
  { href: "/history", label: "History", icon: Clock },
  { href: "/about", label: "About", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="ProofPulse home">
          <Shield size={24} className="text-blue-600" />
          <span className="font-bold text-lg text-gray-900">ProofPulse</span>
        </Link>

        <div className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
