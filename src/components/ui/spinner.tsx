import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-[var(--color-navy)]/20 border-t-[var(--color-navy)]",
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
