import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VISION — See opportunity. Find your future.",
    template: "%s · VISION",
  },
  description:
    "VISION is a recruitment platform connecting employers with job seekers. Initial market: Uganda.",
  icons: {
    icon: "/images/Vision_Logo_No_Background.png",
    apple: "/images/Vision_Logo_No_Background.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-gray)] text-[var(--color-charcoal)]">
        {children}
      </body>
    </html>
  );
}
