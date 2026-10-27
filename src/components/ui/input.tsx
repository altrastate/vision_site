import { type InputHTMLAttributes, forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, type = "text", ...props }, ref) {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-md border border-[var(--color-navy)]/15 bg-white px-3 text-sm text-[var(--color-charcoal)] shadow-sm placeholder:text-[var(--color-charcoal)]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      />
    );
  },
);
