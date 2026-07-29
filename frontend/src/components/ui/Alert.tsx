/**
 * @file Alert.tsx
 * @description Contextual alert banner for informational notices, warnings, errors, and system status notifications.
 *
 * @example
 * ```tsx
 * <Alert variant="error" title="Scan Failed" dismissible onDismiss={() => setNotice(null)}>
 *   Target server timed out after 30 seconds.
 * </Alert>
 * ```
 */

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  LucideIcon,
} from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert type controlling theme, default icon, and ARIA role */
  variant?: "info" | "success" | "warning" | "error";
  /** Header title text */
  title?: string;
  /** Optional icon override */
  icon?: LucideIcon;
  /** Enables close button when true or when onDismiss is passed */
  dismissible?: boolean;
  /** Callback fired when user clicks the dismiss button */
  onDismiss?: () => void;
  /** Alert message body */
  children: React.ReactNode;
}

const variantStyles = {
  info: {
    bg: "bg-grid/10",
    border: "border-grid/30",
    text: "text-grid",
    defaultIcon: Info,
    role: "status",
  },
  success: {
    bg: "bg-pass/10",
    border: "border-pass/30",
    text: "text-pass",
    defaultIcon: CheckCircle2,
    role: "status",
  },
  warning: {
    bg: "bg-talon/10",
    border: "border-talon/30",
    text: "text-talon",
    defaultIcon: AlertTriangle,
    role: "alert",
  },
  error: {
    bg: "bg-critical/10",
    border: "border-critical/30",
    text: "text-critical",
    defaultIcon: AlertCircle,
    role: "alert",
  },
};

export function Alert({
  variant = "info",
  title,
  icon: CustomIcon,
  dismissible = false,
  onDismiss,
  children,
  className = "",
  ...props
}: AlertProps) {
  const style = variantStyles[variant];
  const Icon = CustomIcon || style.defaultIcon;
  const isDismissible = dismissible || Boolean(onDismiss);

  return (
    <div
      role={style.role}
      className={`
        flex items-start gap-3 rounded-lg border p-4 font-body text-sm transition-all
        ${style.bg} ${style.border}
        ${className}
      `}
      {...props}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${style.text}`} strokeWidth={1.75} />

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`font-mono text-sm font-semibold mb-1 ${style.text}`}>
            {title}
          </h4>
        )}
        <div className="text-bone/90 leading-relaxed">{children}</div>
      </div>

      {isDismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={`p-1 rounded-md hover:bg-bone/10 transition-colors cursor-pointer shrink-0 ${style.text}`}
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
