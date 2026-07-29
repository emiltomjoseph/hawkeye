/**
 * @file Button.tsx
 * @description Primary action button for Hawkeye. Supports primary (talon), secondary (bordered), and ghost variants with icons and loading states.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" leftIcon={Plus} isLoading={isSubmitting}>
 *   New Scan
 * </Button>
 * ```
 */

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { Spinner } from "./Spinner";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant styling */
  variant?: "primary" | "secondary" | "ghost";
  /** Size scale of button */
  size?: "sm" | "md" | "lg";
  /** Shows inline spinner and disables button when true */
  isLoading?: boolean;
  /** Lucide icon rendered on the left of children */
  leftIcon?: LucideIcon;
  /** Lucide icon rendered on the right of children */
  rightIcon?: LucideIcon;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-neon text-black hover:bg-neon/90 active:bg-neon/80 border border-transparent font-display font-bold tracking-wide shadow-sm hover:shadow-[0_0_20px_rgba(0,255,135,0.35)] transition-all",
  secondary:
    "bg-raised/80 text-bone hover:text-cyan hover:bg-raised border border-border/80 hover:border-cyan/40 font-body font-medium shadow-sm shadow-black/40 transition-all",
  ghost:
    "bg-transparent text-feather hover:text-bone hover:bg-raised/40 border border-transparent font-body font-medium transition-all",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 min-h-[44px] text-xs gap-1.5 rounded-md",
  md: "px-4 py-2.5 min-h-[44px] text-sm gap-2 rounded-lg",
  lg: "px-6 py-3 min-h-[48px] text-base gap-2.5 rounded-lg",
};

const iconSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      children,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none touch-manipulation
          active:scale-[0.98]
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-talon focus-visible:ring-offset-2 focus-visible:ring-offset-deep
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Spinner
            size={size === "lg" ? "md" : "sm"}
            className="text-current"
            label="Loading..."
          />
        ) : (
          LeftIcon && <LeftIcon className={iconSizes[size]} strokeWidth={1.75} />
        )}

        {children && <span>{children}</span>}

        {!isLoading && RightIcon && (
          <RightIcon className={iconSizes[size]} strokeWidth={1.75} />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
