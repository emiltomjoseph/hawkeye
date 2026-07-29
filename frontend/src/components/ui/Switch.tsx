/**
 * @file Switch.tsx
 * @description Accessible toggle switch component for binary preferences and settings.
 *
 * @example
 * ```tsx
 * <Switch checked={enabled} onChange={setEnabled} label="Email Notifications" />
 * ```
 */

import React, { useId } from "react";

export interface SwitchProps {
  /** Current checked state */
  checked: boolean;
  /** Callback fired when switch state changes */
  onChange: (checked: boolean) => void;
  /** Visible label text next to switch */
  label?: string;
  /** Subtitle or helper description text */
  description?: string;
  /** Disables toggle interaction */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: SwitchProps) {
  const switchId = useId();

  function handleClick() {
    if (!disabled) {
      onChange(!checked);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div className={`flex items-start justify-between gap-4 py-2 ${className}`}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={switchId}
              onClick={handleClick}
              className="font-body text-sm font-medium text-bone cursor-pointer select-none"
            >
              {label}
            </label>
          )}
          {description && (
            <span className="font-body text-xs text-feather/70 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || "Toggle preference"}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-talon focus-visible:ring-offset-2 focus-visible:ring-offset-deep
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? "bg-talon" : "bg-raised border-border"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-md transition duration-200 ease-in-out
            ${checked ? "translate-x-5 bg-deep" : "translate-x-0 bg-feather/60"}
          `}
        />
      </button>
    </div>
  );
}
