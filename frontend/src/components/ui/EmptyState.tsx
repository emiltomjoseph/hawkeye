/**
 * @file EmptyState.tsx
 * @description Centered empty data state card with icon, title, description, and optional call-to-action button.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={FileSearch}
 *   title="No Scans Found"
 *   description="Try adjusting your search filters or start a new scan."
 *   action={<Button variant="primary">New Scan</Button>}
 * />
 * ```
 */

import React from "react";
import { LucideIcon, Crosshair } from "lucide-react";

export interface EmptyStateProps {
  /** Optional icon component displayed at top */
  icon?: LucideIcon;
  /** Primary title message */
  title: string;
  /** Explanatory description text */
  description?: string;
  /** Optional Call-to-Action element (e.g. Button) */
  action?: React.ReactNode;
  /** Additional wrapper CSS classes */
  className?: string;
}

export function EmptyState({
  icon: Icon = Crosshair,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center text-center p-8 lg:p-12
        rounded-lg border border-border border-dashed bg-raised/30
        ${className}
      `}
    >
      <div className="w-12 h-12 rounded-full bg-raised flex items-center justify-center border border-border mb-4">
        <Icon className="w-6 h-6 text-feather/50" strokeWidth={1.5} />
      </div>

      <h3 className="font-display text-lg text-bone tracking-wide uppercase mb-1">
        {title}
      </h3>

      {description && (
        <p className="font-body text-sm text-feather max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
