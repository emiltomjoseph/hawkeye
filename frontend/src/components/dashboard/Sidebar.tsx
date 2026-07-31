"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Plus,
  Clock,
  FileText,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { sidebarNavItems, mockUser } from "@/lib/mock-dashboard";
import { getUser, clearUser, getInitials, UserData } from "@/lib/user-store";

const iconMap: Record<string, React.ElementType> = {
  Home,
  Plus,
  Clock,
  FileText,
  Settings,
};

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

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

  /* ── Escape key dismisses mobile drawer ── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        onMobileClose();
      }
    },
    [mobileOpen, onMobileClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* ── Focus trap: focus first element when drawer opens ── */
  useEffect(() => {
    if (mobileOpen && firstFocusableRef.current) {
      firstFocusableRef.current.focus();
    }
  }, [mobileOpen]);

  /* ── Auto-close drawer on route change ── */
  useEffect(() => {
    if (mobileOpen) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  /* ── Lock body scroll on mobile open ── */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    return pathname === href;
  }

  /* ── Shared nav content ── */
  const navContent = (isMobile: boolean) => {
    const showLabels = isMobile || !collapsed;

    return (
      <>
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 pt-6 pb-5 ${!showLabels ? "justify-center px-0" : ""}`}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            className="text-neon shrink-0"
          >
            <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="1.5" fill="currentColor" />
            <line x1="14" y1="0" x2="14" y2="6" stroke="currentColor" strokeWidth="1.5" />
            <line x1="14" y1="22" x2="14" y2="28" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" />
            <line x1="22" y1="14" x2="28" y2="14" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          {showLabels && (
            <span className="font-display text-lg text-bone tracking-wide">
              HAWKEYE
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 space-y-1" aria-label="Dashboard navigation">
          {sidebarNavItems.map((item) => {
            const Icon = iconMap[item.icon] ?? Home;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={isMobile ? onMobileClose : undefined}
                className={`
                  flex items-center gap-3 rounded-md min-h-[44px] px-3 py-2.5 text-sm font-body transition-colors relative
                  ${active
                    ? "text-neon bg-neon/10 border-l-[3px] border-neon ml-0 pl-[9px] font-medium"
                    : "text-feather hover:text-bone hover:bg-bone/5 border-l-[3px] border-transparent ml-0 pl-[9px]"
                  }
                  ${!showLabels ? "justify-center px-0 pl-0 border-l-0" : ""}
                `}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
                {showLabels && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className={`border-t border-border px-3 py-4 relative z-20 bg-raised ${!showLabels ? "flex flex-col items-center px-0" : ""}`}>
          <div className={`flex items-center gap-2.5 ${!showLabels ? "justify-center" : ""}`}>
            {/* Avatar initials */}
            <div className="w-8 h-8 rounded-full bg-neon/10 border border-neon/20 flex items-center justify-center shrink-0">
              <span className="font-mono text-xs text-neon">
                {userInitials}
              </span>
            </div>
            {showLabels && (
              <div className="min-w-0 flex-1">
                <p className="font-body text-sm text-bone truncate">
                  {userData.name}
                </p>
                <p className="font-mono text-xs text-feather/60 truncate">
                  {userData.email}
                </p>
              </div>
            )}
          </div>
          <Link
            href="/login"
            onClick={() => {
              if (isMobile) onMobileClose();
              clearUser();
            }}
            className={`
              flex items-center gap-2 mt-3 text-feather hover:text-critical transition-colors text-sm font-body cursor-pointer w-full
              ${!showLabels ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            {showLabels && <span>Sign Out</span>}
          </Link>
        </div>
      </>
    );
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className={`
          hidden lg:flex flex-col shrink-0 bg-raised border-r border-border h-screen sticky top-0 transition-all duration-200 z-30
          ${collapsed ? "w-16" : "w-60"}
        `}
        aria-label="Sidebar"
      >
        {navContent(false)}
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-raised border border-border flex items-center justify-center text-feather hover:text-bone transition-colors cursor-pointer z-10"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </aside>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-deep/80 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div
            ref={drawerRef}
            className="relative flex flex-col w-64 max-w-[80vw] bg-raised border-r border-border h-full animate-slide-in"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            {/* Close button */}
            <button
              ref={firstFocusableRef}
              onClick={onMobileClose}
              className="absolute top-4 right-3 p-1 text-feather hover:text-bone transition-colors cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" strokeWidth={1.5} />
            </button>

            {navContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
