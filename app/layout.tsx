import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExpenseTracker - Manage Your Monthly Spending",
  description: "A simple monthly expense tracker to help you monitor and control your spending habits",
  keywords: "expense tracker, budget, finance, spending, money management, monthly expenses",
  authors: [{ name: "ExpenseTracker" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
  openGraph: {
    title: "ExpenseTracker - Manage Your Monthly Spending",
    description: "Track, analyze and control your monthly expenses with ease",
    url: "https://expense-tracker.app",
    siteName: "ExpenseTracker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExpenseTracker - Manage Your Monthly Spending",
    description: "Track, analyze and control your monthly expenses with ease",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}