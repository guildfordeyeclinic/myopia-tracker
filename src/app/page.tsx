"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InsightCards } from "@/components/InsightCards";
import { MyopiaTypesExplainer } from "@/components/MyopiaTypesExplainer";
import {
  MeasurementForm,
  type FormValues,
} from "@/components/MeasurementForm";
import { PercentileChart } from "@/components/PercentileChart";
import { usePatientSession } from "@/components/PatientSessionProvider";
import { PrintReport, printGraph } from "@/components/PrintReport";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CLINIC_NAME, CLINIC_URL, getReference } from "@/data/references";
import { applyHomeForm, toHomeForm } from "@/lib/session/patient";
import { meanKToRadiusMm } from "@/lib/al/alcr";
import { analyzeMeasurement } from "@/lib/al/analyze";
import type { AnalysisResult } from "@/lib/al/types";

const demoForm: FormValues = {
  age: "9.5",
  sex: "male",
  ethnicity: "east_asian",
  alOd: "24.50",
  alOs: "24.35",
  crMode: "radius",
  cornealOd: "7.80",
  cornealOs: "7.78",
  cornealSteepOd: "",
  cornealFlatOd: "",
  cornealSteepOs: "",
  cornealFlatOs: "",
  ltOd: "3.45",
  ltOs: "3.42",
};

function str(v: string | undefined | null): string {
  return (v ?? "").trim();
}

function parseOptionalCornea(
  raw: string | undefined | null,
  mode: "radius" | "k",
  eye: string
): number | undefined | { error: string } {
  const t = str(raw);
  if (t === "") return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) {
    return { error: `${eye} corneal value looks invalid.` };
  }
  const radiusMm = mode === "k" ? meanKToRadiusMm(n) : n;
  if (!Number.isFinite(radiusMm) || radiusMm < 6 || radiusMm > 10) {
    return {
      error: `${eye} corneal radius should be about 7–9 mm (or convert mean K correctly).`,
    };
  }
  return radiusMm;
}

function parseOptionalLt(
  raw: string | undefined | null,
  eye: string
): number | undefined | { error: string } {
  const t = str(raw);
  if (t === "") return undefined;
  const n = Number(t);
  if (!Number.isFinite(n) || n < 2 || n > 6) {
    return { error: `${eye} lens thickness should be about 2–6 mm.` };
  }
  return n;
}

function parseForm(values: FormValues): AnalysisResult | { error: string } {
  const age = Number(values.age);
  const alOd = Number(values.alOd);
  const alOs = Number(values.alOs);

  if (!Number.isFinite(age) || age < 3 || age > 25) {
    return { error: "Enter a valid age (years, 3–18 recommended)." };
  }
  if (!Number.isFinite(alOd) || alOd < 18 || alOd > 32) {
    return { error: "Enter a valid right eye axial length (mm)." };
  }
  if (!Number.isFinite(alOs) || alOs < 18 || alOs > 32) {
    return { error: "Enter a valid left eye axial length (mm)." };
  }

  const crOd = parseOptionalCornea(values.cornealOd, values.crMode ?? "radius", "OD");
  if (crOd && typeof crOd === "object" && "error" in crOd) return crOd;
  const crOs = parseOptionalCornea(values.cornealOs, values.crMode ?? "radius", "OS");
  if (crOs && typeof crOs === "object" && "error" in crOs) return crOs;

  const ltOd = parseOptionalLt(values.ltOd, "OD");
  if (ltOd && typeof ltOd === "object" && "error" in ltOd) return ltOd;
  const ltOs = parseOptionalLt(values.ltOs, "OS");
  if (ltOs && typeof ltOs === "object" && "error" in ltOs) return ltOs;

  return analyzeMeasurement({
    age,
    sex: values.sex,
    ethnicity: values.ethnicity,
    alOd,
    alOs,
    cornealRadiusOdMm: crOd as number | undefined,
    cornealRadiusOsMm: crOs as number | undefined,
    lensThicknessOdMm: ltOd as number | undefined,
    lensThicknessOsMm: ltOs as number | undefined,
  });
}

