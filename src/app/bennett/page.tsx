import type { Metadata } from "next";
import { BennettLensPower } from "@/components/BennettLensPower";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

const pageTitle = "Bennett lens power & age-adjusted buffer";
const pageDescription =
  "Modified Bennett crystalline lens power calculator with age-adjusted buffer minima: ≤ +18.5 D at ages 6–9, ≤ +17.0 D at 10–13, and ≤ +15.5 D at 14–18.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "Bennett crystalline lens power",
    "age-adjusted lens buffer",
    "pediatric lens power",
    "myopia buffer depleted",
    "Hernandez Bennett method",
    "modified Bennett calculator",
  ],
  alternates: {
    canonical: "/bennett",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    locale: "en_CA",
    siteName: "Myopia Management Tracker",
  },
};

export default function BennettPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader
        title="Bennett lens power"
        subtitle="Age-adjusted buffer calculator"
      />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <BennettLensPower />
      </main>
      <SiteFooter />
    </div>
  );
}
