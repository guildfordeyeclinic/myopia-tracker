import Link from "next/link";
import { CLINIC_NAME, CLINIC_URL } from "@/data/references";

export function SiteHeader({
  title = "Myopia management tracker",
  subtitle = "Axial length percentile chart",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            {subtitle}
          </p>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h1>
          <nav
            className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm"
            aria-label="Main"
          >
            <Link
              href="/"
              className="font-medium text-teal-800 hover:underline"
            >
              Calculator
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
              className="font-medium text-slate-600 hover:underline"
            >
              {CLINIC_NAME}
            </a>
          </nav>
        </div>
        <a
          href={CLINIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-teal-700 bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          {CLINIC_NAME} →
        </a>
      </div>
    </header>
  );
}
