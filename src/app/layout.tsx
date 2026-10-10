import type { Metadata, Viewport } from "next";
import { Outfit, Newsreader } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "TerraQuest AI — Your Offline AI Companion for the Real World",
  description:
    "Touch Grass, Not Screens. TerraQuest AI uses local open-source AI to prepare you for real-world adventures, identify birds and plants, plan gardens, and encourage you to disconnect.",
  keywords: [
    "outdoor exploration",
    "nature companion",
    "offline AI",
    "plant identification",
    "bird identification",
    "open source AI",
    "touch grass",
    "Ollama",
    "nature journal",
    "screen-free mindfulness",
  ],
  authors: [{ name: "TerraQuest AI Open Source Community" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${newsreader.variable}`}>
      <body className="font-sans antialiased text-nature-950 dark:text-nature-50 selection:bg-emerald-200 dark:selection:bg-emerald-800">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
