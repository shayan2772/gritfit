import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "GritFit",
  description: "Premium Gym & Running Companion",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GritFit",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { BottomNav } from "@/components/BottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";
import { ThemeProvider } from "@/context/ThemeContext";
import { Onboarding } from "@/components/Onboarding";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${oswald.variable} antialiased bg-background text-foreground select-none overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <Onboarding />
          <main className="min-h-screen pb-24 relative">
            {children}
          </main>
          <InstallPrompt />
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
