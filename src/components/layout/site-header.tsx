"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import { signOutAction } from "@/features/auth/actions";
import type { AuthenticatedUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const PUBLIC_NAV = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

const SEEKER_NAV = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/seeker/profile", label: "Profile" },
  { href: "/seeker/settings", label: "Settings" },
];

type SiteHeaderProps = {
  user?: AuthenticatedUser | null;
};

export function SiteHeader({ user = null }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEmployer = user?.roles.includes("employer") ?? false;

  const authNav = user
    ? [...SEEKER_NAV, ...(isEmployer ? [{ href: "/employer/dashboard", label: "Employer" }] : [])]
    : PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-navy)]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[4.25rem] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary">
          {authNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]",
                pathname === item.href
                  ? "text-[var(--color-navy)]"
                  : "text-[var(--color-navy)]/75 hover:text-[var(--color-navy)]",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm font-medium text-[var(--color-navy)]/80 hover:text-[var(--color-navy)]"
              >
                Sign out
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[var(--color-navy)]/80 hover:text-[var(--color-navy)]"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex h-9 items-center rounded-md bg-[var(--color-cyan)] px-3 text-sm font-medium text-[var(--color-navy)] hover:bg-[#33ceff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
              >
                Create Account
              </Link>
            </>
          )}
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-navy)] md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          <span className="sr-only">Toggle navigation</span>
        </button>
      </div>
      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-[var(--color-navy)]/10 bg-white px-4 py-4 md:hidden"
          aria-label="Mobile"
        >
          <ul className="flex flex-col gap-3">
            {authNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-2 text-sm font-medium text-[var(--color-navy)]"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              {user ? (
                <form action={signOutAction}>
                  <button type="submit" className="py-2 text-sm font-medium text-[var(--color-navy)]">
                    Sign out
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/auth/login" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setOpen(false)}>
                    Create Account
                  </Link>
                </div>
              )}
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
