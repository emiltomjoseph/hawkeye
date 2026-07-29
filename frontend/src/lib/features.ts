import {
  Globe,
  ShieldCheck,
  FileWarning,
  Cookie,
  FileSearch,
  Cpu,
  Gauge,
  FileDown,
  History,
} from "lucide-react";
import type { ComponentType } from "react";

export interface Feature {
  code: string;
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export const features: Feature[] = [
  {
    code: "SCAN::URL",
    title: "Website Security Scan",
    description: "Submit any public URL for a full security assessment.",
    icon: Globe,
  },
  {
    code: "SCAN::SSL",
    title: "HTTPS & SSL Analysis",
    description: "Checks certificate validity and TLS configuration.",
    icon: ShieldCheck,
  },
  {
    code: "SCAN::HEADERS",
    title: "Security Headers Check",
    description: "Verifies protective headers like CSP and HSTS.",
    icon: FileWarning,
  },
  {
    code: "SCAN::COOKIES",
    title: "Cookie Security Analysis",
    description: "Flags cookies missing Secure, HttpOnly, or SameSite.",
    icon: Cookie,
  },
  {
    code: "SCAN::ROBOTS",
    title: "robots.txt & sitemap.xml Analysis",
    description: "Reviews for exposed or misconfigured paths.",
    icon: FileSearch,
  },
  {
    code: "SCAN::TECH",
    title: "Technology Detection",
    description: "Identifies the frameworks and tools a site runs on.",
    icon: Cpu,
  },
  {
    code: "SCAN::SCORE",
    title: "Security Score Generation",
    description: "Rolls every finding into one overall score.",
    icon: Gauge,
  },
  {
    code: "SCAN::REPORT",
    title: "PDF Report Generation",
    description: "Export a shareable report of any scan.",
    icon: FileDown,
  },
  {
    code: "SCAN::HISTORY",
    title: "Scan History",
    description: "Revisit past scans and track changes over time.",
    icon: History,
  },
];
