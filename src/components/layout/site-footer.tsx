import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const FOOTER_LINKS = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/companies", label: "Companies" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/safety", label: "Safety" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-navy)]/10 bg-[var(--color-navy)] text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Logo className="text-white" />
          <p className="mt-3 text-sm leading-6 text-white/75">
            See opportunity. Find your future. VISION connects employers and job
            seekers across Uganda, with room to grow internationally.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 text-sm">
            {FOOTER_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-white/60 sm:px-6">
          © 2026 VISION. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
