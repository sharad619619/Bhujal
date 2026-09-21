import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AquaShield — Chromium Groundwater Response & Remediation Intelligence Platform",
  description:
    "AquaShield connects environmental data, geospatial intelligence, community reporting and remediation monitoring to help communities and decision-makers respond to contaminated groundwater.",
  keywords: [
    "groundwater",
    "chromium",
    "contamination",
    "remediation",
    "water safety",
    "environmental intelligence",
    "community reporting",
    "Kanpur",
    "Uttar Pradesh",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-stone-50 font-sans text-stone-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
