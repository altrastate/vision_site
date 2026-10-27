"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

type DialogProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Dialog({ open, title, children, onClose }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (open && !node.open) {
      node.showModal();
    } else if (!open && node.open) {
      node.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="w-[min(32rem,calc(100%-2rem))] rounded-xl border border-[var(--color-navy)]/10 bg-white p-6 text-[var(--color-charcoal)] shadow-lg backdrop:bg-[var(--color-navy)]/40"
      onClose={onClose}
    >
      <h2 id={titleId} className="font-display text-xl text-[var(--color-navy)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
      <button
        type="button"
        className="mt-6 text-sm font-medium text-[var(--color-navy)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
        onClick={onClose}
      >
        Close
      </button>
    </dialog>
  );
}
