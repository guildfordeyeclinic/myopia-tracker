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
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
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
          </nav>
        </div>
        <a
          href={CLINIC_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-2.5 rounded-xl outline-offset-2 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
        >
          <img
            src="/icon-192.png"
            alt=""
            width={56}
            height={56}
            className="h-12 w-12 rounded-xl sm:h-14 sm:w-14"
          />
          <span className="text-sm font-semibold leading-tight text-slate-800 sm:text-base">
            {CLINIC_NAME}
          </span>
        </a>
      </div>
    </header>
  );
}
