"use client";

import { useMemo, useState } from "react";
import { KeratometryInputs } from "@/components/KeratometryInputs";
import { usePatientSession } from "@/components/PatientSessionProvider";
import {
  bennettLensPower,
  kDioptersToRadiusMm,
  lensPowerAgeRule,
  lensPowerInterpretation,
  type BennettResult,
} from "@/lib/al/bennett";
import type { EyeFields, KMode } from "@/lib/session/patient";

type EyeForm = EyeFields;

const inputClass =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20";

function parseEye(
  eye: EyeForm,
  kMode: "radius" | "diopters",
  label: string
):
  | { error: string }
  | {
      seSpectacleD: number;
      alMm: number;
      acdEpiToLensMm: number;
      ltMm: number;
      r1Mm: number;
      cctMm?: number;
    } {
  const seSpectacleD = Number(eye.se);
  const alMm = Number(eye.al);
  const acdEpiToLensMm = Number(eye.acd);
  const ltMm = Number(eye.lt);
  const kRaw = Number(eye.k);

  if (
    ![seSpectacleD, alMm, acdEpiToLensMm, ltMm, kRaw].every((x) =>
      Number.isFinite(x)
    )
  ) {
    return { error: `${label}: fill all required fields with valid numbers.` };
  }
  if (alMm < 18 || alMm > 35) {
    return { error: `${label}: AL should be about 18–35 mm.` };
  }
  if (acdEpiToLensMm < 2 || acdEpiToLensMm > 5.5) {
    return {
      error: `${label}: ACD (epithelium → lens) typically ~2.5–4.5 mm.`,
    };
  }
  if (ltMm < 2 || ltMm > 6) {
    return { error: `${label}: LT typically ~2.5–5.5 mm.` };
  }
  if (acdEpiToLensMm + ltMm >= alMm - 0.5) {
    return { error: `${label}: ACD + LT must be less than AL.` };
  }

  let r1Mm: number;
  if (kMode === "radius") {
    if (kRaw < 6.5 || kRaw > 9.5) {
      return { error: `${label}: mean K radius should be about 7–9 mm.` };
    }
    r1Mm = kRaw;
  } else {
    if (kRaw < 35 || kRaw > 50) {
      return { error: `${label}: mean K power should be about 38–48 D.` };
    }
    r1Mm = kDioptersToRadiusMm(kRaw);
  }

  let cctMm: number | undefined;
  const cctRaw = (eye.cct ?? "").trim();
  if (cctRaw !== "") {
    const c = Number(cctRaw);
    if (!Number.isFinite(c) || c < 0.4 || c > 0.7) {
      return { error: `${label}: CCT typically ~0.45–0.65 mm.` };
    }
    cctMm = c;
  }

  return { seSpectacleD, alMm, acdEpiToLensMm, ltMm, r1Mm, cctMm };
}

function ResultCard({
  label,
  result,
  ageYears,
}: {
  label: string;
  result: BennettResult | null;
  ageYears: number;
}) {
  if (!result) return null;
  const interp = lensPowerInterpretation(result.lensPowerD, ageYears);
  const toneClass =
    interp.tone === "red"
      ? "border-red-300 bg-red-50"
      : interp.tone === "amber"
        ? "border-amber-300 bg-amber-50"
        : interp.tone === "green"
          ? "border-emerald-300 bg-emerald-50"
          : "border-slate-200 bg-slate-50";
  const badgeClass =
    interp.tone === "red"
      ? "bg-red-100 text-red-900"
      : interp.tone === "amber"
        ? "bg-amber-100 text-amber-950"
        : interp.tone === "green"
          ? "bg-emerald-100 text-emerald-900"
          : "bg-slate-200 text-slate-800";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
        {label}
      </h3>
      <p className="mt-2 text-3xl font-bold tabular-nums text-slate-900">
        {result.lensPowerD >= 0 ? "+" : ""}
        {result.lensPowerD.toFixed(2)}{" "}
        <span className="text-lg font-semibold text-slate-600">D</span>
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Absolute crystalline lens power (modified Bennett)
      </p>
      <div className={`mt-3 rounded-lg px-3 py-2 text-sm ${badgeClass}`}>
        <p className="font-semibold">{interp.label}</p>
        <p className="mt-0.5 text-xs font-medium opacity-90">
          {interp.rule.label} · depleted if ≤ +{interp.rule.thresholdD.toFixed(1)}{" "}
          D
        </p>
        <p className="mt-0.5 leading-relaxed opacity-95">{interp.detail}</p>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-slate-600">
        <dt>SE at cornea</dt>
        <dd className="tabular-nums text-right">
          {result.rCornealD.toFixed(2)} D
        </dd>
        <dt>Total corneal power K</dt>
        <dd className="tabular-nums text-right">{result.kD.toFixed(2)} D</dd>
        <dt>Aqueous ACD</dt>
        <dd className="tabular-nums text-right">
          {result.acdAqueousMm.toFixed(2)} mm
        </dd>
        <dt>Vitreous depth</dt>
        <dd className="tabular-nums text-right">
          {result.vitreousDepthMm.toFixed(2)} mm
        </dd>
        <dt>ML (conjugate ratio)</dt>
        <dd className="tabular-nums text-right">{result.ml.toFixed(3)}</dd>
        <dt>b coefficient</dt>
        <dd className="tabular-nums text-right">{result.b.toFixed(3)}</dd>
      </dl>
    </div>
  );
}

