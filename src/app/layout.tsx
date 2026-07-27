import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { ProgressProvider } from "@/components/progress/ProgressProvider";
import "./globals.css";

// Display: a wonky, high-contrast workbook serif. The SOFT/WONK axes are what
// give headings their letterpress character (see --font-display in globals).
const display = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-display-face",
  display: "swap",
});

const body = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Used for index labels and for IPA, where a monospaced rhythm helps students
// compare /ɪd/, /t/ and /d/ side by side.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "English Exam Trainer — Your goal: 10/10",
  description:
    "Interactive trainer for a basic written English exam: ordinals, dates, years, past verbs, -ed pronunciation, was/were and WH questions.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1ece0" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0e15" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${body.variable} ${display.variable} ${mono.variable} h-full`}
    >
      <body className="min-h-dvh antialiased">
        <ProgressProvider>{children}</ProgressProvider>
      </body>
    </html>
  );
}
