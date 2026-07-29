/**
 * @file Card.tsx
 * @description Flexible container surface with dark theme tokens, border, padding variants, and sub-components.
 *
 * @example
 * ```tsx
 * <Card hover padding="md">
 *   <Card.Header title="Security Overview" subtitle="SCAN::001" />
 *   <Card.Body>Content here...</Card.Body>
 *   <Card.Footer>Footer action</Card.Footer>
 * </Card>
 * ```
 */

import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Internal padding scale */
  padding?: "none" | "sm" | "md" | "lg";
  /** Enables hover border accent and subtle elevation effect */
  hover?: boolean;
  /** Card body content */
  children: React.ReactNode;
}

const paddingMap = {
  none: "p-0",
  sm: "p-3.5",
  md: "p-5",
  lg: "p-7",
};

export function Card({
  padding = "md",
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`
        rounded-lg border border-white/[0.08] bg-gradient-to-b from-[#101622] to-[#0b0e14] shadow-lg shadow-black/60 transition-all
        ${paddingMap[padding]}
        ${hover ? "hover:border-cyan/30 hover:shadow-xl hover:shadow-cyan/5 hover:from-[#121a2a] hover:to-[#0d111a] cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card Sub-components ── */

export interface CardHeaderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** Main section title */
  title?: React.ReactNode;
  /** Eyebrow label or subtitle text */
  subtitle?: React.ReactNode;
  /** Right-aligned slot (e.g. badge or action icon) */
  action?: React.ReactNode;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className = "",
  children,
  ...props
}: CardHeaderProps) {
  return (
    <div
      className={`flex items-start justify-between gap-4 pb-3 border-b border-border/50 mb-4 ${className}`}
      {...props}
    >
      <div>
        {subtitle && (
          <p className="font-mono text-xs text-feather/60 tracking-wider uppercase mb-0.5">
            {subtitle}
          </p>
        )}
        {title && (
          <h3 className="font-display text-lg text-bone tracking-wide">
            {title}
          </h3>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardBody({ className = "", children, ...props }: CardBodyProps) {
  return (
    <div className={`font-body text-sm text-feather/90 ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className = "", children, ...props }: CardFooterProps) {
  return (
    <div
      className={`pt-4 mt-4 border-t border-border/50 flex items-center justify-between gap-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
