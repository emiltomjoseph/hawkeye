"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuth = pathname.startsWith("/dashboard");

  const navLinks = isAuth
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/dashboard", label: "History" },
      ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-border bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              className="text-talon"
            >
              <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
              <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="1.5" fill="currentColor" />
              <line x1="14" y1="0" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
              <line x1="14" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="1.5" />
              <line x1="0" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" />
              <line x1="22" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="font-display text-xl text-bone group-hover:text-talon transition-colors">
              Hawkeye
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-body transition-colors ${
                  pathname === link.href
                    ? "text-bone"
                    : "text-feather hover:text-bone"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-3 ml-2">
              <Link
                href="/login"
                className="text-sm font-body text-feather hover:text-bone transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-talon/10 border border-talon/20 px-4 py-1.5 text-sm font-display text-talon hover:bg-talon/20 transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden text-feather hover:text-bone p-2 cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {mobileOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-ink-border py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-body text-feather hover:text-bone transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Link
                href="/login"
                className="text-sm font-body text-feather hover:text-bone transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-talon/10 border border-talon/20 px-4 py-1.5 text-sm font-display text-talon hover:bg-talon/20 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
