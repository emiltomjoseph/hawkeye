"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, Plus, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { mockUser } from "@/lib/mock-dashboard";
import { getUser, clearUser, getInitials, UserData } from "@/lib/user-store";

interface DashboardNavbarProps {
  onMenuToggle: () => void;
}

export default function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [userData, setUserData] = useState<UserData>({
    name: mockUser.name,
    email: mockUser.email,
  });

  useEffect(() => {
    function loadUser() {
      const user = getUser();
      if (user) {
        setUserData(user);
      }
    }
    loadUser();
    window.addEventListener("user-updated", loadUser);
    return () => window.removeEventListener("user-updated", loadUser);
  }, []);

  const userInitials = getInitials(userData.name);

  /* Close dropdown on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 lg:px-6 bg-raised border-b border-border"
      aria-label="Top navigation"
    >
      {/* Left: mobile menu + page context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center p-2 text-feather hover:text-bone transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Right: new scan + user */}
      <div className="flex items-center gap-3">
        {/* New Scan CTA */}
        <Link
          href="/new-scan"
          className="inline-flex items-center gap-1.5 min-h-[44px] rounded-lg bg-neon px-3.5 py-2 font-display font-bold text-sm text-black hover:bg-neon/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">New Scan</span>
        </Link>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center p-1.5 rounded-lg hover:bg-bone/5 transition-colors cursor-pointer"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <div className="w-7 h-7 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center">
              <span className="font-mono text-[10px] text-neon">
                {userInitials}
              </span>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-feather/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              strokeWidth={2}
            />
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 rounded-lg border border-border bg-raised py-1 shadow-xl shadow-deep/50">
              <div className="px-3 py-2 border-b border-border">
                <p className="font-body text-sm text-bone">{userData.name}</p>
                <p className="font-mono text-xs text-feather/60">{userData.email}</p>
              </div>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-feather hover:text-bone hover:bg-bone/5 transition-colors"
              >
                <User className="w-4 h-4" strokeWidth={1.5} />
                Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-feather hover:text-bone hover:bg-bone/5 transition-colors"
              >
                <Settings className="w-4 h-4" strokeWidth={1.5} />
                Settings
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-feather hover:text-critical hover:bg-critical/5 transition-colors cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  clearUser();
                }}
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
