/**
 * @file Input.tsx
 * @description Standard form text input with optional leading icon, label, helper text, and error validation states.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Target URL"
 *   icon={Globe}
 *   placeholder="https://example.com"
 *   error={errors.url}
 * />
 * ```
 */

import React, { forwardRef, useId } from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text displayed above the input field */
  label?: string;
  /** Error message displayed below the input; triggers error border when present */
  error?: string;
  /** Explanatory helper text displayed below input when no error is present */
  helperText?: string;
  /** Lucide icon rendered inside the left side of the input field */
  icon?: LucideIcon;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      id,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-xs text-feather tracking-wide font-medium"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {Icon && (
            <Icon
              className="absolute left-3.5 w-4 h-4 text-feather/50 pointer-events-none"
              strokeWidth={1.75}
            />
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full min-h-[44px] bg-raised/80 text-bone placeholder:text-feather/40 font-body text-sm rounded-lg py-2.5 transition-colors
              border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-deep
              disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-raised/30
              ${Icon ? "pl-10 pr-3.5" : "px-3.5"}
              ${
                error
                  ? "border-critical focus:border-critical focus:ring-critical/30 text-bone"
                  : "border-border hover:border-feather/30 focus:border-talon focus:ring-talon/30"
              }
              ${className}
            `}
            {...props}
          />
        </div>

        {error ? (
          <p className="font-mono text-xs text-critical mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="font-body text-xs text-feather/70 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
