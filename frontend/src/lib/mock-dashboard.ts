/* ── Dashboard stat types ── */
export interface DashboardStat {
  label: string;
  value: string;
  icon: string; // lucide icon name
  color: "talon" | "critical" | "pass" | "bone";
  trend?: string; // e.g. "↑ 4pts"
}

export const dashboardStats: DashboardStat[] = [
  {
    label: "Total Scans",
    value: "24",
    icon: "Activity",
    color: "talon",
  },
  {
    label: "Avg Security Score",
    value: "68",
    icon: "Shield",
    color: "talon",
    trend: "↑ 4pts",
  },
  {
    label: "Critical Issues",
    value: "7",
    icon: "AlertTriangle",
    color: "critical",
  },
  {
    label: "Last Scan",
    value: "2h ago",
    icon: "Clock",
    color: "bone",
  },
];

/* ── Quick actions ── */
export interface QuickAction {
  label: string;
  href: string;
  icon: string;
  disabled?: boolean;
}

export const quickActions: QuickAction[] = [
  { label: "New Scan", href: "/new-scan", icon: "Plus" },
  { label: "View History", href: "/scan-history", icon: "Clock" },
  { label: "Download Report", href: "#", icon: "Download", disabled: true },
  { label: "Account Settings", href: "/settings", icon: "Settings" },
];

/* ── Sidebar nav items ── */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const sidebarNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "Home" },
  { label: "New Scan", href: "/new-scan", icon: "Plus" },
  { label: "Scan History", href: "/scan-history", icon: "Clock" },
  { label: "Reports", href: "/reports", icon: "FileText" },
  { label: "Settings", href: "/settings", icon: "Settings" },
];

/* ── Mock user ── */
export const mockUser = {
  name: "Alex Mercer",
  initials: "AM",
  email: "alex@hawkeye.dev",
};
