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
  metadataBase: new URL('https://bhujal.org'),
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Bhujal AI — Intelligence Beneath the Surface",
    description:
      "Bhujal AI connects physical bore logs, 3D Kriging advection plumes, and biological phytoremediation to safeguard unseen drinking aquifers in Uttar Pradesh.",
    siteName: "Bhujal AI",
    images: [
      {
        url: "/logo.png",
        width: 242,
        height: 310,
        alt: "Bhujal AI Official Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Bhujal AI — Intelligence Beneath the Surface",
    description: "Chromium Groundwater Response & Environmental Intelligence",
    images: ["/logo.png"],
  },
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
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
