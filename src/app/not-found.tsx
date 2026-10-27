import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <h1 className="font-display text-3xl text-[var(--color-navy)]">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--color-charcoal)]/75">
        This page is not available. It may have been moved, or the job or company is not
        publicly listed.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-md bg-[var(--color-navy)] px-4 text-sm font-medium text-white"
        >
          Back to home
        </Link>
        <Link
          href="/jobs"
          className="inline-flex h-11 items-center rounded-md border border-[var(--color-navy)]/15 px-4 text-sm font-medium text-[var(--color-navy)]"
        >
          Find jobs
        </Link>
      </div>
    </main>
  );
}
