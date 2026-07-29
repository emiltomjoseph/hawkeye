"use client";

import Link from "next/link";
import {
  Plus,
  Clock,
  Download,
  Settings,
} from "lucide-react";
import type { QuickAction } from "@/lib/mock-dashboard";

const iconMap: Record<string, React.ElementType> = {
  Plus,
  Clock,
  Download,
  Settings,
};

interface QuickActionCardProps {
  action: QuickAction;
}

export default function QuickActionCard({ action }: QuickActionCardProps) {
  const Icon = iconMap[action.icon] ?? Plus;

  if (action.disabled) {
    return (
      <span
        className="flex items-center gap-3 rounded-lg border border-border bg-raised/50 px-4 py-3.5 opacity-50 cursor-not-allowed"
        aria-disabled="true"
      >
        <Icon className="w-5 h-5 text-feather/40" strokeWidth={1.5} />
        <span className="font-body text-sm text-feather">{action.label}</span>
      </span>
    );
  }

  return (
    <Link
      href={action.href}
      className="flex items-center gap-3 rounded-lg border border-border bg-raised px-4 py-3.5 transition-colors hover:border-cyan hover:bg-cyan/5 group"
    >
      <Icon
        className="w-5 h-5 text-feather/60 group-hover:text-cyan transition-colors"
        strokeWidth={1.5}
      />
      <span className="font-body text-sm text-bone group-hover:text-cyan transition-colors">
        {action.label}
      </span>
    </Link>
  );
}
