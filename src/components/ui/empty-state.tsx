import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-[var(--color-navy)]/20 bg-white px-6 py-12 text-center",
        className,
      )}
    >
      <h2 className="font-display text-xl text-[var(--color-navy)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--color-charcoal)]/75">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
