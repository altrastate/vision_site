"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Something went wrong</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-charcoal)]/75">
        The page could not be loaded. Try again. If this continues, check the
        application logs.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </main>
  );
}
