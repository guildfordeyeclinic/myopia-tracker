import Link from "next/link";
import { CLINIC_NAME, CLINIC_URL } from "@/data/references";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          Educational axial length tool · Not medical advice · ©{" "}
          {new Date().getFullYear()}
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1" aria-label="Footer">
          <Link href="/" className="font-medium text-teal-800 hover:underline">
            Calculator
          </Link>
          <Link
            href="/bennett"
            className="font-medium text-teal-800 hover:underline"
          >
            Bennett buffer
          </Link>
          <Link
            href="/about"
            className="font-medium text-teal-800 hover:underline"
          >
            About
          </Link>
          <a
            href={CLINIC_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-teal-800 hover:underline"
          >
            Visit {CLINIC_NAME}
          </a>
        </nav>
      </div>
    </footer>
  );
}