function EyeFields({
  title,
  values,
  onChange,
  kMode,
}: {
  title: string;
  values: EyeForm;
  onChange: (next: EyeForm) => void;
  kMode: "radius" | "diopters";
}) {
  const set = (key: keyof EyeForm, v: string) =>
    onChange({ ...values, [key]: v });

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <div>
          <label className="mb-0.5 block text-xs text-slate-600">
            Cycloplegic SE (D)
          </label>
          <input
            type="number"
            step={0.25}
            value={values.se}
            onChange={(e) => set("se", e.target.value)}
            placeholder="e.g. −2.50"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-slate-600">AL (mm)</label>
          <input
            type="number"
            step={0.01}
            value={values.al}
            onChange={(e) => set("al", e.target.value)}
            placeholder="mm"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-slate-600">
            ACD epi→lens (mm)
          </label>
          <input
            type="number"
            step={0.01}
            value={values.acd}
            onChange={(e) => set("acd", e.target.value)}
            placeholder="mm"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-slate-600">LT (mm)</label>
          <input
            type="number"
            step={0.01}
            value={values.lt}
            onChange={(e) => set("lt", e.target.value)}
            placeholder="mm"
            className={inputClass}
          />
        </div>
        <div className="col-span-2 sm:col-span-3">
          <p className="mb-1 text-xs text-slate-600">
            Keratometry — steep + flat auto-fills mean, or type mean only
          </p>
          <KeratometryInputs
            steep={values.kSteep}
            flat={values.kFlat}
            mean={values.k}
            unit={kMode === "radius" ? "mm" : "D"}
            onChange={({ steep, flat, mean }) =>
              onChange({
                ...values,
                kSteep: steep,
                kFlat: flat,
                k: mean,
              })
            }
          />
        </div>
        <div>
          <label className="mb-0.5 block text-xs text-slate-600">
            CCT (mm, optional)
          </label>
          <input
            type="number"
            step={0.001}
            value={values.cct}
            onChange={(e) => set("cct", e.target.value)}
            placeholder="0.55"
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}

