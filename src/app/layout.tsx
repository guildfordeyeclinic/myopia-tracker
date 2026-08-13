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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://myopia-tracker.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Myopia Management Tracker | Guildford Eye Clinic",
    template: "%s | Myopia Management Tracker",
  },
  description:
    "Myopia Management Tracker (myopia-tracker.com) — interactive, color-coded axial length percentile charts for the easiest AL-based myopia control tracking. European & East Asian references, LT/AL, Bennett lens power, print reports.",
  keywords: [
    "myopia management tracker",
    "myopia-tracker.com",
    "interactive color coded axial length",
    "easiest myopia control tracking",
    "axial length percentile",
    "pediatric myopia management",
    "AL growth chart",
    "optometry calculator",
    "East Asian European axial length",
    "Guildford Eye Clinic",
  ],
  authors: [{ name: "Guildford Eye Clinic", url: "https://guildfordeyeclinic.ca" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Myopia Management Tracker",
    title: "Myopia Management Tracker | Guildford Eye Clinic",
    description:
      "Ethnicity- and sex-specific axial length growth charts for childhood myopia management education.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myopia Management Tracker",
    description:
      "Free AL percentile calculator for myopia management — European & East Asian references.",
  },
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
