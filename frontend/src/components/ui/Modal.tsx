"use client";

/**
 * @file Modal.tsx
 * @description Accessible dialog overlay component with backdrop click dismiss, Escape key trapping, focus management, and body scroll lock.
 *
 * @example
 * ```tsx
 * <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Scan">
 *   <p>Are you sure you want to re-scan this target?</p>
 * </Modal>
 * ```
 */

import React, { useEffect, useRef, useId, useCallback } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback fired when modal requests closing (Escape key or backdrop click) */
  onClose: () => void;
  /** Dialog title text */
  title?: string;
  /** Dialog content body */
  children: React.ReactNode;
  /** Optional action buttons slot rendered in modal footer */
  footer?: React.ReactNode;
  /** Max width size variant */
  size?: "sm" | "md" | "lg";
  /** Whether clicking the dark backdrop closes the modal (default true) */
  closeOnBackdropClick?: boolean;
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
}: ModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Simple Focus Trap
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);

      // Focus first element or modal container
      setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = modalRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          (firstFocusable || modalRef.current).focus();
        }
      }, 50);
    } else {
      document.body.style.overflow = "";
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-deep/80 backdrop-blur-sm transition-opacity"
        onClick={() => closeOnBackdropClick && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`
          relative w-full ${sizeClasses[size]} max-h-[85vh] flex flex-col bg-raised border border-border rounded-xl shadow-2xl overflow-hidden
          transform transition-all animate-slide-in focus:outline-none
        `}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border shrink-0">
          {title ? (
            <h3
              id={titleId}
              className="font-display text-lg sm:text-xl font-bold text-bone tracking-wide uppercase"
            >
              {title}
            </h3>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 rounded-md text-feather hover:text-bone hover:bg-bone/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-5 sm:px-6 py-5 font-body text-feather/90 text-sm overflow-y-auto flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-raised/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
