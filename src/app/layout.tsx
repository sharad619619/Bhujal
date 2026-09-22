import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bhujal AI — Intelligence Beneath the Surface | Chromium Groundwater Response",
  description:
    "Bhujal AI connects physical bore logs, 3D Kriging advection plumes, and biological phytoremediation to safeguard unseen drinking aquifers in Uttar Pradesh.",
  keywords: [
    "Bhujal AI",
    "groundwater",
    "chromium",
    "hexavalent chromium",
    "remediation",
    "water safety",
    "environmental intelligence",
    "community reporting",
    "Kanpur Dehat",
    "Rania",
    "Uttar Pradesh",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${newsreader.variable} h-full scroll-smooth antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F7FAF8] text-[#0c1f18] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
