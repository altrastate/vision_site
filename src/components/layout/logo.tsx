import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl tracking-tight text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] focus-visible:ring-offset-2",
        className,
      )}
    >
      {/* Static public asset — img avoids next/image hydration mismatches in the client header. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Vision_Logo_No_Background.png"
        alt=""
        width={160}
        height={128}
        className="h-9 w-auto sm:h-11"
      />
      {showWordmark ? (
        <span>
          VISION
          <span className="sr-only"> home</span>
        </span>
      ) : (
        <span className="sr-only">VISION home</span>
      )}
    </Link>
  );
}
