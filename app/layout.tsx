import type { Metadata } from "next";
import { Grand_Hotel } from "next/font/google";
import type { ReactNode } from "react";

import "./globals.css";

const igScript = Grand_Hotel({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ig-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IntentLoop",
  description: "Session layer prototype — feed first, no overlay on open.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={igScript.variable}>
      <body>{children}</body>
    </html>
  );
}