export function BennettLensPower() {
  const { patient, setPatient } = usePatientSession();
  const age = patient.age;
  const od = patient.od;
  const os = patient.os;
  const kMode = patient.kMode;
  const setAge = (next: string) =>
    setPatient((prev) => ({ ...prev, age: next }));
  const setOd = (next: EyeForm) =>
    setPatient((prev) => ({ ...prev, od: next }));
  const setOs = (next: EyeForm) =>
    setPatient((prev) => ({ ...prev, os: next }));
  const setKMode = (next: KMode) =>
    setPatient((prev) => ({ ...prev, kMode: next }));
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<{
    od: BennettResult | null;
    os: BennettResult | null;
    ageYears: number;
  } | null>(null);

  const parsedAge = Number(age);
  const ageRule = Number.isFinite(parsedAge)
    ? lensPowerAgeRule(parsedAge)
    : null;

  const fieldFilled = (x: string | undefined | null) =>
    (x ?? "").trim() !== "";

  const hasAnyInput = useMemo(() => {
    const filled = (e: EyeForm) =>
      [e.se, e.al, e.acd, e.lt, e.k].some(fieldFilled);
    return filled(od) || filled(os);
  }, [od, os]);

  const runEye = (eye: EyeForm, label: string) => {
    const p = parseEye(eye, kMode, label);
    if ("error" in p) return p;
    const result = bennettLensPower(p);
    if (!result) {
      return {
        error: `${label}: could not compute lens power (check biometry).`,
      };
    }
    return { result };
  };

  const parseAgeYears = (): number | { error: string } => {
    const n = Number(age);
    if (!Number.isFinite(n) || age.trim() === "") {
      return { error: "Enter age in years for the age-adjusted buffer threshold." };
    }
    if (n < 3 || n > 25) {
      return { error: "Age should be about 3–25 years for this pediatric buffer scale." };
    }
    return n;
  };

  const calculate = () => {
    setError(null);
    const ageOut = parseAgeYears();
    if (typeof ageOut !== "number") {
      setError(ageOut.error);
      setResults(null);
      return;
    }

    const odFilled = [od.se, od.al, od.acd, od.lt, od.k].every(fieldFilled);
    const osFilled = [os.se, os.al, os.acd, os.lt, os.k].every(fieldFilled);

    if (!odFilled && !osFilled) {
      setError("Enter complete data for at least one eye.");
      setResults(null);
      return;
    }

    let odResult: BennettResult | null = null;
    let osResult: BennettResult | null = null;

    if (odFilled) {
      const out = runEye(od, "OD");
      if ("error" in out) {
        setError(out.error);
        setResults(null);
        return;
      }
      odResult = out.result;
    }
    if (osFilled) {
      const out = runEye(os, "OS");
      if ("error" in out) {
        setError(out.error);
        setResults(null);
        return;
      }
      osResult = out.result;
    }

    setResults({ od: odResult, os: osResult, ageYears: ageOut });
  };

  const loadDemo = () => {
    // Near appendix subject 1-OD style demo; age 16 uses the 14–18 floor
    const demoAge = "16";
    const demoOd: EyeForm = {
      se: "-3.75",
      al: "26.01",
      acd: "4.27",
      lt: "3.44",
      k: "7.74",
      kSteep: "",
      kFlat: "",
      cct: "0.49",
    };
    const demoOs: EyeForm = {
      se: "-5.25",
      al: "26.61",
      acd: "4.25",
      lt: "3.43",
      k: "7.79",
      kSteep: "",
      kFlat: "",
      cct: "0.48",
    };
    setPatient((prev) => ({
      ...prev,
      age: demoAge,
      kMode: "radius",
      od: demoOd,
      os: demoOs,
    }));
    setError(null);

    const odP = parseEye(demoOd, "radius", "OD");
    const osP = parseEye(demoOs, "radius", "OS");
    if (!("error" in odP) && !("error" in osP)) {
      setResults({
        od: bennettLensPower(odP),
        os: bennettLensPower(osP),
        ageYears: 16,
      });
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Absolute natural lens power (modified Bennett)
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Hernandez et al. modification of Bennett’s method — crystalline lens
            power from cycloplegic refraction, ACD, LT, AL, and mean
            keratometry. Remaining buffer is judged with an age-adjusted
            minimum, not a single +16 D cutoff.
          </p>
        </div>
        <select
          value={kMode}
          onChange={(e) => setKMode(e.target.value as "radius" | "diopters")}
          className="rounded border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700"
        >
          <option value="radius">Mean K as radius (mm)</option>
          <option value="diopters">Mean K as power (D)</option>
        </select>
      </div>

      <div className="mt-5 max-w-xs">
        <label className="mb-0.5 block text-xs font-medium text-slate-600">
          Age (years)
        </label>
        <input
          type="number"
          min={3}
          max={25}
          step={0.1}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="e.g. 9.5"
          className={inputClass}
        />
        {ageRule && Number.isFinite(parsedAge) && age.trim() !== "" && (
          <p className="mt-1 text-xs text-slate-500">
            {ageRule.label}: buffer depleted at ≤ +{ageRule.thresholdD.toFixed(1)}{" "}
            D
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <EyeFields
          title="Right eye (OD)"
          values={od}
          onChange={setOd}
          kMode={kMode}
        />
        <EyeFields
          title="Left eye (OS)"
          values={os}
          onChange={setOs}
          kMode={kMode}
        />
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={calculate}
          className="rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
        >
          Calculate lens power
        </button>
        <button
          type="button"
          onClick={loadDemo}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Try demo values
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {results && (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultCard
            label="Right eye (OD)"
            result={results.od}
            ageYears={results.ageYears}
          />
          <ResultCard
            label="Left eye (OS)"
            result={results.os}
            ageYears={results.ageYears}
          />
        </div>
      )}

      {!results && hasAnyInput && !error && (
        <p className="mt-3 text-xs text-slate-500">
          Complete all required fields for an eye, then calculate.
        </p>
      )}

      <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
        <p>
          <strong className="text-slate-800">Formula:</strong>{" "}
          <a
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4646557/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-800 underline underline-offset-2"
          >
            Hernandez VM, et al. Calculation of crystalline lens power using a
            modification of the Bennett method. Biomed Opt Express.
            2015;6(11):4501–4515
          </a>
          . Uses thin-lens position b·LT with conjugate-ratio–dependent b
          (Eqs. 16–18). Posterior corneal radius estimated as 0.81 × anterior if
          not measured. CCT defaults to 0.55 mm.
        </p>
        <p className="mt-1">
          Enter <strong>ACD from epithelium to anterior lens</strong> (usual
          biometer ACD). Prefer cycloplegic SE. Educational estimate only —
          theoretical accuracy ≈ ±0.5 D for relaxed eyes (−10 to +10 D).
        </p>
        <p className="mt-1">
          <strong className="text-slate-800">Age-adjusted buffer minimums:</strong>{" "}
          remaining lens reserve is judged against the child’s developmental
          stage, not a single +16.0 D cutoff.
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4">
          <li>
            <strong>Ages 6–9:</strong> depleted if ≤ +18.5 D (typical ~+21 to
            +23 D). A 7-year-old already at +18 D has used reserve early.
          </li>
          <li>
            <strong>Ages 10–13:</strong> depleted if ≤ +17.0 D — buffer nearing
            exhaustion as the eye matures.
          </li>
          <li>
            <strong>Ages 14–18:</strong> depleted if ≤ +15.5 D — usual biological
            floor; the lens is not expected to flatten further.
          </li>
        </ul>
      </div>
    </section>
  );
}