export default function HomePage() {
  const { patient, setPatient, clearPatient } = usePatientSession();
  const form = toHomeForm(patient);
  const setForm = (next: FormValues) =>
    setPatient((prev) => applyHomeForm(prev, next));
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ref = useMemo(
    () => getReference(form.ethnicity),
    [form.ethnicity]
  );

  const run = (values: FormValues = form) => {
    const out = parseForm(values);
    if ("error" in out) {
      setError(out.error);
      setResult(null);
      return;
    }
    setError(null);
    setResult(out);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!result) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        printGraph(result);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <aside className="no-print rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-slate-900">
              Enter measurement
            </h2>
            <MeasurementForm
              values={form}
              onChange={(next) => {
                setForm(next);
              }}
              onSubmit={() => run()}
              onDemo={() => {
                setForm(demoForm);
                run(demoForm);
              }}
              onClear={() => {
                if (
                  !window.confirm(
                    "Clear all saved measurement data from this browser?"
                  )
                ) {
                  return;
                }
                clearPatient();
                setResult(null);
                setError(null);
              }}
            />
            {error && (
              <p className="mt-3 text-sm text-red-700" role="alert">
                {error}
              </p>
            )}
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Axial length percentile graph
                  </h2>
                  <p className="text-xs text-slate-500">
                    {result
                      ? `${ref.label} · ${result.input.sex === "male" ? "Male" : "Female"} · age ${result.ageClamped}`
                      : "Enter values and click Show on graph"}
                  </p>
                </div>
                {result && (
                  <button
                    type="button"
                    onClick={() => printGraph(result)}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Print graph
                  </button>
                )}
              </div>

              {result ? (
                <PercentileChart
                  age={result.ageClamped}
                  sex={result.input.sex}
                  ethnicity={result.input.ethnicity}
                  alOd={result.input.alOd}
                  alOs={result.input.alOs}
                  untreatedOd={result.od.untreatedAlAt18}
                  untreatedOs={result.os.untreatedAlAt18}
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center text-sm text-slate-500">
                  Your OD / OS points will appear on the ethnicity- and
                  sex-specific growth chart here.
                </div>
              )}
            </div>

            {result && <InsightCards result={result} />}
          </section>
        </div>

        <MyopiaTypesExplainer />

        <section className="no-print mt-8 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 leading-relaxed shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">
            Sources & methods
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Clinical framing:{" "}
              <a
                className="text-teal-800 underline underline-offset-2 hover:text-teal-950"
                href="https://bc.doctorsofoptometry.ca/news/axial-length-an-essential-for-myopia-management/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Poon N. Axial Length: An Essential for Myopia Management. BC
                Doctors of Optometry.
              </a>
            </li>
            <li>
              European curves: Tideman JWL, et al. Axial length growth and the
              risk of developing myopia in European children.{" "}
              <em>Acta Ophthalmol.</em> 2018;96(3):301-309. (P25/P50/P75 anchors;
              intermediate ages interpolated; outer percentiles estimated.)
            </li>
            <li>
              East Asian curves: Sanz Diez P, et al. LMS parameters, percentile,
              and Z-score growth curves for axial length in Chinese
              schoolchildren in Wuhan. <em>Sci Rep.</em> 2022;12:4850. Ages 6–15
              from published LMS tables; 16–18 lightly extended for display.
            </li>
            <li>
              Also related: Diez et al. 2019 growth curves; He et al. 2023
              Chinese AL/AL-CR percentiles; IMI clinical management guidelines.
            </li>
            <li>
              Crystalline lens power:{" "}
              <a
                className="text-teal-800 underline underline-offset-2 hover:text-teal-950"
                href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4646557/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Hernandez VM, et al. Calculation of crystalline lens power using
                a modification of the Bennett method. Biomed Opt Express.
                2015;6(11):4501–4515
              </a>{" "}
              (PMC4646557). Based on Bennett AG (1988); thin-lens position and{" "}
              <em>b</em> coefficient per Eqs. 16–18. Remaining buffer is judged
              with age-adjusted minima (≤ +18.5 D at 6–9 years, ≤ +17.0 D at
              10–13, ≤ +15.5 D at 14–18). Use the{" "}
              <Link
                href="/bennett"
                className="text-teal-800 underline underline-offset-2 hover:text-teal-950"
              >
                Bennett buffer calculator
              </Link>
              .
            </li>
          </ul>
          <p className="mt-3 text-xs text-slate-500">
            Using the wrong ethnicity reference can under- or over-estimate
            risk. Choose the chart that best matches the child&apos;s background
            and discuss with a clinician. This site is provided for educational
            use in association with{" "}
            <a
              href={CLINIC_URL}
              className="text-teal-800 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CLINIC_NAME}
            </a>
            .
          </p>
        </section>

        <div className="no-print mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Not a diagnosis.</strong> This calculator plots published
          population percentile charts for education and discussion with an
          optometrist or ophthalmologist. It does not replace clinical care or
          optical biometry interpretation.
        </div>
      </main>

      {result && <PrintReport result={result} />}
      <SiteFooter />
    </div>
  );
}
